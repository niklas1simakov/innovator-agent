# Innovator Agent

An AI-powered research analysis system that helps researchers and inventors analyze novelty and similarities in academic publications and patents using advanced machine learning and voice interaction capabilities.

## Project Overview

Innovator Agent is a comprehensive platform that combines research intelligence with conversational AI to provide:

- **Research Analysis**: Deep analysis of academic publications and patents
- **Novelty Assessment**: AI-powered evaluation of research novelty and uniqueness
- **Similarity Detection**: Advanced similarity scoring between your research and existing work
- **Voice Assistant**: Interactive voice chat to discuss research findings
- **Visual Dashboard**: Intuitive interface for exploring research landscapes

## Architecture

The system consists of two main components:

```
innovator-agent/
├── backend/           # FastAPI Python backend
├── frontend/          # React TypeScript frontend
└── README.md         # This file
```

### Backend (FastAPI + Python)
- **Research Processing**: Document analysis and similarity search
- **AI Integration**: Anthropic Claude models for content analysis
- **External APIs**: Logic Mill for patent/publication data
- **Voice Integration**: ElevenLabs conversational AI endpoints

### Frontend (React + TypeScript)
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Research Dashboard**: Interactive results visualization
- **Voice Chat**: Real-time voice conversations about research
- **Data Management**: Local storage for analysis history

## Key Features

### Research Analysis
- Upload research titles and abstracts
- Get comprehensive novelty scoring (0-100%)
- Identify similar publications and patents
- View detailed similarity/difference breakdowns

### Voice Assistant
- Ask questions about your research analysis
- Get spoken explanations of findings
- Interactive discussion of similarities and differences
- Context-aware conversations about publications and patents

### Analytics Dashboard
- Timeline visualization of research trends
- Top authors in your field
- Publication vs patent distribution
- Historical analysis storage

### Smart Filtering
- Filter by similarity thresholds
- Sort by relevance, date, or similarity
- Patent warning system for high-risk items
- Advanced search capabilities

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Anthropic Claude**: Language model for analysis
- **Logic Mill API**: Patent and publication database
- **ElevenLabs**: Voice AI integration
- **Python 3.11+**: Core runtime

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling framework
- **Shadcn/UI**: Component library
- **ElevenLabs React SDK**: Voice integration

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd innovator-agent
   ```

2. **Start both services**
   ```bash
   # Terminal 1 - Backend
   cd backend && uv run run.py
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

3. **Open your browser**
   - Frontend: `http://localhost:8080/`
   - Backend API docs: `http://localhost:8000/docs`

## Usage Workflow

1. **Enter Research**: Input your research title and abstract
2. **Run Analysis**: Click "Analyze Novelty" to process your research
3. **Review Results**: Examine publications, patents, and similarity scores
4. **Voice Discussion**: Use the voice assistant to ask questions about findings
5. **Filter & Explore**: Use advanced filters to refine results
6. **Save Analysis**: Your analysis is automatically saved for future reference

## License

This project is licensed under the MIT License - see the LICENSE file for details.