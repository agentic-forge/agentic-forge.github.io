---
layout: home

hero:
  name: "Agentic Forge"
  text: "Build Efficient AI Agents"
  tagline: A research platform exploring smarter tool management, token-efficient formats, and seamless protocol interoperability for AI agents.
  image:
    src: /logo.png
    alt: Agentic Forge
  actions:
    - theme: brand
      text: Get Started
      link: /docs/getting-started
    - theme: alt
      text: View Gallery
      link: /docs/gallery
    - theme: alt
      text: GitHub
      link: https://github.com/agentic-forge

features:
  - icon: 🎯
    title: Orchestrator
    details: Standalone LLM loop management with model routing, tool routing, and observability hooks.
    link: /docs/orchestrator
  - icon: 🛡️
    title: Armory
    details: Like OpenRouter for tools — one unified MCP interface to many backends (MCP servers, REST APIs, local functions).
    link: /docs/armory
  - icon: 💬
    title: forge-ui
    details: Vue.js chat interface with SSE streaming, tool call visualization, and conversation management.
    link: /docs/forge-ui
  - icon: 🔨
    title: Anvil
    details: CLI and web-based inspector for testing and debugging MCP servers during development.
    link: /docs/anvil
---

<style>
.VPHero .VPImage {
  max-width: 180px;
  margin-bottom: 24px;
}
</style>

## Who Is This For?

<div class="audience-grid">

| Audience | Use Case |
|----------|----------|
| **AI Engineers** | Building production agents with multi-model routing and tool orchestration |
| **MCP Developers** | Need a gateway to aggregate multiple MCP servers into one interface |
| **Researchers** | Exploring Tool RAG, TOON format, and agent efficiency optimizations |
| **DevTools Builders** | Looking for reference implementations of agent architectures |

</div>

## Example MCP Servers

Agentic Forge includes ready-to-use MCP servers to get you started:

| Server | Description |
|--------|-------------|
| [mcp-weather](https://github.com/agentic-forge/mcp-weather) | Weather data via Open-Meteo API |
| [mcp-web-search](https://github.com/agentic-forge/mcp-web-search) | Web search via Brave Search API |

## Key Innovations

<div class="features-grid">

### 🧠 Tool RAG
Dynamic tool selection via semantic search. 60% context reduction measured, with accuracy improvements.

### 💾 TOON Format
Token-Oriented Object Notation for 15-40% token reduction in tool results, scaling with data size.

### 🌐 Protocol Interop
Seamless translation between OpenAI, Anthropic, Gemini formats and MCP protocol.

### 🔧 Smart Routing
Rule-based routing to select models and tools based on task characteristics.

### 🔍 Observability
Hooks and middleware for logging, metrics, cost tracking, and custom logic injection.

</div>

::: tip Early Access
Agentic Forge is in active development. Core components are working - [get started](/docs/getting-started) and try it yourself!
:::
