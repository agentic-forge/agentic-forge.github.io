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
  - icon: 🧠
    title: Tool RAG
    details: Dynamic tool selection via semantic search. 3x accuracy improvement, 50% context reduction.
    link: /docs/tool-rag
  - icon: 💻
    title: Interfaces
    details: CLI, WebSocket API, and Python SDK for flexible integration into any system.
    link: /docs/interfaces
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

## Key Innovations

<div class="features-grid">

### 💾 TOON Format
Token-Oriented Object Notation for 30-40% token reduction in tool results. Better accuracy than JSON.

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
