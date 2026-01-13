import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Agentic Forge",
  description: "Build more efficient AI agents with smart tool management, TOON format support, and protocol interoperability.",

  // Ignore localhost links in docs (they reference local dev servers)
  ignoreDeadLinks: [
    /^http:\/\/localhost/
  ],

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Agentic Forge' }],
    ['meta', { property: 'og:description', content: 'Build more efficient AI agents with smart tool management' }],
    // Umami Analytics
    ['script', {
      defer: '',
      src: 'https://analytics.compulife.com.pk/script.js',
      'data-website-id': '32c8679d-6998-4d43-9b62-27272cf56ee5'
    }]
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Agentic Forge',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Get Started', link: '/docs/getting-started' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Docs', link: '/docs/' },
      { text: 'GitHub', link: 'https://github.com/agentic-forge' }
    ],

    sidebar: {
      '/docs/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Quick Start', link: '/docs/getting-started' },
            { text: 'Gallery', link: '/docs/gallery' },
          ]
        },
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/docs/' },
            { text: 'Orchestrator', link: '/docs/orchestrator' },
            { text: 'Armory', link: '/docs/armory' },
            { text: 'Anvil', link: '/docs/anvil' },
            { text: 'Tool RAG', link: '/docs/tool-rag' },
            { text: 'Interfaces', link: '/docs/interfaces' },
          ]
        }
      ],
      '/blog/': [
        {
          text: 'Blog',
          items: [
            { text: 'All Posts', link: '/blog/' },
            { text: 'Multi-Provider Orchestrator', link: '/blog/multi-provider-orchestrator' },
            { text: 'Armory MCP Gateway', link: '/blog/armory-mcp-gateway' },
            { text: 'Streaming Tool Calls', link: '/blog/streaming-tool-calls' },
            { text: 'Getting Started Tutorial', link: '/blog/getting-started-tutorial' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/agentic-forge' }
    ],

    footer: {
      message: 'Building efficient AI agents',
      copyright: 'Copyright 2025-present Agentic Forge'
    },

    search: {
      provider: 'local'
    }
  }
})
