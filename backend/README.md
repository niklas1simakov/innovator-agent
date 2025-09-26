# Innovator Agent Backend

FastAPI-based backend service that provides research analysis, document processing, and AI-powered insights for patent and publication analysis.

## Architecture Overview

The backend serves as the core intelligence engine, providing:

- **Document Analysis**: AI-powered analysis of research papers and patents
- **Similarity Search**: Vector-based similarity matching using Logic Mill API
- **Novelty Assessment**: Anthropic Claude-powered novelty scoring and analysis
- **Voice Integration**: ElevenLabs conversational AI endpoints
- **Data Processing**: Publication and patent metadata extraction

## Prerequisites

- **Python** 3.11+ (core runtime)
- **uv** (Python package manager) - Fast package installer and resolver
- **Node.js** 18+ (for frontend integration)

## Technology Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Python 3.11+**: Core programming language
- **Anthropic Claude**: Language models for content analysis and insights
- **Logic Mill API**: Patent and publication database access
- **ElevenLabs API**: Voice AI integration for conversational features
- **httpx**: Async HTTP client for external API calls
- **Pydantic**: Data validation and serialization
- **python-dotenv**: Environment variable management

## Dependencies

### Core Packages
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `anthropic`: Anthropic Claude API client
- `httpx`: HTTP client for external APIs
- `pydantic`: Data validation
- `python-dotenv`: Environment management

### Development Tools
- `uv`: Fast Python package installer and resolver

## API Keys Required

You'll need accounts and API keys for the following services:

