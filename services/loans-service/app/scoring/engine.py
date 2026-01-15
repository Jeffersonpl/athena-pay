"""
Credit Scoring Engine
Internal scoring system based on account behavior and history
"""
from dataclasses import dataclass
from typing import Optional, Dict, List, Tuple
from datetime import datetime, timedelta
import math


@dataclass
class AccountData:
    """Account data for scoring"""
    customer_id: str
    account_id: str
    account_age_days: int
    avg_monthly_balance: float
    min_monthly_balance: float
    max_monthly_balance: float
    total_income_30d: float
    total_expenses_30d: float
    income_sources: int  # Number of different income sources
    income_regularity: float  # 0-1, how regular the income is
    pix_received_30d: float
    pix_sent_30d: float
    wire_received_30d: float
    wire_sent_30d: float
    card_spending_30d: float
    loan_payments_ontime: int
    loan_payments_late: int
    overdraft_usage_days: int  # Days with negative balance
    has_negative_records: bool  # Protests, restrictions
    negative_records_amount: float
    kyc_level: int  # 0-3
    bureau_score: Optional[int] = None  # External bureau score if available


@dataclass
class ScoreResult:
    """Score calculation result"""
    score: int  # 0-1000
    band: str  # A, B, C, D, E
    risk_level: str  # LOW, MEDIUM, HIGH, VERY_HIGH
    factors: Dict[str, Dict]  # Factor name -> {value, score, weight}
    recommendations: List[str]
    valid_until: datetime


