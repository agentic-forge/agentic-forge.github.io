# Interfaces

Multiple ways to interact with Agentic Forge: CLI for terminal users, SSE API for real-time streaming, and Python SDK for direct integration.

## Interface Overview

<div class="diagram-container">
  <img src="/diagrams/interfaces-overview.svg" alt="Interface Overview" style="max-width: 100%; height: auto;" />
</div>

## Why SSE over REST?

REST's request-response model doesn't fit LLM agents well:

| Challenge | REST Problem | SSE Solution |
|-----------|--------------|--------------|
| Streaming tokens | Wait for complete response | Stream as generated |
| Long-running tasks | Timeouts, no progress | Persistent connection |
| Tool call progress | No visibility | Real-time events |
| Heartbeats | Connection drops | Built-in ping events |

## Recommended: SSE + REST Hybrid

<div class="diagram-container">
  <img src="/diagrams/sse-event-flow.svg" alt="SSE Event Flow" style="max-width: 100%; height: auto;" />
</div>

| SSE `/conversations/{id}/stream` | REST `/api/v1/*` |
|----------------------------------|------------------|
| Token streaming | Health check |
| Tool call progress | List conversations |
| Thinking events | Get conversation history |
| Completion events | Configuration |
| Heartbeat pings | Model/tool management |

## SSE Protocol

### Client → Server (REST)

```bash
# Create a conversation
POST /conversations
Content-Type: application/json

{"system_prompt": "You are a research assistant"}

# Send a message
POST /conversations/{id}/messages
Content-Type: application/json

{"content": "Search for AI news"}

# Cancel generation
POST /conversations/{id}/cancel
```

### Server → Client (SSE Stream)

Connect to `GET /conversations/{id}/stream` to receive events:

```
event: token
data: {"token": "The", "cumulative": "The"}

event: thinking
data: {"content": "Let me search for recent AI news..."}

event: tool_call
data: {"id": "tc_1", "name": "web_search", "arguments": {"query": "AI news"}, "status": "pending"}

event: tool_call
data: {"id": "tc_1", "name": "web_search", "status": "executing"}

event: tool_result
data: {"id": "tc_1", "result": {...}}

event: complete
data: {"usage": {"prompt_tokens": 150, "completion_tokens": 200}}

event: ping
data: {}
```

## Python SDK

For Python projects, direct import is the cleanest approach:

```python
from agentic_forge import Orchestrator, ModelRouter, ToolRouter

# Setup
orchestrator = Orchestrator(
    model_router=ModelRouter(...),
    tool_router=ToolRouter(...)
)

# Synchronous (simple scripts)
result = orchestrator.run_sync("Search for AI news")
print(result.content)

# Async (applications)
async def main():
    result = await orchestrator.run("Search for AI news")
    print(result.content)

# Streaming
async for event in orchestrator.run_stream("Search..."):
    if event.type == "token":
        print(event.token, end="", flush=True)
    elif event.type == "tool_call":
        print(f"\n[Calling {event.tool_name}...]")

# With hooks for observability
@orchestrator.on("tool_calls")
def log_tools(data):
    print(f"Tools: {[c.name for c in data['calls']]}")
```

## CLI Interface

### Commands

```bash
# Interactive chat
agentic-forge chat

# Single query
agentic-forge run "Search for AI news and summarize"

# With options
agentic-forge run "Complex task" \
  --model smart \
  --max-iterations 20 \
  --output json

# Connect to remote orchestrator
agentic-forge chat --server http://localhost:8001
```

### Interactive Mode

```
$ agentic-forge chat

Agentic Forge v0.1.0
Connected to Armory at localhost:8000
Using model: gpt-4o

You: Search for recent AI news

[Calling brave_search("AI news 2025")...]
Found 10 results

Here are the top AI news stories from today:
1. ...

You: /quit
```

## Armory Admin API

REST API for managing the Armory:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/sources | List registered MCP servers |
| POST | /api/v1/sources | Register new MCP server |
| DELETE | /api/v1/sources/{id} | Remove MCP server |
| GET | /api/v1/tools | List all available tools |
| GET | /api/v1/health | Health check |

## Non-Python Integration

For projects not written in Python, use the REST + SSE API:

```javascript
// JavaScript/TypeScript
const baseUrl = 'http://localhost:8001';

// Create conversation and send message
const conv = await fetch(`${baseUrl}/conversations`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ system_prompt: 'You are a helpful assistant' })
}).then(r => r.json());

await fetch(`${baseUrl}/conversations/${conv.id}/messages`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: 'Search for AI news' })
});

// Listen to SSE stream
const eventSource = new EventSource(`${baseUrl}/conversations/${conv.id}/stream`);

eventSource.addEventListener('token', (e) => {
  const data = JSON.parse(e.data);
  process.stdout.write(data.token);
});

eventSource.addEventListener('tool_call', (e) => {
  const data = JSON.parse(e.data);
  console.log(`\n[${data.name}: ${data.status}]`);
});

eventSource.addEventListener('complete', () => {
  console.log('\nDone!');
  eventSource.close();
});
```

## Summary

| Interface | Use Case | Protocol |
|-----------|----------|----------|
| Python SDK | Python applications | Direct import |
| SSE API | Web/mobile, real-time streaming | HTTP + SSE |
| REST API | Management, CRUD operations | HTTP |
| CLI | Terminal users | Subprocess |
| Admin API | Armory management | REST |