### 1. Anthropic Claude
- **Purpose**: AI-powered research analysis and content generation
- **Get API Key**: Visit [Anthropic Console](https://console.anthropic.com/)
- **Pricing**: Pay-per-token usage model
- **Environment Variable**: `ANTHROPIC_API_KEY`

### 2. Logic Mill
- **Purpose**: Patent and publication database access
- **Get API Key**: Contact Logic Mill for enterprise access
- **Features**: Similarity search, patent data, publication metadata
- **Environment Variable**: `API_KEY_LOGIC_MILL`

### 3. ElevenLabs
- **Purpose**: Voice AI integration for conversational features
- **Get API Key**: Sign up at [ElevenLabs](https://elevenlabs.io/)
- **Features**: Text-to-speech, voice conversations, agent creation
- **Environment Variables**: 
  - `ELEVENLABS_API_KEY`: Your API key
  - `ELEVENLABS_AGENT_ID`: Your conversational agent ID

## Quick Start

### 1. Install Python and uv

Ensure you have Python 3.11+ installed:
```bash
python --version  # Should be 3.11+
```

Install uv (fast Python package manager):
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2. Setup Project

```bash
# Navigate to backend directory
cd backend

# Install dependencies
uv sync

# Activate virtual environment
source .venv/bin/activate  # Linux/macOS
# or
.venv\Scripts\activate     # Windows
```

### 3. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```bash
# Required API Keys
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
API_KEY_LOGIC_MILL=your-logic-mill-api-key-here
ELEVENLABS_API_KEY=sk_your-elevenlabs-api-key-here
ELEVENLABS_AGENT_ID=your-elevenlabs-agent-id-here

# Optional Configuration
DEBUG=True
LOG_LEVEL=INFO
```

### 4. Start the Server

```bash
# Development server with auto-reload
uv run run.py

# Or directly with uvicorn
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Keys Setup Guide

### 1. Anthropic Claude API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in your account settings
4. Create a new API key
5. Copy the key starting with `sk-ant-`

**Usage**: Powers AI analysis and novelty assessment

### 2. Logic Mill API Key

1. Visit [Logic Mill](https://logic-mill.net/)
2. Create a developer account
3. Request API access for patent/publication search
4. Obtain your API key from the developer dashboard

**Usage**: Provides access to patent and publication databases for similarity search

### 3. ElevenLabs API Key & Agent ID

1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Sign up for an account
3. Navigate to "Profile" → "API Keys"
4. Generate a new API key
5. Create a conversational AI agent in the dashboard
6. Copy both the API key and Agent ID

**Usage**: Enables voice assistant functionality for discussing research results

## Project Structure

```
backend/
├── src/
│   ├── main.py                 # FastAPI application entry point
│   ├── models.py              # Pydantic models and data structures
│   ├── document_analyzer.py   # AI-powered document analysis
│   ├── document_processor.py  # Document processing and search
│   ├── patent_loader.py       # Patent data loading and extraction
│   └── publication_loader.py  # Publication data loading and extraction
├── pyproject.toml             # Project dependencies and configuration
├── .env.example              # Environment variables template
├── .env                      # Your environment variables (create this)
├── run.py                    # Server startup script
└── README.md                 # This file
```

## API Endpoints

### Health Check
```http
GET /health
```
Returns server status and health information.

### Research Analysis
```http
GET /get_analysis?title={title}&abstract={abstract}
```
Analyzes research for novelty and finds similar publications/patents.

**Parameters:**
- `title`: Research paper title
- `abstract`: Research paper abstract

**Response:**
```json
{
  "documents": [...],
  "novelty_score": 75.5,
  "novelty_analysis": "Analysis text...",
  "publication_dates": [...],
  "authors": [...]
}
```

### Voice Assistant (Signed URL)
```http
POST /signed-url
Content-Type: application/json

{
  "context": "Research analysis context for voice assistant..."
}
```
Generates signed URL for ElevenLabs voice conversation with analysis context.

## Configuration Options

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Yes | Anthropic Claude API key | `sk-ant-...` |
| `API_KEY_LOGIC_MILL` | Yes | Logic Mill API for patent search | `your-key-here` |
| `ELEVENLABS_API_KEY` | Yes | ElevenLabs API key | `sk_...` |
| `ELEVENLABS_AGENT_ID` | Yes | ElevenLabs agent identifier | `agent-id` |
| `DEBUG` | No | Enable debug mode | `True` |
| `LOG_LEVEL` | No | Logging level | `INFO` |

### Customization

#### Similarity Search Parameters
Edit `document_processor.py` to modify:
- Search result count (`amount: 3`)
- Search indices (`['patents', 'publications']`)
- Embedding model (`model: 'patspecter'`)

#### Analysis Prompts
Modify AI prompts in `document_analyzer.py`:
- Novelty assessment criteria
- Similarity/difference detection
- Analysis scoring logic

## Troubleshooting

### Common Issues

1. **API Key Errors**
   ```
   Error: Anthropic API key not found
   ```
   - Ensure `.env` file exists with correct API keys
   - Verify keys don't have extra spaces or quotes

2. **Port Already in Use**
   ```
   Error: Port 8000 is already in use
   ```
   - Kill existing process: `lsof -ti:8000 | xargs kill -9`
   - Or use different port: `uvicorn src.main:app --port 8001`

3. **Module Import Errors**
   ```
   ModuleNotFoundError: No module named 'src'
   ```
   - Ensure you're in the backend directory
   - Activate virtual environment: `source .venv/bin/activate`

4. **API Rate Limits**
   - Anthropic: Check usage at https://console.anthropic.com/
   - Logic Mill: Contact support for rate limit increases
   - ElevenLabs: Monitor usage in dashboard

### Debug Mode

Enable detailed logging:
```bash
# Set in .env
DEBUG=True
LOG_LEVEL=DEBUG
```

### Health Check

Verify all services are working:
```bash
curl http://localhost:8000/health
```

## Testing

### Manual Testing
1. Start the server: `uv run run.py`
2. Visit: http://localhost:8000/docs
3. Test the `/health` endpoint
4. Try `/get_analysis` with sample data

### Example Analysis Request
```bash
curl -X GET "http://localhost:8000/get_analysis" \
  -G \
  -d "title=Machine Learning for Patent Analysis" \
  -d "abstract=This research explores the application of machine learning techniques for automated patent analysis and prior art search."
```

## Monitoring

### Logs
The application logs to stdout. Monitor with:
```bash
# Follow logs in real-time
uv run run.py | tee app.log

# Or with structured logging
uv run run.py 2>&1 | grep -E "(ERROR|WARNING|INFO)"
```

### Performance
- Monitor API response times in the interactive docs
- Check external API rate limits
- Monitor memory usage for large document processing

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **CORS**: Configure CORS settings for production deployment
3. **Rate Limiting**: Implement rate limiting for production use
4. **Input Validation**: All inputs are validated using Pydantic models
5. **Error Handling**: Sensitive information is not exposed in error messages

## Production Deployment

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY pyproject.toml .
RUN pip install uv && uv sync

COPY src/ src/
COPY run.py .

CMD ["uv", "run", "run.py"]
```

### Environment Setup
```bash
# Production environment variables
ANTHROPIC_API_KEY=your-production-key
API_KEY_LOGIC_MILL=your-production-key
ELEVENLABS_API_KEY=your-production-key
ELEVENLABS_AGENT_ID=your-production-agent
DEBUG=False
LOG_LEVEL=WARNING
```

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Anthropic Claude API Reference](https://docs.anthropic.com/claude/reference)
- [ElevenLabs API Documentation](https://elevenlabs.io/docs)
- [Logic Mill API Documentation](https://logic-mill.net/docs)
