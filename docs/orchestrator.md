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

<div class="diagram-container">
  <img src="/diagrams/orchestrator-architecture.svg" alt="Orchestrator Architecture" style="max-width: 100%; height: auto;" />
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

| Routing Type | Example |
|--------------|---------|
| By complexity | Simple queries → fast model, complex → smart model |
| By intent | Code tasks → code-optimized model |
| By cost | Budget constraints → cheaper models |
| By capability | Vision tasks → multimodal models |

## Tool Router

Route tool calls to appropriate backends based on patterns:

| Pattern | Destination | Use Case |
|---------|-------------|----------|
| `fs_*` | Filesystem server | File operations |
| `db_*` | Database server | Data queries |
| `*` | Armory (default) | Everything else |

## Hooks for Observability

Register handlers for various events in the orchestration loop:

| Event | Use Case |
|-------|----------|
| `model_request` | Log model calls, track usage |
| `tool_calls` | Monitor tool usage, metrics |
| `complete` | Cost tracking, budget management |
| `error` | Error logging, alerting |

## Comparison with Pydantic AI Agent

| Feature | Pydantic AI Agent | Standalone Orchestrator |
|---------|-------------------|------------------------|
| Setup complexity | Simple | More configuration |
| Routing rules | Limited | Full control |
| Multi-model | One model per agent | Dynamic selection |
| Hooks/middleware | Limited | Extensive |
| Embeddability | Agent owns loop | Component in your system |
