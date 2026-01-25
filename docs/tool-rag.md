# Tool RAG

Dynamic tool selection using semantic search. Instead of loading all tools into context, retrieve only the relevant ones for each query.

## The Problem

### Context Bloat

Each tool definition consumes tokens:

```
Tool: get_weather
Description: Get current weather for a location...
Parameters:
  - location (string): The city name...
  - units (enum): celsius/fahrenheit...

≈ 50-100 tokens per tool
```

With 50 tools = 2,500-5,000 tokens just for tool definitions.

### Performance Degradation

Research shows tool accuracy **decreases** as tool count increases:

| Tool Count | Success Rate |
|------------|--------------|
| 5 tools | 95% |
| 20 tools | 85% |
| 50 tools | 70% |
| 100+ tools | <60% |

## The Solution

<div class="diagram-container">
  <img src="/diagrams/tool-rag-flow.svg" alt="Tool RAG Flow" style="max-width: 100%; height: auto;" />
</div>

## Benefits

Research from Red Hat and AWS shows accuracy improvements, and our own benchmarks demonstrate:

- **60% context reduction** when combined with TOON format (accounting for RAG round-trip overhead)
- **65% reduction** in tool definition context alone
- **Scales to thousands** of tools without degradation

## How It Works

### 1. Tool Registration

When tools are registered, their descriptions are embedded:

```python
async def register_tool(self, tool: ToolDefinition):
    # Generate embedding from description
    embedding = await self.embed(
        f"{tool.name}: {tool.description}"
    )

    # Store in vector index
    await self.index.upsert(
        id=tool.name,
        vector=embedding,
        metadata=tool.to_dict()
    )
```

### 2. Query Processing

When a query comes in, embed it and search for matches above the similarity threshold:

```python
async def search(self, query: str, threshold: float = 0.5):
    # Embed the query
    query_embedding = await self.embed(query)

    # Search vector index for all matches above threshold
    results = await self.index.search(
        query_embedding,
        threshold=threshold
    )

    # Return tool definitions
    return [r.metadata for r in results]
```

### 3. Integration with Armory

Tool RAG integrates at the gateway level:

```python
class Armory:
    async def handle_tools_list(self, request):
        if self.tool_rag_enabled and request.context:
            # Return only relevant tools (above threshold)
            tools = await self.tool_rag.search(
                request.context,
                threshold=0.5
            )
        else:
            # Return all tools
            tools = await self.registry.list_all()

        return tools
```

## Embedding Strategies

| Strategy | What to Embed | Pros/Cons |
|----------|--------------|-----------|
| Description only | Tool description text | Simple, may miss nuance |
| Description + params | Description + parameter names | More context, better matching |
| Synthetic queries | Generated example queries | Best accuracy, more compute |

## Embedding Models

| Model | Dimensions | Speed | Cost |
|-------|------------|-------|------|
| text-embedding-3-small | 1536 | Fast | $0.02/1M tokens |
| text-embedding-3-large | 3072 | Medium | $0.13/1M tokens |
| all-MiniLM-L6-v2 (local) | 384 | Very Fast | Free |
| BGE-large (local) | 1024 | Medium | Free |

## Configuration

```yaml
# In armory.yaml
tool_rag:
  enabled: true
  embedding_model: "text-embedding-3-small"
  similarity_threshold: 0.5  # Return all matches above this threshold
  cache_embeddings: true     # Cache query embeddings
```

## Metrics

```python
class ToolRAGMetrics:
    def recall(self, query, expected_tools, threshold=0.5):
        """What % of needed tools were retrieved?"""
        retrieved = self.search(query, threshold=threshold)
        return len(set(retrieved) & set(expected_tools)) / len(expected_tools)

    def precision(self, query, expected_tools, threshold=0.5):
        """What % of retrieved tools were actually needed?"""
        retrieved = self.search(query, threshold=threshold)
        if not retrieved:
            return 0.0
        return len(set(retrieved) & set(expected_tools)) / len(retrieved)

    def f1(self, query, expected_tools, threshold=0.5):
        """Harmonic mean of precision and recall"""
        p = self.precision(query, expected_tools, threshold)
        r = self.recall(query, expected_tools, threshold)
        if p + r == 0:
            return 0.0
        return 2 * (p * r) / (p + r)
```

## References

- [Our Benchmark: Cutting Context by 60%](/blog/token-optimization-toon-rag) — Detailed methodology and results
- [Tool RAG: Dynamic Tool Discovery](/blog/tool-rag-dynamic-discovery) — Implementation in Agentic Forge
- [Tool RAG: The Next Breakthrough (Red Hat)](https://next.redhat.com/2025/11/26/tool-rag-the-next-breakthrough-in-scalable-ai-agents/)
- [Dynamic ReAct Paper](https://arxiv.org/html/2509.20386)
- [AWS Strands SDK - Dynamic Tool Loading](https://builder.aws.com/content/2zeKrP0DJJLqC0Q9jp842IPxLMm/)
