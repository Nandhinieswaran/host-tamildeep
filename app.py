# app.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from RetrieverPrompt import get_answer
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import ChatHistory
from datetime import datetime
import logging
import uuid

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Database connection error")
    finally:
        db.close()

# Input and output models for validation
class ChatRequest(BaseModel):
    user_input: str
    session_id: str = None
    language: str = "ta"

class ChatResponse(BaseModel):
    response: str
    chat_id: int = None

# Define the main chat endpoint with database integration
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # Log the incoming request
        logger.info(f"Received chat request: {request.user_input}")
        
        # Get or generate session ID
        session_id = request.session_id or str(uuid.uuid4())
        
        # Get start time
        start_time = datetime.utcnow()
        
        # Call the existing retrieval function
        chatbot_response = get_answer(request.user_input)
        
        # Get end time
        end_time = datetime.utcnow()
        
        # Create chat entry
        chat_entry = ChatHistory(
            user_input=request.user_input,
            bot_response=chatbot_response,
            query_start_time=start_time,
            response_time=end_time,
            session_id=session_id,
            context_length=len(request.user_input),
            response_length=len(chatbot_response),
            confidence_score=100,  # You might want to get this from your model
            language=request.language,
            model_version="1.0"
        )
        
        # Save to database
        try:
            db.add(chat_entry)
            db.commit()
            logger.info(f"Successfully saved chat to database with ID: {chat_entry.id}")
            db.refresh(chat_entry)
        except Exception as db_error:
            db.rollback()
            logger.error(f"Database commit error: {str(db_error)}")
            raise HTTPException(status_code=500, detail="Failed to save chat to database")
        
        return ChatResponse(response=chatbot_response, chat_id=chat_entry.id)
        
    except Exception as e:
        logger.error(f"General error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get chat history for a session
@app.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    try:
        chat_history = db.query(ChatHistory).filter(
            ChatHistory.session_id == session_id
        ).order_by(ChatHistory.query_start_time).all()
        
        return {
            "session_id": session_id,
            "messages": [
                {
                    "id": chat.id,
                    "user_input": chat.user_input,
                    "bot_response": chat.bot_response,
                    "timestamp": chat.query_start_time.isoformat(),
                }
                for chat in chat_history
            ]
        }
    except Exception as e:
        logger.error(f"Error retrieving chat history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint with database check
@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Test database connection
        db.execute("SELECT 1")
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "error", "database": "disconnected"}