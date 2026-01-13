# Streaming Tool Calls in Real-Time

*Coming Soon*

::: warning Draft
This article is in progress. Check back soon for the full post.
:::

## Overview

How we built real-time streaming with tool call visualization, thinking tokens, and a reactive Vue.js UI.

## Planned Sections

### The Challenge: Showing Progress
- Users need feedback during long-running operations
- Tool calls can take seconds to complete
- Thinking/reasoning models produce intermediate output
- Traditional request/response doesn't cut it

### SSE Event Architecture
- Token events for streaming text
- Tool call events (pending → executing → complete)
- Tool result events with latency tracking
- Thinking events for reasoning models
- Heartbeat pings for connection health

### Event Types Deep-Dive

```typescript
type SSEEvent =
  | TokenEvent      // Streaming text tokens
  | ToolCallEvent   // Tool invocation status
  | ToolResultEvent // Tool execution results
  | ThinkingEvent   // Reasoning model output
  | CompleteEvent   // Final response
  | ErrorEvent      // Error handling
  | PingEvent       // Connection keepalive
```

### The UI: Forge UI Implementation
- Vue 3 with Composition API
- Real-time message updates
- Tools Panel showing active tools
- Collapsible tool call displays
- Thinking token visualization

### Conversation Schema
- Schema versioning (v1.1.0)
- Message types and structure
- Tool call storage format
- Export/import capabilities

### Handling Edge Cases
- Connection drops and reconnection
- Partial responses
- Tool timeouts
- Error recovery

## Source Code

- [forge-orchestrator](https://github.com/agentic-forge/forge-orchestrator) - SSE streaming
- [forge-ui](https://github.com/agentic-forge/forge-ui) - Vue.js interface

---

*This is part of a series on building Agentic Forge.*