class CreditScoringEngine:
    """
    Credit scoring engine that calculates scores based on
    customer behavior and account history.

    Score bands:
    - A: 800-1000 (Excellent) - Best rates
    - B: 650-799 (Good)
    - C: 500-649 (Fair)
    - D: 350-499 (Poor)
    - E: 0-349 (Very Poor) - Usually rejected
    """

    # Factor weights (total = 100)
    WEIGHTS = {
        "account_age": 10,
        "balance_stability": 15,
        "income_behavior": 20,
        "payment_history": 20,
        "debt_ratio": 15,
        "transaction_behavior": 10,
        "negative_records": 10,
    }

    # Score bands
    BANDS = {
        "A": (800, 1000),
        "B": (650, 799),
        "C": (500, 649),
        "D": (350, 499),
        "E": (0, 349),
    }

    # Risk levels
    RISK_LEVELS = {
        "A": "LOW",
        "B": "LOW",
        "C": "MEDIUM",
        "D": "HIGH",
        "E": "VERY_HIGH",
    }

    def calculate_score(self, data: AccountData) -> ScoreResult:
        """
        Calculate credit score based on account data.

        Returns score from 0-1000 with band classification.
        """
        factors = {}

        # 1. Account Age Score (0-100)
        age_score = self._score_account_age(data.account_age_days)
        factors["account_age"] = {
            "value": data.account_age_days,
            "score": age_score,
            "weight": self.WEIGHTS["account_age"],
            "description": f"Account age: {data.account_age_days} days"
        }

        # 2. Balance Stability Score (0-100)
        balance_score = self._score_balance_stability(
            data.avg_monthly_balance,
            data.min_monthly_balance,
            data.max_monthly_balance,
            data.overdraft_usage_days
        )
        factors["balance_stability"] = {
            "value": data.avg_monthly_balance,
            "score": balance_score,
            "weight": self.WEIGHTS["balance_stability"],
            "description": f"Average balance: R$ {data.avg_monthly_balance:,.2f}"
        }

        # 3. Income Behavior Score (0-100)
        income_score = self._score_income_behavior(
            data.total_income_30d,
            data.income_sources,
            data.income_regularity
        )
        factors["income_behavior"] = {
            "value": data.total_income_30d,
            "score": income_score,
            "weight": self.WEIGHTS["income_behavior"],
            "description": f"Monthly income: R$ {data.total_income_30d:,.2f}"
        }

        # 4. Payment History Score (0-100)
        payment_score = self._score_payment_history(
            data.loan_payments_ontime,
            data.loan_payments_late
        )
        factors["payment_history"] = {
            "value": f"{data.loan_payments_ontime} on time, {data.loan_payments_late} late",
            "score": payment_score,
            "weight": self.WEIGHTS["payment_history"],
            "description": f"Payment history: {data.loan_payments_ontime} on time"
        }

        # 5. Debt Ratio Score (0-100)
        debt_ratio = self._calculate_debt_ratio(
            data.total_expenses_30d,
            data.total_income_30d
        )
        debt_score = self._score_debt_ratio(debt_ratio)
        factors["debt_ratio"] = {
            "value": debt_ratio,
            "score": debt_score,
            "weight": self.WEIGHTS["debt_ratio"],
            "description": f"Debt ratio: {debt_ratio:.1%}"
        }

        # 6. Transaction Behavior Score (0-100)
        transaction_score = self._score_transaction_behavior(
            data.pix_received_30d,
            data.pix_sent_30d,
            data.card_spending_30d,
            data.total_income_30d
        )
        factors["transaction_behavior"] = {
            "value": data.card_spending_30d,
            "score": transaction_score,
            "weight": self.WEIGHTS["transaction_behavior"],
            "description": "Transaction patterns"
        }

        # 7. Negative Records Score (0-100)
        negative_score = self._score_negative_records(
            data.has_negative_records,
            data.negative_records_amount
        )
        factors["negative_records"] = {
            "value": data.negative_records_amount,
            "score": negative_score,
            "weight": self.WEIGHTS["negative_records"],
            "description": "No negative records" if not data.has_negative_records else "Has negative records"
        }

        # Calculate weighted final score
        final_score = 0
        for factor_name, factor_data in factors.items():
            final_score += factor_data["score"] * factor_data["weight"] / 100

        # Convert to 0-1000 scale
        final_score = int(final_score * 10)
        final_score = max(0, min(1000, final_score))

        # Apply bureau score adjustment if available
        if data.bureau_score is not None:
            # Blend internal and bureau score (70% internal, 30% bureau)
            bureau_normalized = data.bureau_score  # Assuming bureau is also 0-1000
            final_score = int(final_score * 0.7 + bureau_normalized * 0.3)

        # Determine band and risk level
        band = self._get_band(final_score)
        risk_level = self.RISK_LEVELS[band]

        # Generate recommendations
        recommendations = self._generate_recommendations(factors, band)

        return ScoreResult(
            score=final_score,
            band=band,
            risk_level=risk_level,
            factors=factors,
            recommendations=recommendations,
            valid_until=datetime.utcnow() + timedelta(days=30)
        )

    def _score_account_age(self, days: int) -> int:
        """Score based on account age"""
        if days < 30:
            return 10
        elif days < 90:
            return 30
        elif days < 180:
            return 50
        elif days < 365:
            return 70
        elif days < 730:
            return 85
        else:
            return 100

    def _score_balance_stability(
        self,
        avg_balance: float,
        min_balance: float,
        max_balance: float,
        overdraft_days: int
    ) -> int:
        """Score based on balance stability"""
        score = 50  # Base score

        # Positive average balance bonus
        if avg_balance >= 10000:
            score += 30
        elif avg_balance >= 5000:
            score += 20
        elif avg_balance >= 1000:
            score += 10
        elif avg_balance >= 100:
            score += 5

        # Stability (low variance is good)
        if max_balance > 0:
            variance_ratio = (max_balance - min_balance) / max_balance
            if variance_ratio < 0.3:
                score += 15  # Very stable
            elif variance_ratio < 0.5:
                score += 10
            elif variance_ratio < 0.7:
                score += 5

        # Penalty for overdraft usage
        if overdraft_days > 20:
            score -= 30
        elif overdraft_days > 10:
            score -= 20
        elif overdraft_days > 5:
            score -= 10
        elif overdraft_days > 0:
            score -= 5

        return max(0, min(100, score))

    def _score_income_behavior(
        self,
        monthly_income: float,
        income_sources: int,
        regularity: float
    ) -> int:
        """Score based on income patterns"""
        score = 0

        # Income amount (assuming minimum wage ~R$ 1,400)
        if monthly_income >= 20000:
            score += 50
        elif monthly_income >= 10000:
            score += 40
        elif monthly_income >= 5000:
            score += 30
        elif monthly_income >= 2000:
            score += 20
        elif monthly_income >= 1000:
            score += 10

        # Multiple income sources (diversification)
        if income_sources >= 3:
            score += 20
        elif income_sources >= 2:
            score += 15
        elif income_sources >= 1:
            score += 10

        # Regularity (0-1)
        score += int(regularity * 30)

        return max(0, min(100, score))

    def _score_payment_history(self, on_time: int, late: int) -> int:
        """Score based on payment history"""
        total = on_time + late
        if total == 0:
            return 50  # No history, neutral score

        on_time_ratio = on_time / total

        if on_time_ratio >= 1.0:
            return 100
        elif on_time_ratio >= 0.95:
            return 90
        elif on_time_ratio >= 0.90:
            return 75
        elif on_time_ratio >= 0.80:
            return 60
        elif on_time_ratio >= 0.70:
            return 40
        elif on_time_ratio >= 0.50:
            return 20
        else:
            return 0

    def _calculate_debt_ratio(self, expenses: float, income: float) -> float:
        """Calculate debt/expense to income ratio"""
        if income <= 0:
            return 1.0
        return min(expenses / income, 1.5)

    def _score_debt_ratio(self, ratio: float) -> int:
        """Score based on debt ratio"""
        if ratio <= 0.3:
            return 100  # Excellent - low debt
        elif ratio <= 0.4:
            return 85
        elif ratio <= 0.5:
            return 70
        elif ratio <= 0.6:
            return 50
        elif ratio <= 0.7:
            return 30
        elif ratio <= 0.8:
            return 15
        else:
            return 0  # Very high debt ratio

    def _score_transaction_behavior(
        self,
        pix_received: float,
        pix_sent: float,
        card_spending: float,
        income: float
    ) -> int:
        """Score based on transaction patterns"""
        score = 50  # Base

        if income <= 0:
            return score

        # Active account bonus
        total_transactions = pix_received + pix_sent + card_spending
        if total_transactions > 0:
            score += 20

        # Healthy spending ratio
        spending_ratio = card_spending / income if income > 0 else 0
        if 0.1 <= spending_ratio <= 0.5:
            score += 20  # Healthy spending
        elif spending_ratio > 0.8:
            score -= 10  # Overspending

        # PIX activity (good sign of digital engagement)
        if pix_received > 0 or pix_sent > 0:
            score += 10

        return max(0, min(100, score))

    def _score_negative_records(self, has_records: bool, amount: float) -> int:
        """Score based on negative records"""
        if not has_records:
            return 100  # Perfect, no negative records

        # Has negative records - score based on amount
        if amount >= 10000:
            return 0
        elif amount >= 5000:
            return 20
        elif amount >= 1000:
            return 40
        elif amount >= 100:
            return 60
        else:
            return 80

    def _get_band(self, score: int) -> str:
        """Get score band based on score"""
        for band, (low, high) in self.BANDS.items():
            if low <= score <= high:
                return band
        return "E"

    def _generate_recommendations(self, factors: Dict, band: str) -> List[str]:
        """Generate recommendations based on score factors"""
        recommendations = []

        # Check each factor for improvements
        for factor_name, factor_data in factors.items():
            if factor_data["score"] < 50:
                if factor_name == "account_age":
                    recommendations.append(
                        "Mantenha sua conta ativa por mais tempo para melhorar seu score"
                    )
                elif factor_name == "balance_stability":
                    recommendations.append(
                        "Mantenha um saldo médio mais alto em sua conta"
                    )
                elif factor_name == "income_behavior":
                    recommendations.append(
                        "Receba pagamentos regulares em sua conta para demonstrar renda estável"
                    )
                elif factor_name == "payment_history":
                    recommendations.append(
                        "Pague suas contas em dia para melhorar seu histórico"
                    )
                elif factor_name == "debt_ratio":
                    recommendations.append(
                        "Reduza suas despesas mensais para melhorar seu índice de endividamento"
                    )
                elif factor_name == "negative_records":
                    recommendations.append(
                        "Regularize pendências financeiras para melhorar seu score"
                    )

        if band in ["D", "E"]:
            recommendations.append(
                "Seu score atual limita suas opções de crédito. Siga as recomendações acima."
            )

        return recommendations


