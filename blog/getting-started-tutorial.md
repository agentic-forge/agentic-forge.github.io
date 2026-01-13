# Getting Started with Agentic Forge

*Coming Soon*

::: warning Draft
This article is in progress. Check back soon for the full post.
:::

## Overview

Complete tutorial on setting up the full Agentic Forge stack - from clone to running chat interface.

## Planned Sections

### Prerequisites
- Docker and Docker Compose
- API keys (OpenRouter recommended for simplicity)
- Optional: Brave Search API for web search tool

### Quick Start (5 Minutes)
- Clone forge-devtools
- Configure environment variables
- `docker compose up`
- Open the chat interface

### Architecture Overview
- Component diagram
- How services connect
- Port assignments

### Service-by-Service Setup

| Service | Port | Purpose |
|---------|------|---------|
| forge-ui | 4040 | Chat interface |
| forge-orchestrator | 4041 | LLM agent loop |
| forge-armory | 4042 | MCP gateway |
| mcp-weather | 4050 | Weather tool |
| mcp-web-search | 4051 | Web search tool |

### Your First Conversation
- Selecting a model
- Asking about weather (triggers tool call)
- Viewing tool execution in real-time
- Extended thinking with reasoning models

### Native Development (Without Docker)
- Using the tmux-based dev scripts
- Running services individually
- Hot-reload during development

### Adding Custom Tools
- Creating an MCP server with FastMCP
- Registering with Armory
- Testing with Anvil

### Troubleshooting
- Common issues and solutions
- Checking service health
- Reading logs

### Next Steps
- Customizing the orchestrator
- Building your own MCP servers
- Contributing to the project

## Source Code

- [forge-devtools](https://github.com/agentic-forge/forge-devtools) - Docker Compose and scripts
- [Getting Started Guide](/docs/getting-started) - Documentation

---

*This is part of a series on building Agentic Forge.*
