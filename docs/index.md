# Architecture Overview

Agentic Forge is built from modular components that work together to create efficient, interoperable AI agents with smart tool management.

<div class="diagram-container">
  <img src="/diagrams/forge-architecture.svg" alt="Agentic Forge Architecture" style="max-width: 100%; height: auto;" />
</div>

## Components

| Component | Description |
|-----------|-------------|
| [Orchestrator](/docs/orchestrator) | Standalone component managing the LLM conversation loop with model routing, tool routing, and hooks for observability. |
| [Armory](/docs/armory) | Protocol gateway that aggregates multiple tool sources and exposes them through a unified MCP interface. |
| [Tool RAG](/docs/tool-rag) | Dynamic tool selection using semantic search to reduce context usage and improve accuracy. |
| [Interfaces](/docs/interfaces) | CLI, Web UI, WebSocket API, and Python SDK for interacting with the system. |
| [Anvil](/docs/anvil) | CLI and web-based inspector for testing and debugging MCP servers during development. |

## Key Innovations

### Protocol Interoperability

Different LLMs output tool calls in different formats (OpenAI, Anthropic, Gemini, etc.). Agentic Forge normalizes these through Pydantic AI and translates to whatever backend format is needed.

### Token Optimization with TOON

Tool results are converted from JSON to TOON (Token-Oriented Object Notation) at the gateway level, achieving 15-40% token savings (scaling with data size) without requiring changes to existing MCP servers or tools.

### Smart Tool Selection

Instead of loading all tools into context, Tool RAG uses semantic search to dynamically select only relevant tools. Our benchmarks show 60% context reduction when combined with TOON format.

## Data Flow

<div class="diagram-container">
  <img src="/diagrams/armory-tool-call-flow.svg" alt="Tool Call Data Flow" style="max-width: 100%; height: auto;" />
</div>

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Pydantic AI | Model abstraction, type-safe tools |
| Protocol | MCP (Streamable HTTP) | Tool communication standard |
| Format | TOON | Token-efficient data encoding |
| Search | Vector embeddings | Semantic tool matching |
| API | WebSocket + REST | Real-time streaming + management |
