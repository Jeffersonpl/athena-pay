"""
Athena AI Service
Central AI service for conversational AI, insights, and fraud detection

This service acts as a gateway to Athena AI and provides:
- Chat API for customer support
- Financial insights generation
- Fraud detection assistance
- Intent recognition
"""
import os
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.athena.client import (
    AthenaClient,
    ConversationContext,
    Message,
    MessageRole,
    athena_client
)


ENV = os.getenv("ENV", "dev")

# In-memory session storage (use Redis in production)
sessions: Dict[str, ConversationContext] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("AI Service starting...")
    yield
    print("AI Service shutting down...")


app = FastAPI(
    title="Athena AI Service",
    description="AI-powered features for Athena Pay",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Models ====================

class ChatMessageRequest(BaseModel):
    """Chat message request"""
    session_id: Optional[str] = None
    customer_id: str
    message: str
    mode: str = Field(default="support", description="Chat mode: support, financial_advisor, fraud_detection")
    customer_data: Optional[Dict[str, Any]] = None


class ChatMessageResponse(BaseModel):
    """Chat message response"""
    session_id: str
    response: str
    intent: Optional[str] = None
    confidence: float = 0.0
    suggestions: List[str] = []
    requires_action: bool = False
    action_type: Optional[str] = None


class IntentAnalysisRequest(BaseModel):
    """Intent analysis request"""
    message: str


class IntentAnalysisResponse(BaseModel):
    """Intent analysis response"""
    intent: str
    confidence: float
    entities: Dict[str, Any] = {}


class InsightsRequest(BaseModel):
    """Financial insights request"""
    customer_id: str
    balance: float = 0.0
    monthly_spending: float = 0.0
    monthly_income: float = 0.0
    savings_rate: float = 0.0
    investment_balance: float = 0.0
    debt_balance: float = 0.0
    transaction_history: Optional[List[Dict[str, Any]]] = None


class InsightsResponse(BaseModel):
    """Financial insights response"""
    insights: List[str]
    recommendations: List[Dict[str, Any]] = []
    score: Optional[int] = None


class FraudAnalysisRequest(BaseModel):
    """Fraud analysis request"""
    transaction_id: str
    customer_id: str
    amount: float
    transaction_type: str
    destination: Optional[str] = None
    device_fingerprint: Optional[str] = None
    ip_address: Optional[str] = None
    location: Optional[Dict[str, Any]] = None


class FraudAnalysisResponse(BaseModel):
    """Fraud analysis response"""
    risk_score: float
    recommendation: str
    indicators: List[str] = []
    confidence: float


class ConversationHistoryResponse(BaseModel):
    """Conversation history response"""
    session_id: str
    customer_id: str
    messages: List[Dict[str, Any]]
    created_at: str


# ==================== Endpoints ====================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ai-service",
        "timestamp": datetime.utcnow().isoformat(),
        "athena_enabled": athena_client.enabled
    }


@app.post("/chat", response_model=ChatMessageResponse)
async def chat(request: ChatMessageRequest):
    """
    Send a chat message and get AI response.

    The AI can:
    - Answer questions about accounts, transactions, cards
    - Help with common tasks
    - Provide financial advice
    - Detect when human intervention is needed
    """
    # Get or create session
    session_id = request.session_id or str(uuid.uuid4())

    if session_id not in sessions:
        sessions[session_id] = ConversationContext(
            customer_id=request.customer_id,
            session_id=session_id,
            customer_data=request.customer_data or {}
        )
    else:
        # Update customer data if provided
        if request.customer_data:
            sessions[session_id].customer_data.update(request.customer_data)

    context = sessions[session_id]

    # Get AI response
    ai_response = await athena_client.chat(
        context=context,
        user_message=request.message,
        mode=request.mode
    )

    return ChatMessageResponse(
        session_id=session_id,
        response=ai_response.content,
        intent=ai_response.intent,
        confidence=ai_response.confidence,
        suggestions=ai_response.suggestions,
        requires_action=ai_response.requires_action,
        action_type=ai_response.action_type
    )


