# Gallery

A visual tour of Agentic Forge's components and features.

## Forge UI - Chat Interface

The main user interface for interacting with AI agents. Built with Vue.js and PrimeVue.

### Welcome Screen

Clean landing page with options to start a new conversation or import an existing one.

![Forge UI Welcome](/screens/forge-ui-landing.png)

### Chat with Tool Calls

Watch the AI use tools in real-time. Expandable tool call panels show arguments and results.

![Chat with Tool Call](/screens/forge-ui-tc-detail.png)

### Extended Thinking

Models with reasoning capabilities (like DeepSeek R1) show their thinking process.

![Extended Thinking](/screens/forge-ui.png)

### Model Selection with Favorites

The model dropdown shows your favorited models first, then recent models, making it easy to access the models you use most.

![Model Dropdown with Favorites](/screens/forge-ui-model-selection-dropdown.png)

### Model Management

A dedicated modal for managing models across multiple providers. Star your favorites, fetch models from provider APIs, or add models manually.

![Model Management - OpenAI](/screens/forge-ui-model-selection.png)

### 300+ Models via OpenRouter

Connect to OpenRouter for access to 300+ models from dozens of providers. Each model shows capability badges (tools, vision) and source tags.

![Model Management - OpenRouter](/screens/forge-ui-model-selection-config.png)

### Parallel Tool Calls

Advanced queries trigger multiple tool calls simultaneously. The UI tracks each one.

![Multi Tool Call](/screens/forge-ui-multi-tool-call.png)

---

## Forge Armory - MCP Gateway

The protocol gateway that aggregates MCP servers and exposes them through a unified interface.

### Dashboard Overview

At-a-glance metrics: connected backends, available tools, call statistics, and latency.

![Armory Dashboard](/screens/forge-armory-dashboard.png)

### Backend Management

Add, configure, enable/disable MCP server backends. Each backend contributes tools to the unified registry.

![Armory Backends](/screens/forge-armory-backends.png)

### Tool Registry

Browse all available tools across backends. Search by name, filter by backend, view schemas.

![Armory Tools](/screens/forge-armory-tools.png)

### Metrics & Observability

Track tool call history, latency, success rates. Filter by time range, tool, or backend.

![Armory Metrics](/screens/forge-armory-metrics.png)

---

## Development Environment

### tmux-based Development

Native development with hot reload. All services running in organized tmux panes.

![Development Services](/screens/forge-services.png)

The `dev-start.sh` script launches:
- **forge-ui** - Frontend with Vite hot reload
- **forge-orchestrator** - Python backend with auto-restart
- **forge-armory** - Gateway with live config
- **MCP servers** - Weather and web search

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FORGE UI                             │
│                    (localhost:4040)                          │
│         Vue.js chat interface with model selection           │
└─────────────────────────────┬───────────────────────────────┘
                              │ WebSocket/SSE
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      ORCHESTRATOR                            │
│                    (localhost:4041)                          │
│     LLM conversation loop with tool routing                  │
└─────────────────────────────┬───────────────────────────────┘
                              │ MCP Protocol
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        ARMORY                                │
│                    (localhost:4042)                          │
│     Protocol gateway aggregating MCP backends                │
└───────────┬─────────────────┴─────────────────┬─────────────┘
            │                                   │
            ▼                                   ▼
┌───────────────────────┐         ┌───────────────────────────┐
│    MCP Weather        │         │     MCP Web Search        │
│  (localhost:4050)     │         │    (localhost:4051)       │
│   Open-Meteo API      │         │    Brave Search API       │
└───────────────────────┘         └───────────────────────────┘
```

## Design System

All Forge UI components use **PrimeVue 4** with the **Aura theme** and violet primary color.

| Element | Usage |
|---------|-------|
| **Primary (Violet)** | Interactive elements, buttons, links |
| **Green** | Connected, enabled, success states |
| **Red** | Errors, delete actions |
| **Orange** | Tool calls in progress |
| **Dark background** | Default theme (`#0f0f14`) |

---

Ready to try it yourself? Head to the [Getting Started](/docs/getting-started) guide!
