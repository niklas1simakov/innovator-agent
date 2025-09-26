# Research Assistant System

## Description

This is a research assistant system that uses AI to help with research.

## Features

- Search for research papers and patents
- Analyze research papers and patents
- Generate research papers and patents
- Generate research papers and patents

## Technologies

- Python
- FastAPI
- Pydantic
- Pydantic AI
- Anthropic API's
- Logic Mill API
- uv (package manager)
- Ruff (formatting and linting)

## Installation

### Install dependencies & setting up the environment

Make sure you have [uv (package manager)](https://docs.astral.sh/uv/installation/) installed.

```bash
uv sync
```

### Setting up the environment variables

Create a copy of the [.env.example](.env.example) file in the root directory and add the required variables:
- ANTHROPIC_API_KEY: Your [Anthropic API key](https://console.anthropic.com/)
- EPO_API_KEY: Your [EPO API](https://developers.epo.org/) consumer key
- EPO_API_SECRET: Your [EPO API](https://developers.epo.org/) consumer secret
- API_KEY_LOGIC_MILL: Your [Logic Mill API key](https://logic-mill.net/)

### Running the application

```bash
uv run run.py
```

### Open the API documentation

Go to http://localhost:8000/docs
