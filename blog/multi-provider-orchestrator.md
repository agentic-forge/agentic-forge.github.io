# Building a Multi-Provider AI Orchestrator

*January 2026*

When building AI agents, you often need to support multiple LLM providers. Different teams have different API keys. Researchers want to compare model behaviors. Production systems need fallback options.

We built the Forge Orchestrator as a ready-to-use reference implementation that handles multi-provider routing out of the box. This post explains our architecture and the key decisions we made.

## The Gap We're Filling

Modern AI frameworks like [LangChain](https://python.langchain.com/), [Pydantic AI](https://ai.pydantic.dev/), and [CrewAI](https://www.crewai.com/) are already model-agnostic at their core. They abstract away provider differences and let you swap models easily.

So why build another orchestrator?

**The gap isn't abstraction—it's integration.** These frameworks give you building blocks, but you still need to:

- Wire up a chat interface
- Handle SSE streaming to a frontend
- Manage tool execution with MCP servers
- Configure model selection dynamically
- Deploy everything together

Agentic Forge provides a **working system out of the box**. Developers get a functional starting point they can customize. Researchers can focus on AI experiments instead of frontend architecture.

Our orchestrator adds a few conveniences on top of Pydantic AI:

1. **Flexible model routing** - Accept any model format and route it correctly
2. **OpenRouter as universal fallback** - One API key to access 200+ models
3. **Dynamic model discovery** - Fetch and cache available models automatically
4. **SSE streaming** - Ready for real-time chat interfaces

![Multi-Provider Architecture](/diagrams/orchestrator-architecture.svg)

## Flexible Model Routing

The orchestrator accepts any model identifier and automatically routes it to the correct provider:

```
# Explicit provider prefix
openrouter:anthropic/claude-sonnet-4
openai:gpt-4o
anthropic:claude-sonnet-4-20250514
google-gla:gemini-2.0-flash

# Auto-detection (we figure out the provider)
gpt-4o           → routes to OpenAI
claude-sonnet-4  → routes to Anthropic
gemini-2.0-flash → routes to Google

# OpenRouter format (always routes through OpenRouter)
anthropic/claude-sonnet-4
deepseek/deepseek-r1
```

![Model Routing Flow](/diagrams/orchestrator-routing.svg)

This means users can configure just one API key (OpenRouter) and access models from multiple providers—or use direct API keys for lower latency when available.

## Dynamic Model Discovery

Rather than hardcoding a list of available models, we fetch them from OpenRouter's API and cache the results. The UI can then display an up-to-date model selector.

OpenRouter offers 200+ models, but that's overwhelming. We filter to a curated set:

- **Provider whitelist** - Only include models from trusted providers
- **Recency filter** - Keep only the top N models per provider (by release date)
- **Include list** - Always include specific models (like reasoning/thinking models) regardless of filtering

This gives users a focused selection of high-quality models.

## Thinking Model Support

Modern reasoning models produce intermediate reasoning tokens—sometimes called "extended thinking" or "chain-of-thought" output. The orchestrator captures these and streams them as separate events, allowing the UI to display the reasoning process alongside the final answer.

## Stateless Architecture

The orchestrator is **completely stateless**. Each request includes the full conversation history. This enables:

- **Horizontal scaling** - Any orchestrator instance can handle any request
- **Simple deployment** - No database, no session management
- **Client control** - The UI owns the conversation state

The trade-off is larger request payloads, but modern LLMs already handle long contexts efficiently.

## Built on Pydantic AI

We use [Pydantic AI](https://ai.pydantic.dev/) as the underlying framework. It provides model abstraction across providers, type-safe tool definitions, MCP support, and structured output validation. Our orchestrator adds the routing, streaming, and integration layers on top.

## Configuration

The orchestrator uses environment variables:

```bash
# At least one of these is required
OPENROUTER_API_KEY=sk-or-...      # Access 200+ models
OPENAI_API_KEY=sk-...              # Direct OpenAI access
ANTHROPIC_API_KEY=sk-ant-...       # Direct Anthropic access
GEMINI_API_KEY=AI...               # Direct Google access

# Optional settings
ORCHESTRATOR_DEFAULT_MODEL=anthropic/claude-sonnet-4
ORCHESTRATOR_ARMORY_URL=http://localhost:8080/mcp
```

## What's Next

The orchestrator is the core of Agentic Forge, but it's just one component. In upcoming posts, we'll cover:

- **Armory** - The MCP gateway that provides tools to the orchestrator
- **Streaming** - How we handle SSE events and tool call visualization
- **The full stack** - Setting up everything with Docker Compose

Check out the [source code](https://github.com/agentic-forge/forge-orchestrator) or try the [getting started guide](/docs/getting-started).

---

*This is part of a series on building Agentic Forge. Follow along as we explore efficient AI agent architectures.*
