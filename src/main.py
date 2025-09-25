from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.document_analyzer import get_authors, get_novetly_analysis, get_publication_dates
from src.document_processor import DocumentProcessor
from src.models import AnalysisResponse

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

    novelty_analysis = get_novetly_analysis(documents)
    publication_dates = get_publication_dates(documents)
    authors = get_authors(documents)

    return AnalysisResponse(
        documents=documents,
        novelty_score=novelty_analysis.novelty_score,
        novetly_analysis=novelty_analysis.novelty_analysis,
        publication_dates=publication_dates,
        authors=authors,
    )
