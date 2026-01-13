# Architecture Overview

Agentic Forge is built from modular components that work together to create efficient, interoperable AI agents with smart tool management.

<div class="architecture-diagram">
<pre>
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AGENTIC FORGE                                       │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                           ORCHESTRATOR                                      │ │
│  │  Standalone component managing the LLM conversation loop                    │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │ │
│  │  │ Conversation │ │    Model     │ │     Tool     │ │   Execution  │      │ │
│  │  │   Manager    │ │    Router    │ │    Router    │ │    Engine    │      │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘      │ │
│  └─────────────────────────────────────────┬──────────────────────────────────┘ │
│                                            │                                     │
│                          MCP Protocol      │                                     │
│                                            ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              ARMORY                                         │ │
│  │  Protocol Gateway exposing unified MCP interface                            │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │ │
│  │  │     MCP      │ │     Tool     │ │   Protocol   │ │    Result    │      │ │
│  │  │   Server     │ │   Registry   │ │   Adapters   │ │ Transformer  │      │ │
│  │  │  Interface   │ │              │ │              │ │  (JSON→TOON) │      │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘      │ │
│  │                          │                                                  │ │
│  │                          ▼                                                  │ │
│  │                   ┌──────────────┐                                          │ │
│  │                   │   TOOL RAG   │                                          │ │
│  │                   │  (optional)  │                                          │ │
│  │                   └──────────────┘                                          │ │
│  └─────────────────────────────────────────┬──────────────────────────────────┘ │
│                                            │                                     │
│                    Protocol Translation    │                                     │
│                                            ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                           BACKENDS                                          │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │ │
│  │  │ MCP Servers  │ │  REST APIs   │ │    Local     │ │  OpenAI FC   │      │ │
│  │  │ (filesystem, │ │  (weather,   │ │  Functions   │ │   Services   │      │ │
│  │  │  brave, etc) │ │   etc)       │ │              │ │              │      │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘      │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
</pre>
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

Tool results are converted from JSON to TOON (Token-Oriented Object Notation) at the gateway level, achieving 30-40% token savings without requiring changes to existing MCP servers or tools.

### Smart Tool Selection

Instead of loading all tools into context, Tool RAG uses semantic search to dynamically select only relevant tools, reducing context usage by ~50% and improving accuracy by 3x.

## Data Flow

<div class="architecture-diagram">
<pre>
USER QUERY
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR                                                │
│  ├── Model Router: selects appropriate LLM                   │
│  ├── Sends to LLM with tool definitions                      │
│  └── LLM returns: tool_call("search", {...})                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  ARMORY (receives tool call via MCP)                         │
│  ├── Tool RAG: confirms tool is relevant                     │
│  ├── Protocol Adapter: routes to backend                     │
│  └── Backend executes, returns JSON                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  RESULT TRANSFORMER                                          │
│  ├── Detects tabular data                                    │
│  └── Converts JSON → TOON (saves ~40% tokens)                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
              FINAL RESPONSE TO USER
</pre>
</div>

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Pydantic AI | Model abstraction, type-safe tools |
| Protocol | MCP (Streamable HTTP) | Tool communication standard |
| Format | TOON | Token-efficient data encoding |
| Search | Vector embeddings | Semantic tool matching |
| API | WebSocket + REST | Real-time streaming + management |