def get_rate_for_band(band: str, base_rates: Dict[str, float]) -> float:
    """Get interest rate based on score band"""
    rate_map = {
        "A": base_rates.get("rate_band_a", 0.015),
        "B": base_rates.get("rate_band_b", 0.020),
        "C": base_rates.get("rate_band_c", 0.028),
        "D": base_rates.get("rate_band_d", 0.038),
        "E": base_rates.get("rate_band_e", 0.050),
    }
    return rate_map.get(band, 0.050)


def calculate_loan_terms(
    principal: float,
    monthly_rate: float,
    term_months: int,
    iof_daily: float = 0.000082,
    iof_additional: float = 0.0038
) -> Dict:
    """
    Calculate loan terms using Price system (constant payments)

    Returns:
        monthly_payment: Fixed monthly payment
        total_amount: Total amount to pay
        iof_amount: IOF tax amount
        cet: Custo Efetivo Total (annual)
        schedule: Payment schedule
    """
    # Calculate IOF
    # IOF daily: calculated on principal for the loan term
    # IOF additional: 0.38% flat on principal
    avg_days = (term_months * 30) / 2  # Average days for IOF calculation
    iof_daily_amount = principal * iof_daily * min(avg_days, 365)
    iof_additional_amount = principal * iof_additional
    iof_total = iof_daily_amount + iof_additional_amount

    # Financed amount includes IOF
    financed_amount = principal + iof_total

    # Price system formula for monthly payment
    if monthly_rate > 0:
        monthly_payment = financed_amount * (
            monthly_rate * math.pow(1 + monthly_rate, term_months)
        ) / (
            math.pow(1 + monthly_rate, term_months) - 1
        )
    else:
        monthly_payment = financed_amount / term_months

    total_amount = monthly_payment * term_months

    # Calculate CET (approximate - full calculation is complex)
    # CET includes all costs annualized
    annual_rate = math.pow(1 + monthly_rate, 12) - 1
    cet = annual_rate * 100  # As percentage

    # Generate payment schedule
    schedule = []
    balance = financed_amount
    for i in range(1, term_months + 1):
        interest = balance * monthly_rate
        principal_payment = monthly_payment - interest
        balance -= principal_payment

        schedule.append({
            "number": i,
            "payment": round(monthly_payment, 2),
            "principal": round(principal_payment, 2),
            "interest": round(interest, 2),
            "balance": round(max(0, balance), 2)
        })

    return {
        "principal": principal,
        "financed_amount": round(financed_amount, 2),
        "monthly_payment": round(monthly_payment, 2),
        "total_amount": round(total_amount, 2),
        "total_interest": round(total_amount - financed_amount, 2),
        "iof_amount": round(iof_total, 2),
        "monthly_rate": monthly_rate,
        "annual_rate": round(annual_rate * 100, 2),
        "cet": round(cet, 2),
        "term_months": term_months,
        "schedule": schedule
    }
