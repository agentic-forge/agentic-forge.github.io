# Armory: An MCP Gateway for AI Agents

*Coming Soon*

::: warning Draft
This article is in progress. Check back soon for the full post.
:::

## Overview

Armory is to MCP servers what OpenRouter is to LLMs - one unified interface to many tool backends.

## Planned Sections

### The Problem: Tool Fragmentation
- Multiple MCP servers, each with their own endpoint
- Different tool naming conventions
- No unified discovery mechanism
- Managing connections to many servers

### Our Solution: Hybrid MCP Gateway
- Aggregated endpoint (`/mcp`) - all tools with server prefixes
- Direct access (`/mcp/{server}`) - passthrough to specific servers
- Discovery metadata (`/.well-known/mcp.json`)

### Architecture Deep-Dive
- FastMCP for the gateway implementation
- Backend registration and health checking
- Tool namespacing to avoid conflicts
- Admin UI for management

### The Admin UI
- Dashboard showing connected backends
- Tool registry browser
- MCP Playground for testing tools
- Metrics and monitoring

### Docker Deployment
- Multi-service setup with Docker Compose
- Auto-registration of MCP servers
- Health endpoints and readiness checks

### Code Examples
- Registering a new backend
- Calling tools through the gateway
- Building custom MCP servers with FastMCP

## Source Code

- [forge-armory](https://github.com/agentic-forge/forge-armory)
- [mcp-weather](https://github.com/agentic-forge/mcp-weather) - Example MCP server
- [mcp-web-search](https://github.com/agentic-forge/mcp-web-search) - Example MCP server

---

*This is part of a series on building Agentic Forge.*