@app.get("/chat/history/{session_id}", response_model=ConversationHistoryResponse)
async def get_chat_history(session_id: str):
    """Get conversation history for a session"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    context = sessions[session_id]

    return ConversationHistoryResponse(
        session_id=session_id,
        customer_id=context.customer_id,
        messages=[
            {
                "role": msg.role.value,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat()
            }
            for msg in context.messages
        ],
        created_at=context.messages[0].timestamp.isoformat() if context.messages else datetime.utcnow().isoformat()
    )


@app.delete("/chat/session/{session_id}")
async def end_session(session_id: str):
    """End a chat session"""
    if session_id in sessions:
        del sessions[session_id]
        return {"status": "session_ended", "session_id": session_id}

    return {"status": "session_not_found", "session_id": session_id}


@app.post("/intent", response_model=IntentAnalysisResponse)
async def analyze_intent(request: IntentAnalysisRequest):
    """
    Analyze user intent from a message.

    Returns the detected intent, confidence score, and extracted entities.
    """
    result = await athena_client.analyze_intent(request.message)

    return IntentAnalysisResponse(
        intent=result.get("intent", "unknown"),
        confidence=result.get("confidence", 0.0),
        entities=result.get("entities", {})
    )


@app.post("/insights", response_model=InsightsResponse)
async def generate_insights(request: InsightsRequest):
    """
    Generate personalized financial insights for a customer.

    Analyzes spending patterns, savings rate, and provides recommendations.
    """
    financial_data = {
        "balance": request.balance,
        "monthly_spending": request.monthly_spending,
        "monthly_income": request.monthly_income,
        "savings_rate": request.savings_rate,
        "investment_balance": request.investment_balance,
        "debt_balance": request.debt_balance,
        "transactions": request.transaction_history or []
    }

    insights = await athena_client.generate_insights(
        customer_id=request.customer_id,
        financial_data=financial_data
    )

    # Generate recommendations
    recommendations = []

    if request.savings_rate < 0.1:
        recommendations.append({
            "type": "savings",
            "title": "Aumente sua taxa de poupanca",
            "description": "Tente economizar pelo menos 10% da sua renda",
            "priority": "high"
        })

    if request.debt_balance > request.monthly_income * 3:
        recommendations.append({
            "type": "debt",
            "title": "Atencao com dividas",
            "description": "Suas dividas estao acima do recomendado. Considere renegociar.",
            "priority": "high"
        })

    if request.investment_balance == 0 and request.balance > 1000:
        recommendations.append({
            "type": "investment",
            "title": "Comece a investir",
            "description": "Voce tem saldo disponivel. Que tal comecar com um CDB?",
            "priority": "medium"
        })

    # Calculate financial health score (0-100)
    score = 50
    if request.savings_rate >= 0.2:
        score += 20
    elif request.savings_rate >= 0.1:
        score += 10

    if request.debt_balance == 0:
        score += 15
    elif request.debt_balance < request.monthly_income:
        score += 5

    if request.investment_balance > 0:
        score += 15

    return InsightsResponse(
        insights=insights,
        recommendations=recommendations,
        score=min(score, 100)
    )


@app.post("/fraud/analyze", response_model=FraudAnalysisResponse)
async def analyze_fraud(request: FraudAnalysisRequest):
    """
    Analyze a transaction for potential fraud.

    Returns risk score, indicators, and recommendation (APPROVE, REVIEW, DENY).
    """
    transaction_data = {
        "id": request.transaction_id,
        "customer_id": request.customer_id,
        "amount": request.amount,
        "type": request.transaction_type,
        "destination": request.destination,
        "device": request.device_fingerprint,
        "ip": request.ip_address,
        "location": request.location
    }

    result = await athena_client.detect_fraud_patterns(
        transaction_data=transaction_data,
        customer_history={}  # Would load from database in production
    )

    return FraudAnalysisResponse(
        risk_score=result.get("risk_score", 0.0),
        recommendation=result.get("recommendation", "REVIEW"),
        indicators=result.get("indicators", []),
        confidence=result.get("confidence", 0.0)
    )


@app.post("/summarize")
async def summarize_transactions(
    customer_id: str,
    period: str = "month",
    transactions: List[Dict[str, Any]] = []
):
    """
    Generate a summary of transactions for a period.

    Returns spending breakdown by category and trends.
    """
    if not transactions:
        return {
            "summary": "Nenhuma transacao no periodo",
            "total_income": 0,
            "total_expenses": 0,
            "categories": {}
        }

    # Calculate totals
    total_income = sum(t.get("amount", 0) for t in transactions if t.get("amount", 0) > 0)
    total_expenses = abs(sum(t.get("amount", 0) for t in transactions if t.get("amount", 0) < 0))

    # Group by category
    categories: Dict[str, float] = {}
    for t in transactions:
        if t.get("amount", 0) < 0:
            cat = t.get("category", "Outros")
            categories[cat] = categories.get(cat, 0) + abs(t.get("amount", 0))

    # Generate summary text
    if total_expenses > total_income:
        summary = f"Voce gastou mais do que recebeu este mes. Despesas: R$ {total_expenses:.2f}, Receitas: R$ {total_income:.2f}"
    else:
        savings = total_income - total_expenses
        summary = f"Voce economizou R$ {savings:.2f} este mes! Parabens!"

    return {
        "summary": summary,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net": total_income - total_expenses,
        "categories": categories,
        "top_category": max(categories.keys(), key=lambda k: categories[k]) if categories else None
    }


@app.post("/recommend/products")
async def recommend_products(
    customer_id: str,
    customer_profile: Dict[str, Any]
):
    """
    Recommend financial products based on customer profile.
    """
    recommendations = []

    income = customer_profile.get("monthly_income", 0)
    balance = customer_profile.get("balance", 0)
    has_credit_card = customer_profile.get("has_credit_card", False)
    has_investments = customer_profile.get("has_investments", False)

    if not has_credit_card and income > 2000:
        recommendations.append({
            "product": "credit_card",
            "name": "Cartao Athena",
            "description": "Sem anuidade e com cashback em todas as compras",
            "match_score": 0.9
        })

    if balance > 5000 and not has_investments:
        recommendations.append({
            "product": "cdb",
            "name": "CDB Athena",
            "description": "Renda fixa com liquidez diaria e 100% do CDI",
            "match_score": 0.85
        })

    if income > 5000:
        recommendations.append({
            "product": "account_upgrade",
            "name": "Athena Premium",
            "description": "Conta premium com beneficios exclusivos",
            "match_score": 0.75
        })

    return {
        "customer_id": customer_id,
        "recommendations": recommendations,
        "generated_at": datetime.utcnow().isoformat()
    }


# ==================== WhatsApp Integration ====================

class WhatsAppMessageRequest(BaseModel):
    """WhatsApp message from webhook"""
    phone: str
    message: str
    message_id: str
    timestamp: str


class WhatsAppMessageResponse(BaseModel):
    """Response for WhatsApp"""
    reply: str
    quick_replies: List[str] = []
    action_buttons: List[Dict[str, str]] = []


@app.post("/whatsapp/message", response_model=WhatsAppMessageResponse)
async def handle_whatsapp_message(request: WhatsAppMessageRequest):
    """
    Handle incoming WhatsApp message.

    This endpoint is called by the WhatsApp service when a message is received.
    """
    # Create or get session by phone
    session_id = f"whatsapp_{request.phone}"

    if session_id not in sessions:
        sessions[session_id] = ConversationContext(
            customer_id=request.phone,  # Use phone as customer ID initially
            session_id=session_id,
            customer_data={"channel": "whatsapp"}
        )

    context = sessions[session_id]

    # Get AI response
    ai_response = await athena_client.chat(
        context=context,
        user_message=request.message,
        mode="support"
    )

    # Format for WhatsApp
    quick_replies = ai_response.suggestions[:3] if ai_response.suggestions else []

    action_buttons = []
    if ai_response.requires_action:
        if ai_response.action_type == "block_card":
            action_buttons = [
                {"id": "confirm_block", "title": "Confirmar bloqueio"},
                {"id": "cancel", "title": "Cancelar"}
            ]
        elif ai_response.action_type == "transfer":
            action_buttons = [
                {"id": "open_app", "title": "Abrir app"},
                {"id": "help", "title": "Preciso de ajuda"}
            ]

    return WhatsAppMessageResponse(
        reply=ai_response.content,
        quick_replies=quick_replies,
        action_buttons=action_buttons
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
