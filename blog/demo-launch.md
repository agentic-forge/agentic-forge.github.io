# Agentic Forge Demo is Live

*January 2026*

Try Agentic Forge at [agentic-forge.compulife.com.pk](https://agentic-forge.compulife.com.pk) — a working AI agent with tool access, running the full stack we've been building.

## Quick Start

1. **Get an API key** — [OpenRouter](https://openrouter.ai/keys) is the easiest option (one key, 300+ models)
2. **Open the demo** — [agentic-forge.compulife.com.pk](https://agentic-forge.compulife.com.pk)
3. **Add your key** — Click the gear icon next to the model selector, enter your OpenRouter key, then click the check button to save
4. **Fetch models** — Click the "Fetch" button to load available models from your provider
5. **Select a model** — Good options include `google/gemini-3-flash-preview`, `moonshotai/kimi-k2-0905`, or `deepseek/deepseek-v3.2`
6. **Start chatting** — Try asking about the weather or searching the web

That's it. Your API key is stored in your browser only—we never see or store it.

## Built-in Tools

The demo comes with three MCP servers pre-configured—two built by us, one third-party:

| Server | Source | Tools | Example Queries |
|--------|--------|-------|-----------------|
| **Weather** | [Agentic Forge](https://github.com/agentic-forge/mcp-weather) | Current conditions, forecasts, historical data | "What's the weather in Tokyo?" |
| **Web Search** | [Agentic Forge](https://github.com/agentic-forge/mcp-web-search) | Brave Search API | "Search for recent news about AI agents" |
| **HuggingFace** | Third-party | Model info, datasets, spaces | "Find popular text-to-image models" |

All three work seamlessly through Armory, our MCP gateway. The agent discovers relevant tools automatically using [Tool RAG](/blog/tool-rag-dynamic-discovery)—you don't need to specify which tool to use.

## Add Your Own Tools

Have an MCP server? Connect it directly:

1. Open the tools panel (wrench icon)
2. Click "Add Custom Server"
3. Enter the URL (and API key if required)
4. Your tools appear alongside the built-in ones

Custom servers work for the current session only. See [What's New](/blog/whats-new-jan-2026) for details.

## What You're Running

The demo runs the full Agentic Forge stack:

![Demo Stack Architecture](/diagrams/demo-stack-architecture.svg)

All the optimizations we've written about are active:

- **[Tool RAG](/blog/tool-rag-dynamic-discovery)** — Agent discovers tools on-demand instead of loading all 18
- **[TOON format](/blog/toon-format-support)** — Tool results use 30-60% fewer tokens
- **[Combined: 60% context reduction](/blog/token-optimization-toon-rag)** — More room for conversation

## Known Limitations

This is a demo deployment:

- **No Armory admin access** — The Armory admin UI is not exposed in the demo to keep the base configuration consistent for everyone and prevent excessive MCP server additions. You can still add custom MCP servers directly from the chat interface.
- **Shared infrastructure** — Not designed for production workloads

Want full control? Deploy your own instance using [forge-devtools](https://github.com/agentic-forge/forge-devtools)—everything is open source.

## Feedback

Found a bug? Have a suggestion? Open an issue:

- [forge-ui issues](https://github.com/agentic-forge/forge-ui/issues) — UI/UX feedback
- [forge-orchestrator issues](https://github.com/agentic-forge/forge-orchestrator/issues) — Agent behavior, model issues
- [forge-armory issues](https://github.com/agentic-forge/forge-armory/issues) — Tool and MCP issues

## Self-Hosting

Want to run your own instance? The entire stack is open source:

```bash
git clone https://github.com/agentic-forge/forge-devtools
cd forge-devtools
cp .env.example .env  # Add your API keys
docker compose up
```

See the [Getting Started Tutorial](/blog/getting-started-tutorial) for detailed instructions.

## What's Next

We're working on:

- **More MCP servers** — GitHub, calendar, file system tools
- **Protocol adapters** — OpenAI function calling, REST APIs

Follow the [GitHub org](https://github.com/agentic-forge) for updates.

---

*Try the demo: [agentic-forge.compulife.com.pk](https://agentic-forge.compulife.com.pk)*

*This is part of a series on building [Agentic Forge](https://agentic-forge.github.io).*
