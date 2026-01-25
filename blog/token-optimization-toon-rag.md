# Cutting Context by 60%: TOON Format + Tool RAG

*January 2026*

We measured the combined effect of two optimizations in Agentic Forge: TOON format for compact tool results, and Tool RAG for dynamic tool discovery. Together, they reduce context size by 60%.

## The Experiment

We ran the same weather query through three configurations using `google/gemini-3-flash-preview`:

1. **Baseline** — All 19 tools loaded, JSON responses
2. **TOON only** — All 19 tools loaded, TOON responses
3. **TOON + RAG** — Dynamic tool discovery, TOON responses

Query: *"What is the weather like in Islamabad, Pakistan today?"*

## Results

![Token Comparison Chart](/diagrams/token-comparison-chart.svg)

| Configuration | Context Size | Savings |
|---------------|--------------|---------|
| Baseline (all tools + JSON) | 12,142 chars | — |
| TOON only (all tools + TOON) | 12,074 chars | 0.6% |
| TOON + RAG (with overhead) | 4,799 chars | **60.5%** |

The results show that Tool RAG provides the majority of the savings, while TOON contributes a smaller but consistent reduction on tool results.

Note: The RAG figure includes the overhead from the extra round-trip (search_tools call and result in conversation history).

## Breaking Down the Savings

### Tool Definitions: Where RAG Shines

The biggest context consumers are tool definitions. Each tool's name, description, and parameter schema takes tokens—and most tools go unused in any given request.

| Configuration | Tools Loaded | Size |
|---------------|--------------|------|
| All tools | 19 | 11,704 chars (~2,926 tokens) |
| RAG initial | 1 (search_tools) | 370 chars (~92 tokens) |
| RAG after discovery | 6 | 4,104 chars (~1,026 tokens) |

With RAG, the initial context contains only `search_tools`. After semantic search, 5 weather-related tools are discovered and loaded. Total tool definitions drop by **65%**.

### RAG Round-Trip Overhead

Tool RAG requires two model calls instead of one: the first to discover tools, the second to use them. We accounted for this in our comparison by including the conversation history overhead from the first call:

| Component | Size |
|-----------|------|
| search_tools call | 101 chars |
| search_tools result wrapper | 224 chars |
| **Total overhead** | **325 chars (~81 tokens)** |

The 60% savings figure includes this overhead—it's not a best-case number that ignores the extra round-trip.

### Tool Results: Where TOON Helps

TOON format provides modest but consistent savings on structured data:

| Format | Size | Savings |
|--------|------|---------|
| JSON | 438 chars | — |
| TOON | 370 chars | **15.5%** |

For a simple weather response, that's 68 characters saved. The savings here are modest because the weather data is small. With larger responses—database query results, API responses with many records, or nested configuration objects—the ~16% savings compounds significantly. A 10KB JSON response would save ~1.6KB per call.

**JSON:**
```json
{"location": "Islamabad, Pakistan", "coordinates": [33.72148, 73.04329], "temperature": 7.6, ...}
```

**TOON:**
```
location: "Islamabad, Pakistan"
coordinates[2]: 33.72148,73.04329
temperature: 7.6
...
```

## Why This Matters

### 1. Lower API Costs

LLM API pricing varies widely—from $0.15/M tokens for flash models to $15+/M for frontier reasoning models—but the math is simple: fewer tokens means lower bills. A 60% reduction compounds across every request.

### 2. Longer Conversations

Context windows are finite. By using ~4,800 characters for tools instead of 12,000, you have over 7,000 more characters for conversation history before hitting limits.

### 3. Better Tool Selection

Research shows LLMs perform worse when presented with many tools. Tool RAG surfaces only relevant tools, improving selection accuracy. The [ToolRAG paper](https://arxiv.org/html/2509.20386) demonstrated 3x improvement in tool accuracy.

### 4. Scales with Tool Count

These savings grow with your tool library:

| Tools Available | All Loaded | RAG (avg 5 discovered) | Savings |
|-----------------|------------|------------------------|---------|
| 10 | ~6,000 chars | ~2,500 chars | 58% |
| 20 | ~12,000 chars | ~2,700 chars | 78% |
| 50 | ~30,000 chars | ~3,000 chars | 90% |

## Implementation

Both optimizations are available in Forge Armory:

**TOON Format:**
- Send `Accept: text/toon` header with MCP requests
- Tool results return in TOON notation instead of JSON

**Tool RAG:**
- Use `/mcp?mode=rag` endpoint
- Receive only `search_tools` meta-tool initially
- Search discovers relevant tools for your task

Combine them for maximum efficiency:
```
GET /mcp?mode=rag
Accept: text/toon
```

## Trade-offs

**TOON:**
- Requires client-side parsing (though most LLMs understand it natively)
- Best for flat/tabular data; deeply nested structures see less benefit

**Tool RAG:**
- Adds one round-trip for tool discovery (handled by auto-continue)
- Small latency increase (~200ms for semantic search)
- Less beneficial for small tool sets where the RAG overhead (~325 chars) may exceed savings

## Conclusion

For agents with more than a handful of tools, Tool RAG provides substantial context savings with minimal overhead. TOON format adds incremental savings on tool results. Together—accounting for the RAG round-trip overhead—they reduced our test context by 60%, from 12,142 to 4,799 characters.

The optimizations are independent and can be adopted separately based on your needs.

## Source Code

- [forge-armory](https://github.com/agentic-forge/forge-armory) — MCP gateway with TOON and RAG support
- [TOON format specification](https://github.com/toon-format/toon) — Token-Oriented Object Notation

## Previous Posts

- [Tool RAG: Dynamic Tool Discovery](/blog/tool-rag-dynamic-discovery) — How Tool RAG works
- [TOON Format: Cutting Tokens Without Cutting Information](/blog/toon-format-support) — TOON in Agentic Forge

---

*This is part of a series on building [Agentic Forge](https://agentic-forge.github.io).*
