# Orchestrator

A standalone component that manages the LLM conversation loop with advanced routing, execution control, and observability hooks.

## Why a Standalone Orchestrator?

While Pydantic AI provides built-in orchestration, a standalone orchestrator offers:

- **Rule-based routing** - Route different queries to different models or tools
- **Multi-model orchestration** - Use different models for different tasks
- **Embeddable** - Integrate into existing applications and pipelines
- **Customizable loop** - Inject logic at any point in the execution cycle
- **Observable** - Full visibility into decisions, timing, and costs

## Architecture

<div class="architecture-diagram">
<pre>
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ORCHESTRATOR                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         PUBLIC API                                      │ │
│  │  - run(prompt) → Response                                               │ │
│  │  - run_stream(prompt) → AsyncIterator[Event]                            │ │
│  │  - step() → manually advance one loop iteration                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│                                      ▼                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Conversation │  │    Model     │  │     Tool     │  │  Execution   │    │
│  │   Manager    │  │    Router    │  │    Router    │  │   Engine     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                      │                                       │
│                                      ▼                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         HOOKS / MIDDLEWARE                              │ │
│  │  on_model_request, on_model_response, on_tool_call, on_complete        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
</pre>
</div>

## Sub-components

| Component | Responsibility |
|-----------|---------------|
| **Conversation Manager** | Message history, context limits, conversation forking |
| **Model Router** | Rule-based model selection (fast vs smart, code vs chat) |
| **Tool Router** | Rule-based routing to MCP servers and backends |
| **Execution Engine** | Parallel execution, retries, timeouts, result transformation |
| **Hooks** | Middleware for logging, metrics, and custom logic |

## Model Router

Select different models based on task characteristics:

```python
model_router = ModelRouter()
model_router.add_model("fast", ModelConfig("openai", "gpt-4o-mini"))
model_router.add_model("smart", ModelConfig("anthropic", "claude-3-5-sonnet"))
model_router.add_model("code", ModelConfig("anthropic", "claude-3-5-sonnet"))

# Route based on complexity
model_router.add_rule(RoutingRule(
    condition=lambda ctx: ctx.estimated_complexity < 3,
    model_name="fast"
))

# Route based on intent
model_router.add_rule(RoutingRule(
    condition=lambda ctx: "code" in ctx.detected_intent,
    model_name="code"
))
```

## Tool Router

Route tool calls to appropriate backends based on patterns:

```python
tool_router = ToolRouter()
tool_router.add_mcp_server("armory", "http://localhost:8000/mcp")

# Route by prefix
tool_router.add_route(ToolRoute(
    pattern="fs_*",
    destination="filesystem_server"
))

# Route by category
tool_router.add_route(ToolRoute(
    pattern="db_*",
    destination="database_server"
))

# Default to Armory
tool_router.add_route(ToolRoute(
    pattern="*",
    destination="armory"
))
```

## Hooks for Observability

Register handlers for various events in the orchestration loop:

```python
orchestrator = Orchestrator(model_router, tool_router)

@orchestrator.on("model_request")
def log_model_request(data):
    print(f"Calling model: {data['model'].model}")

@orchestrator.on("tool_calls")
async def track_tools(data):
    for call in data["calls"]:
        await metrics.increment(f"tool.{call.name}.calls")

@orchestrator.on("complete")
def track_cost(data):
    cost = calculate_cost(data["usage"])
    budget_tracker.add(cost)
```

## Usage Examples

### Basic Usage

```python
from agentic_forge import Orchestrator, ModelRouter, ToolRouter

orchestrator = Orchestrator(
    model_router=ModelRouter(...),
    tool_router=ToolRouter(...)
)

result = await orchestrator.run(
    prompt="Search for AI news and summarize",
    system_prompt="You are a research assistant."
)

print(result.content)
```

### Streaming

```python
async for event in orchestrator.run_stream("Search..."):
    if event.type == "token":
        print(event.token, end="", flush=True)
    elif event.type == "tool_call":
        print(f"\n[Calling {event.tool_name}...]")
```

### Embedding in Applications

```python
from fastapi import FastAPI
from agentic_forge import Orchestrator

app = FastAPI()
orchestrator = Orchestrator(...)

@app.post("/chat")
async def chat(request: ChatRequest):
    result = await orchestrator.run(request.message)
    return {"response": result.content}
```

## Comparison with Pydantic AI Agent

| Feature | Pydantic AI Agent | Standalone Orchestrator |
|---------|-------------------|------------------------|
| Setup complexity | Simple | More configuration |
| Routing rules | Limited | Full control |
| Multi-model | One model per agent | Dynamic selection |
| Hooks/middleware | Limited | Extensive |
| Embeddability | Agent owns loop | Component in your system |
