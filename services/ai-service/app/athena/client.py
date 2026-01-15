"""
Athena AI Client
Client for connecting to Athena's AI backend (Athena)
"""
import os
import httpx
import json
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum


ENV = os.getenv("ENV", "dev")
ATHENA_API_URL = os.getenv("ATHENA_API_URL", "http://athena:8090")
ATHENA_API_KEY = os.getenv("ATHENA_API_KEY", "")


class MessageRole(str, Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


@dataclass
class Message:
    """Chat message"""
    role: MessageRole
    content: str
    timestamp: datetime = field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ConversationContext:
    """Conversation context for maintaining state"""
    customer_id: str
    session_id: str
    messages: List[Message] = field(default_factory=list)
    customer_data: Dict[str, Any] = field(default_factory=dict)
    intent: Optional[str] = None
    entities: Dict[str, Any] = field(default_factory=dict)


@dataclass
class AIResponse:
    """AI response from Athena"""
    content: str
    intent: Optional[str] = None
    confidence: float = 0.0
    actions: List[Dict[str, Any]] = field(default_factory=list)
    suggestions: List[str] = field(default_factory=list)
    requires_action: bool = False
    action_type: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


class AthenaClient:
    """
    Client for Athena AI service.

    Athena provides:
    - Conversational AI for customer support
    - Intent recognition and entity extraction
    - Financial insights generation
    - Fraud detection assistance
    - Personalized recommendations
    """

    def __init__(self):
        self.base_url = ATHENA_API_URL
        self.api_key = ATHENA_API_KEY
        self.enabled = os.getenv("ATHENA_ENABLED", "false").lower() == "true"

        # System prompts for different contexts
        self.system_prompts = {
            "support": self._get_support_prompt(),
            "financial_advisor": self._get_advisor_prompt(),
            "fraud_detection": self._get_fraud_prompt(),
        }

    def _get_support_prompt(self) -> str:
        return """Voce e a Athena, assistente virtual do Athena Pay, um banco digital brasileiro.

Seu papel e:
- Ajudar clientes com duvidas sobre suas contas, transacoes, cartoes e servicos
- Explicar produtos financeiros de forma simples e clara
- Resolver problemas tecnicos quando possivel
- Encaminhar para atendimento humano quando necessario

Regras:
- Sempre seja educado e profissional
- Nunca peca senhas ou dados sensiveis
- Use linguagem simples e acessivel
- Confirme informacoes antes de tomar acoes
- Ofereca alternativas quando nao puder ajudar diretamente

Voce tem acesso aos dados do cliente para personalizar o atendimento."""

    def _get_advisor_prompt(self) -> str:
        return """Voce e a Athena, consultora financeira virtual do Athena Pay.

Seu papel e:
- Analisar a saude financeira do cliente
- Sugerir formas de economizar
- Recomendar investimentos adequados ao perfil
- Ajudar com planejamento financeiro
- Explicar produtos de credito

Regras:
- Seja cauteloso com recomendacoes de investimento
- Sempre alerte sobre riscos
- Considere o perfil e objetivos do cliente
- Nao faca promessas de retorno
- Sugira diversificacao quando apropriado"""

    def _get_fraud_prompt(self) -> str:
        return """Voce e um assistente especializado em deteccao de fraudes do Athena Pay.

Seu papel e:
- Analisar padroes de transacoes suspeitas
- Identificar comportamentos anomalos
- Sugerir acoes de prevencao
- Classificar nivel de risco

Voce recebera dados de transacoes e deve fornecer analise detalhada."""

    async def chat(
        self,
        context: ConversationContext,
        user_message: str,
        mode: str = "support"
    ) -> AIResponse:
        """
        Send a message to Athena and get a response.

        Args:
            context: Conversation context with history
            user_message: User's message
            mode: Chat mode (support, financial_advisor, fraud_detection)

        Returns:
            AIResponse with the AI's response and metadata
        """
        # Add user message to context
        context.messages.append(Message(
            role=MessageRole.USER,
            content=user_message
        ))

        if ENV == "dev" or not self.enabled:
            return await self._simulate_response(context, user_message, mode)

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/v1/chat",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "session_id": context.session_id,
                        "customer_id": context.customer_id,
                        "message": user_message,
                        "history": [
                            {"role": m.role.value, "content": m.content}
                            for m in context.messages[-10:]  # Last 10 messages
                        ],
                        "system_prompt": self.system_prompts.get(mode, self.system_prompts["support"]),
                        "customer_context": context.customer_data,
                        "mode": mode
                    },
                    timeout=30.0
                )

                if response.status_code == 200:
                    data = response.json()
                    ai_response = AIResponse(
                        content=data.get("content", ""),
                        intent=data.get("intent"),
                        confidence=data.get("confidence", 0.0),
                        actions=data.get("actions", []),
                        suggestions=data.get("suggestions", []),
                        requires_action=data.get("requires_action", False),
                        action_type=data.get("action_type"),
                        metadata=data.get("metadata", {})
                    )

                    # Add assistant response to context
                    context.messages.append(Message(
                        role=MessageRole.ASSISTANT,
                        content=ai_response.content,
                        metadata={"intent": ai_response.intent}
                    ))

                    return ai_response

        except Exception as e:
            print(f"Athena API error: {e}")

        return await self._simulate_response(context, user_message, mode)

    async def analyze_intent(self, message: str) -> Dict[str, Any]:
        """
        Analyze user intent from a message.

        Returns:
            Dict with intent, entities, and confidence
        """
        if ENV == "dev" or not self.enabled:
            return self._simulate_intent_analysis(message)

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/v1/intent",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={"message": message},
                    timeout=10.0
                )

                if response.status_code == 200:
                    return response.json()
        except Exception:
            pass

        return self._simulate_intent_analysis(message)

    async def generate_insights(
        self,
        customer_id: str,
        financial_data: Dict[str, Any]
    ) -> List[str]:
        """
        Generate personalized financial insights.

        Args:
            customer_id: Customer identifier
            financial_data: Customer's financial data

        Returns:
            List of insight strings
        """
        if ENV == "dev" or not self.enabled:
            return self._simulate_insights(financial_data)

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/v1/insights",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "customer_id": customer_id,
                        "financial_data": financial_data
                    },
                    timeout=15.0
                )

                if response.status_code == 200:
                    return response.json().get("insights", [])
        except Exception:
            pass

        return self._simulate_insights(financial_data)

    async def detect_fraud_patterns(
        self,
        transaction_data: Dict[str, Any],
        customer_history: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Analyze transaction for fraud patterns.

        Returns:
            Dict with risk_score, indicators, and recommendation
        """
        if ENV == "dev" or not self.enabled:
            return self._simulate_fraud_analysis(transaction_data)

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/v1/fraud/analyze",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "transaction": transaction_data,
                        "history": customer_history
                    },
                    timeout=10.0
                )

                if response.status_code == 200:
                    return response.json()
        except Exception:
            pass

        return self._simulate_fraud_analysis(transaction_data)

    # Simulation methods for development
    async def _simulate_response(
        self,
        context: ConversationContext,
        message: str,
        mode: str
    ) -> AIResponse:
        """Simulate AI response in dev mode"""
        message_lower = message.lower()

        # Intent detection
        intent, confidence = self._detect_intent(message_lower)

        # Generate response based on intent
        response_content = self._generate_response(intent, message_lower, context)
        suggestions = self._generate_suggestions(intent)

        ai_response = AIResponse(
            content=response_content,
            intent=intent,
            confidence=confidence,
            suggestions=suggestions,
            requires_action=intent in ["transfer", "payment", "block_card"],
            action_type=intent if intent in ["transfer", "payment", "block_card"] else None
        )

        context.messages.append(Message(
            role=MessageRole.ASSISTANT,
            content=ai_response.content
        ))

        return ai_response

    def _detect_intent(self, message: str) -> tuple:
        """Simple intent detection"""
        intents = {
            "greeting": ["oi", "ola", "bom dia", "boa tarde", "boa noite", "hey"],
            "balance": ["saldo", "quanto tenho", "meu dinheiro", "extrato"],
            "transfer": ["transferir", "pix", "enviar dinheiro", "mandar"],
            "payment": ["pagar", "boleto", "fatura", "conta"],
            "card": ["cartao", "limite", "fatura do cartao"],
            "block_card": ["bloquear cartao", "perdi cartao", "roubaram"],
            "loan": ["emprestimo", "credito", "financiamento"],
            "help": ["ajuda", "suporte", "problema", "nao consigo"],
            "bye": ["tchau", "ate mais", "obrigado", "valeu"]
        }

        for intent, keywords in intents.items():
            if any(kw in message for kw in keywords):
                return intent, 0.85

        return "general", 0.5

    def _generate_response(
        self,
        intent: str,
        message: str,
        context: ConversationContext
    ) -> str:
        """Generate response based on intent"""
        customer_name = context.customer_data.get("name", "")
        first_name = customer_name.split()[0] if customer_name else ""

        responses = {
            "greeting": f"Ola{', ' + first_name if first_name else ''}! Sou a Athena, sua assistente virtual. Como posso te ajudar hoje?",
            "balance": "Voce pode ver seu saldo atualizado na tela inicial do app. Quer que eu te mostre como consultar o extrato detalhado?",
            "transfer": "Posso te ajudar com transferencias! Voce quer enviar um PIX, TED ou DOC?",
            "payment": "Para pagar boletos ou contas, voce pode usar o PIX, escanear o codigo de barras ou digitar a linha digitavel. Como prefere fazer?",
            "card": "Sobre seu cartao, posso te ajudar com: limite disponivel, fatura, bloqueio ou desbloqueio. O que precisa?",
            "block_card": "Entendo sua preocupacao! Para sua seguranca, posso iniciar o bloqueio do cartao agora. Deseja prosseguir?",
            "loan": "Temos opcoes de credito pre-aprovado para voce! Quer fazer uma simulacao de emprestimo?",
            "help": "Estou aqui para ajudar! Me conte qual e o problema que esta enfrentando e vou fazer o possivel para resolver.",
            "bye": f"Ate mais{', ' + first_name if first_name else ''}! Se precisar de algo, e so chamar. Tenha um otimo dia!",
            "general": "Entendi! Posso te ajudar com saldo, transferencias, pagamentos, cartoes ou emprestimos. Sobre qual assunto quer saber mais?"
        }

        return responses.get(intent, responses["general"])

    def _generate_suggestions(self, intent: str) -> List[str]:
        """Generate quick reply suggestions"""
        suggestions_map = {
            "greeting": ["Ver saldo", "Fazer PIX", "Ver cartoes"],
            "balance": ["Ver extrato", "Fazer transferencia", "Voltar"],
            "transfer": ["Enviar PIX", "Enviar TED", "Ver contatos"],
            "payment": ["Pagar com PIX", "Escanear boleto", "Agendar pagamento"],
            "card": ["Ver fatura", "Ver limite", "Bloquear cartao"],
            "block_card": ["Confirmar bloqueio", "Cancelar", "Falar com atendente"],
            "loan": ["Simular emprestimo", "Ver taxas", "Falar com especialista"],
            "help": ["Chat com humano", "Ver tutoriais", "Ligar para suporte"],
            "general": ["Ver saldo", "Fazer PIX", "Ajuda"]
        }

        return suggestions_map.get(intent, suggestions_map["general"])

    def _simulate_intent_analysis(self, message: str) -> Dict[str, Any]:
        """Simulate intent analysis"""
        intent, confidence = self._detect_intent(message.lower())
        return {
            "intent": intent,
            "confidence": confidence,
            "entities": {},
            "language": "pt-BR"
        }

    def _simulate_insights(self, financial_data: Dict[str, Any]) -> List[str]:
        """Simulate financial insights"""
        balance = financial_data.get("balance", 0)
        spending = financial_data.get("monthly_spending", 0)

        insights = []

        if balance > 5000:
            insights.append("Voce tem um saldo positivo. Considere investir parte em CDB ou Tesouro Direto.")

        if spending > balance * 0.8:
            insights.append("Seus gastos mensais estao altos em relacao ao saldo. Considere revisar despesas.")

        insights.append("Manter uma reserva de emergencia de 6 meses de despesas e uma boa pratica.")

        return insights

    def _simulate_fraud_analysis(self, transaction: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate fraud analysis"""
        amount = transaction.get("amount", 0)

        risk_score = 0.05
        indicators = []

        if amount > 10000:
            risk_score += 0.15
            indicators.append("Valor acima do padrao")

        return {
            "risk_score": risk_score,
            "indicators": indicators,
            "recommendation": "APPROVE" if risk_score < 0.3 else "REVIEW",
            "confidence": 0.85
        }


# Singleton instance
athena_client = AthenaClient()
