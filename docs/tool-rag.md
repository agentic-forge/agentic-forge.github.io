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

<div class="architecture-diagram">
<pre>
┌─────────────┐
│ User Query  │
│ "Book a     │
│  flight to  │
│  Paris"     │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌─────────────────────────────────────────┐
│   Embed     │      │           TOOL REGISTRY                  │
│   Query     │      │  book_flight    [0.2, 0.8, 0.1, ...]    │
└──────┬──────┘      │  get_weather    [0.5, 0.3, 0.7, ...]    │
       │             │  search_hotels  [0.3, 0.7, 0.2, ...]    │
       ▼             │              ... 1000s more ...          │
┌─────────────┐      └─────────────────────────────────────────┘
│  Semantic   │─────────────────────────────────────────────────>
│   Search    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  TOP-K RELEVANT TOOLS (k=5)                                  │
│  1. book_flight (0.95 similarity)                            │
│  2. search_flights (0.87 similarity)                         │
│  3. get_airport_info (0.72 similarity)                       │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│    LLM      │  Only sees 5 tools instead of 1000+
│  (with 5    │  → Better accuracy
│   tools)    │  → Fewer tokens
└─────────────┘
</pre>
</div>

## Benefits

Research from Red Hat and AWS shows:

- **3x improvement** in tool invocation accuracy
- **~50% reduction** in prompt token usage
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

When a query comes in, embed it and search:

```python
async def search(self, query: str, top_k: int = 10):
    # Embed the query
    query_embedding = await self.embed(query)

    # Search vector index
    results = await self.index.search(
        query_embedding,
        top_k=top_k
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
            # Return only relevant tools
            tools = await self.tool_rag.search(
                request.context,
                top_k=10
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
  default_top_k: 10
  similarity_threshold: 0.5  # Filter low-relevance matches
  cache_embeddings: true     # Cache query embeddings
```

## Metrics

```python
class ToolRAGMetrics:
    def recall_at_k(self, query, expected_tools, k):
        """What % of needed tools were retrieved?"""
        retrieved = self.search(query, top_k=k)
        return len(set(retrieved) & set(expected_tools)) / len(expected_tools)

    def precision_at_k(self, query, expected_tools, k):
        """What % of retrieved tools were actually needed?"""
        retrieved = self.search(query, top_k=k)
        return len(set(retrieved) & set(expected_tools)) / len(retrieved)

    def mrr(self, query, expected_tool):
        """Mean Reciprocal Rank - how early does the right tool appear?"""
        retrieved = self.search(query, top_k=20)
        for i, tool in enumerate(retrieved):
            if tool == expected_tool:
                return 1.0 / (i + 1)
        return 0.0
```

## References

- [Tool RAG: The Next Breakthrough (Red Hat)](https://next.redhat.com/2025/11/26/tool-rag-the-next-breakthrough-in-scalable-ai-agents/)
- [Dynamic ReAct Paper](https://arxiv.org/html/2509.20386)
- [AWS Strands SDK - Dynamic Tool Loading](https://builder.aws.com/content/2zeKrP0DJJLqC0Q9jp842IPxLMm/)
