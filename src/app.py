"""
Minimal FastAPI app skeleton with a single health endpoint.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='Minimal API', version='0.1.0')


@app.get('/health')
async def health() -> dict:
    return {'status': 'ok'}


"""
FastAPI application entry point for the System.
"""

try:
    from src.core.config import settings
except Exception:
    settings = None

try:
    from src.api.routes import analysis, health
except Exception:
    analysis = None
    health = None

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
    allow_origins=(settings.ALLOWED_ORIGINS if settings is not None else ['*']),
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Include routers if available
if health is not None:
    app.include_router(health.router, prefix='/api/v1', tags=['health'])
if analysis is not None:
    app.include_router(analysis.router, prefix='/api/v1', tags=['analysis'])


@app.get('/')
async def root() -> None:
    """Root endpoint with basic API information."""
    return {
        'message': 'Research System API',
        'version': '1.0.0',
        'docs': '/docs',
        'health': '/api/v1/health',
    }


@app.get('/hello')
async def hello() -> None:
    """Very basic endpoint."""
    return {'message': 'hello world'}
