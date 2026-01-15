"""
Fraud Detection Engine
Real-time fraud scoring for card transactions
"""
import os
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

ENV = os.getenv("ENV", "dev")


class FraudRiskLevel(Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class FraudFlag(Enum):
    VELOCITY_EXCEEDED = "VELOCITY_EXCEEDED"
    HIGH_AMOUNT = "HIGH_AMOUNT"
    NEW_MERCHANT = "NEW_MERCHANT"
    UNUSUAL_TIME = "UNUSUAL_TIME"
    GEOGRAPHIC_ANOMALY = "GEOGRAPHIC_ANOMALY"
    BLOCKED_MERCHANT = "BLOCKED_MERCHANT"
    BLOCKED_MCC = "BLOCKED_MCC"
    MULTIPLE_DECLINES = "MULTIPLE_DECLINES"
    DEVICE_CHANGE = "DEVICE_CHANGE"
    PATTERN_ANOMALY = "PATTERN_ANOMALY"


@dataclass
class FraudCheckRequest:
    """Request for fraud check"""
    card_id: str
    customer_id: str
    amount: float
    currency: str
    merchant_name: str
    merchant_id: str
    merchant_category_code: str
    merchant_city: str
    merchant_country: str
    entry_mode: str
    device_fingerprint: Optional[str] = None
    ip_address: Optional[str] = None


@dataclass
class FraudCheckResult:
    """Result of fraud check"""
    score: float  # 0-100
    risk_level: FraudRiskLevel
    flags: List[FraudFlag]
    should_block: bool
    should_challenge: bool  # Require 3DS
    details: Dict[str, Any]


class FraudEngine:
    """
    Real-time fraud detection engine

    Analyzes transactions based on:
    - Velocity (transaction frequency)
    - Amount patterns
    - Geographic location
    - Merchant risk
    - Device fingerprinting
    - Behavioral patterns
    """

    def __init__(self):
        # Configurable thresholds
        self.velocity_limit_1h = int(os.getenv("FRAUD_VELOCITY_1H", "5"))
        self.velocity_limit_24h = int(os.getenv("FRAUD_VELOCITY_24H", "20"))
        self.high_amount_threshold = float(os.getenv("FRAUD_HIGH_AMOUNT", "5000"))
        self.critical_amount_threshold = float(os.getenv("FRAUD_CRITICAL_AMOUNT", "10000"))

        # High-risk MCCs (gambling, crypto, etc.)
        self.high_risk_mccs = {
            "7995": "GAMBLING",
            "6051": "CRYPTO",
            "5967": "DIRECT_MARKETING",
            "5966": "OUTBOUND_TELEMARKETING",
            "5962": "TRAVEL_RELATED",
        }

    async def check(
        self,
        request: FraudCheckRequest,
        recent_transactions: List[Dict] = None
    ) -> FraudCheckResult:
        """
        Perform fraud check on transaction

        Returns a score from 0-100 where:
        - 0-30: Low risk (auto-approve)
        - 31-60: Medium risk (may need 3DS)
        - 61-80: High risk (require 3DS)
        - 81-100: Critical risk (block)
        """
        score = 0
        flags = []
        details = {}

        # 1. Check amount
        amount_score, amount_flags = self._check_amount(request.amount)
        score += amount_score
        flags.extend(amount_flags)
        details["amount_analysis"] = {
            "score": amount_score,
            "is_high": request.amount > self.high_amount_threshold
        }

        # 2. Check velocity
        if recent_transactions:
            velocity_score, velocity_flags = self._check_velocity(recent_transactions)
            score += velocity_score
            flags.extend(velocity_flags)
            details["velocity_analysis"] = {
                "score": velocity_score,
                "tx_count_1h": len([t for t in recent_transactions
                                   if t.get("created_at", datetime.min) > datetime.utcnow() - timedelta(hours=1)]),
                "tx_count_24h": len(recent_transactions)
            }

        # 3. Check MCC risk
        mcc_score, mcc_flags = self._check_mcc(request.merchant_category_code)
        score += mcc_score
        flags.extend(mcc_flags)
        details["mcc_analysis"] = {
            "score": mcc_score,
            "mcc": request.merchant_category_code,
            "is_high_risk": request.merchant_category_code in self.high_risk_mccs
        }

        # 4. Check time of day
        time_score, time_flags = self._check_time()
        score += time_score
        flags.extend(time_flags)
        details["time_analysis"] = {
            "score": time_score,
            "hour": datetime.utcnow().hour
        }

        # 5. Check geographic anomaly
        if request.merchant_country and request.merchant_country != "BR":
            geo_score, geo_flags = self._check_geography(request.merchant_country)
            score += geo_score
            flags.extend(geo_flags)
            details["geo_analysis"] = {
                "score": geo_score,
                "country": request.merchant_country,
                "is_international": True
            }

        # 6. Check entry mode
        entry_score = self._check_entry_mode(request.entry_mode)
        score += entry_score
        details["entry_mode_analysis"] = {
            "score": entry_score,
            "mode": request.entry_mode
        }

        # Normalize score to 0-100
        score = min(100, max(0, score))

        # Determine risk level
        if score <= 30:
            risk_level = FraudRiskLevel.LOW
        elif score <= 60:
            risk_level = FraudRiskLevel.MEDIUM
        elif score <= 80:
            risk_level = FraudRiskLevel.HIGH
        else:
            risk_level = FraudRiskLevel.CRITICAL

        return FraudCheckResult(
            score=score,
            risk_level=risk_level,
            flags=flags,
            should_block=score > 80,
            should_challenge=score > 60,
            details=details
        )

    def _check_amount(self, amount: float) -> tuple:
        """Check transaction amount"""
        score = 0
        flags = []

        if amount > self.critical_amount_threshold:
            score = 30
            flags.append(FraudFlag.HIGH_AMOUNT)
        elif amount > self.high_amount_threshold:
            score = 15
            flags.append(FraudFlag.HIGH_AMOUNT)
        elif amount > 1000:
            score = 5

        return score, flags

    def _check_velocity(self, recent_transactions: List[Dict]) -> tuple:
        """Check transaction velocity"""
        score = 0
        flags = []

        now = datetime.utcnow()
        tx_1h = len([t for t in recent_transactions
                     if t.get("created_at", datetime.min) > now - timedelta(hours=1)])
        tx_24h = len(recent_transactions)

        if tx_1h >= self.velocity_limit_1h:
            score = 25
            flags.append(FraudFlag.VELOCITY_EXCEEDED)
        elif tx_24h >= self.velocity_limit_24h:
            score = 20
            flags.append(FraudFlag.VELOCITY_EXCEEDED)
        elif tx_1h >= 3:
            score = 10

        return score, flags

    def _check_mcc(self, mcc: str) -> tuple:
        """Check Merchant Category Code risk"""
        score = 0
        flags = []

        if mcc in self.high_risk_mccs:
            score = 20
            flags.append(FraudFlag.BLOCKED_MCC)

        return score, flags

    def _check_time(self) -> tuple:
        """Check time of day"""
        score = 0
        flags = []

        hour = datetime.utcnow().hour
        # Unusual hours: midnight to 5am
        if 0 <= hour < 5:
            score = 10
            flags.append(FraudFlag.UNUSUAL_TIME)

        return score, flags

    def _check_geography(self, country: str) -> tuple:
        """Check geographic location"""
        score = 0
        flags = []

        # High-risk countries
        high_risk_countries = {"NG", "RU", "UA", "BY", "VE"}

        if country in high_risk_countries:
            score = 25
            flags.append(FraudFlag.GEOGRAPHIC_ANOMALY)
        elif country != "BR":
            score = 10
            flags.append(FraudFlag.GEOGRAPHIC_ANOMALY)

        return score, flags

    def _check_entry_mode(self, entry_mode: str) -> int:
        """Check entry mode risk"""
        # Higher risk for manual entry and magstripe
        risk_scores = {
            "CHIP": 0,
            "CONTACTLESS": 0,
            "ECOMMERCE": 5,
            "MANUAL": 15,
            "MAGSTRIPE": 20
        }
        return risk_scores.get(entry_mode, 10)


# Default fraud engine
fraud_engine = FraudEngine()
