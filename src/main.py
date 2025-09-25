from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
async def root() -> None:
    """Get full analysis of a document."""
    return {'add your analysis here'}
