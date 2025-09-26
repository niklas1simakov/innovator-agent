import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

from src.document_analyzer import get_authors, get_novelty_analysis, get_publication_dates
from src.document_processor import DocumentProcessor
from src.models import AnalysisResponse

load_dotenv()

# Create FastAPI application
app = FastAPI(
    title='Research System',
    description='AI-powered system for patent analysis and research intelligence',
    version='1.0.0',
    docs_url='/docs',
    redoc_url='/redoc',
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health')
async def health() -> dict:
    return {'status': 'ok'}


@app.get('/get_analysis')
async def root(title: str, abstract: str) -> AnalysisResponse:
    """Get full analysis of a document."""
    finder = DocumentProcessor(abstract=abstract, title=title)
    documents = finder.get_documents()

    novelty_analysis = get_novelty_analysis(documents)
    publication_dates = get_publication_dates(documents)
    authors = get_authors(documents)

    return AnalysisResponse(
        documents=documents,
        novelty_score=novelty_analysis.novelty_score,
        novelty_analysis=novelty_analysis.novelty_analysis,
        publication_dates=publication_dates,
        authors=authors,
    )


class SignedUrlRequest(BaseModel):
    context: str | None = None

@app.post('/signed-url')
async def get_signed_url(request: SignedUrlRequest) -> dict:
    """Get signed URL for ElevenLabs conversation agent with optional analysis context."""
    agent_id = os.getenv("ELEVENLABS_AGENT_ID")
    api_key = os.getenv("ELEVENLABS_API_KEY")
    
    if not agent_id:
        raise HTTPException(status_code=500, detail="ELEVENLABS_AGENT_ID environment variable not set")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="ELEVENLABS_API_KEY environment variable not set")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Always GET the signed URL (POST is not allowed and returns 405)
            response = await client.get(
                f"https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id={agent_id}",
                headers={"xi-api-key": api_key}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=500, 
                    detail=f"Failed to get signed URL from ElevenLabs: {response.status_code} - {response.text}"
                )
            
            body = response.json()
            return {"signed_url": body["signed_url"]}
            
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Network error connecting to ElevenLabs: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
