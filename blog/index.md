# Blog

Technical articles about building efficient AI agents with Agentic Forge.

## Latest Posts

<div class="blog-list">

### [Tool RAG: Dynamic Tool Discovery for AI Agents](/blog/tool-rag-dynamic-discovery)
*January 2026*

How we implemented Tool RAG in Agentic Forge—agents discover tools on-demand through semantic search instead of loading all tools upfront, reducing context usage and improving tool selection accuracy.

---

### [TOON Format: Cutting Tokens Without Cutting Information](/blog/toon-format-support)
*January 2026*

How we implemented TOON format support across Agentic Forge to reduce tool result tokens by 30-60%, with a custom header workaround for MCP SDK limitations.

---

### [Model Management: Beyond the Dropdown](/blog/model-management-ui)
*January 2026*

How we built a model management system with favorites, recent models, and multi-provider support to tame 300+ available LLMs.

---

### [Getting Started with Agentic Forge](/blog/getting-started-tutorial)
*January 2026*

Complete tutorial on setting up the full Agentic Forge stack with Docker Compose—from clone to running chat interface with tools.

---

### [Building a Multi-Provider AI Orchestrator](/blog/multi-provider-orchestrator)
*January 2026*

How we built a model-agnostic orchestrator that routes to OpenRouter, OpenAI, Anthropic, and Google with automatic provider detection and intelligent fallbacks.

---

### [Armory: An MCP Gateway for AI Agents](/blog/armory-mcp-gateway)
*January 2026*

Deep-dive into our MCP protocol gateway that aggregates multiple tool servers into a unified interface with namespacing, metrics, and an admin UI.

---

### [Streaming Tool Calls in Real-Time](/blog/streaming-tool-calls)
*January 2026*

How we built real-time SSE streaming with tool call events, thinking tokens, and a reactive Vue.js UI that shows every step of the agent's work.

</div>

<style>
.blog-list h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.blog-list h3 a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.blog-list h3 a:hover {
  text-decoration: underline;
}

.blog-list em {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.blog-list p {
  margin-top: 0.5rem;
  color: var(--vp-c-text-2);
}

.blog-list hr {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
