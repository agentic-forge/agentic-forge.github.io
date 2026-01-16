# Interfaces

Multiple ways to interact with Agentic Forge: CLI for terminal users, WebSocket API for real-time applications, and Python SDK for direct integration.

## Interface Overview

<div class="diagram-container">
  <img src="/diagrams/interfaces-overview.svg" alt="Interface Overview" style="max-width: 100%; height: auto;" />
</div>

## Why WebSocket over REST?

REST's request-response model doesn't fit LLM agents well:

| Challenge | REST Problem | WebSocket Solution |
|-----------|--------------|-------------------|
| Streaming tokens | Wait for complete response | Stream as generated |
| Long-running tasks | Timeouts, no progress | Persistent connection |
| Stateful conversations | Resend full context | Session maintained |
| Cancel/feedback | Can't interrupt | Bi-directional messages |

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

## WebSocket Protocol

### Client → Server

```json
// Send a chat message
{
  "type": "chat",
  "payload": {
    "conversation_id": "optional-id",
    "message": "Search for AI news",
    "system_prompt": "You are a research assistant",
    "model": "smart"
  }
}

// Cancel a request
{
  "type": "cancel",
  "payload": {
    "conversation_id": "conv-123"
  }
}
```

### Server → Client

```json
// Token streaming
{
  "type": "token",
  "conversation_id": "conv-123",
  "payload": {
    "token": "The",
    "cumulative": "The"
  }
}

// Tool call event
{
  "type": "tool_call",
  "conversation_id": "conv-123",
  "payload": {
    "tool_name": "brave_search",
    "arguments": {"query": "AI news 2025"},
    "status": "executing"
  }
}

// Completion
{
  "type": "complete",
  "conversation_id": "conv-123",
  "payload": {
    "response": "Here's what I found...",
    "usage": {
      "prompt_tokens": 150,
      "completion_tokens": 200,
      "total_cost": 0.003
    }
  }
}
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
agentic-forge chat --server ws://localhost:8000/ws/chat
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

For projects not written in Python, use the WebSocket API:

```javascript
// JavaScript/TypeScript
const ws = new WebSocket('ws://localhost:8000/ws/chat');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'chat',
    payload: { message: 'Search for AI news' }
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case 'token':
      process.stdout.write(data.payload.token);
      break;
    case 'tool_call':
      console.log(`\n[${data.payload.tool_name}]`);
      break;
    case 'complete':
      console.log('\nDone!');
      break;
  }
};
```

## Summary

| Interface | Use Case | Protocol |
|-----------|----------|----------|
| Python SDK | Python applications | Direct import |
| WebSocket API | Web/mobile, non-Python | WebSocket |
| SSE API | Simple streaming | HTTP + SSE |
| CLI | Terminal users | Subprocess |
| Admin API | Armory management | REST |
