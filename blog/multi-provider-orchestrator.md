# Building a Multi-Provider AI Orchestrator

*January 2026*

One of the first decisions when building an AI agent is choosing which LLM provider to use. OpenAI? Anthropic? Google? The answer is increasingly: **all of them**.

Different models excel at different tasks. Claude is great for nuanced reasoning. GPT-4o excels at code. Gemini offers competitive pricing. And new reasoning models like DeepSeek R1 and OpenAI o1 bring chain-of-thought capabilities.

We built the Forge Orchestrator to make multi-provider support seamless. This post explains our architecture and the key decisions we made.

## The Problem

Most AI frameworks assume you'll pick one provider and stick with it. But in practice, you want:

1. **Model flexibility** - Switch models per-request based on task requirements
2. **Cost optimization** - Use cheaper models for simple tasks
3. **Fallback routing** - If one provider is down, use another
4. **Unified interface** - Same API regardless of which provider handles the request

## Our Solution: Provider-Agnostic Model Routing

The orchestrator accepts any model identifier and automatically routes it to the correct provider:

```
# Explicit provider prefix
openrouter:anthropic/claude-sonnet-4
openai:gpt-4o
anthropic:claude-sonnet-4-20250514
google-gla:gemini-2.0-flash

# Auto-detection (we figure out the provider)
gpt-4o          → routes to OpenAI
claude-sonnet-4 → routes to Anthropic
gemini-2.0-flash → routes to Google

# OpenRouter format (always routes through OpenRouter)
anthropic/claude-sonnet-4
deepseek/deepseek-r1
```

## How It Works

### 1. Model String Parsing

When a request comes in with a model name, we first check if it already has a provider prefix:

```python
pydantic_providers = [
    "openrouter:",
    "openai:",
    "anthropic:",
    "google-gla:",
    "groq:",
    "mistral:",
]

# If already prefixed, use as-is
if any(model.startswith(p) for p in pydantic_providers):
    return model
```

### 2. OpenRouter Format Detection

Models with a slash (like `anthropic/claude-sonnet-4`) are in OpenRouter format. These get routed through OpenRouter automatically:

```python
if "/" in model:
    return f"openrouter:{model}"
```

This is useful because OpenRouter provides access to 200+ models through a single API key.

### 3. Auto-Detection by Model Name

For plain model names, we detect the provider based on naming patterns:

```python
openai_patterns = ["gpt-", "o1", "o3", "chatgpt"]
anthropic_patterns = ["claude"]
google_patterns = ["gemini", "palm"]

model_lower = model.lower()

if any(pattern in model_lower for pattern in openai_patterns):
    if settings.openai_api_key:
        return "openai"
    # Fall back to OpenRouter if no direct API key
    return None
```

### 4. Intelligent Fallbacks

Here's the key insight: if a user requests `gpt-4o` but doesn't have an OpenAI API key configured, we can still serve the request through OpenRouter (if they have that key):

```python
if any(pattern in model_lower for pattern in openai_patterns):
    if self.settings.openai_api_key:
        return "openai"  # Direct to OpenAI
    elif self.settings.openrouter_api_key:
        logger.info("OpenAI model requested but no OPENAI_API_KEY, using OpenRouter")
        return None  # Will fall back to OpenRouter
```

This means users can configure just one API key (OpenRouter) and access models from multiple providers.

## Dynamic Model Discovery

Rather than hardcoding a list of available models, we fetch them from OpenRouter's API and cache the results:

```python
class OpenRouterClient:
    async def fetch_models(self) -> ModelsData:
        url = f"{self.base_url}/models"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            data = response.json()

        return self._process_models(data["data"])
```

### Filtering and Curation

OpenRouter offers 200+ models, but most users don't need that many choices. We filter to a curated set:

```python
# Only include models from trusted providers
provider_whitelist = [
    "anthropic", "openai", "google",
    "deepseek", "moonshotai", "qwen"
]

# Keep top 3 models per provider (by release date)
models_per_provider = 3

# Always include reasoning/thinking models
model_include_list = [
    "anthropic/claude-3.7-sonnet:thinking",
    "openai/o1",
    "deepseek/deepseek-r1",
    "qwen/qwq-32b",
]
```

This gives users a focused list of ~20 high-quality models instead of an overwhelming 200+.

## Thinking Model Support

Modern reasoning models like Claude 3.7 Sonnet with "extended thinking" and OpenAI o1 produce intermediate reasoning tokens. We capture and stream these:

```python
# Extract thinking from message history
for msg in result.new_messages():
    thinking = getattr(msg, 'thinking', None)
    if thinking:
        yield ThinkingEvent(
            content=str(thinking),
            cumulative=str(thinking)
        )
```

The UI can then display this reasoning process, helping users understand how the model arrived at its answer.

## Stateless Architecture

A key architectural decision: the orchestrator is **completely stateless**. Each request includes the full conversation history:

```python
async def run_stream(
    self,
    user_message: str,
    messages: list[Any] | None = None,  # Full history
    system_prompt: str | None = None,
    model: str | None = None,
) -> AsyncIterator[SSEEvent]:
```

Benefits:
- **Horizontal scaling** - Any orchestrator instance can handle any request
- **Simple deployment** - No database, no session management
- **Client control** - The UI owns the conversation state

The trade-off is larger request payloads, but modern LLMs already handle long contexts efficiently.

## Integration with Pydantic AI

We use [Pydantic AI](https://ai.pydantic.dev/) as the underlying framework. It provides:

- Model abstraction across providers
- Type-safe tool definitions
- MCP (Model Context Protocol) support
- Structured output validation

```python
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStreamableHTTP

# Create agent with MCP toolset
mcp_server = MCPServerStreamableHTTP(settings.armory_url)
agent = Agent(
    model="openrouter:anthropic/claude-sonnet-4",
    toolsets=[mcp_server],
)
```

## Configuration

The orchestrator uses environment variables for configuration:

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
