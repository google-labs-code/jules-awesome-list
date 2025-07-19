# MCP Obsidian Setup - Connect Obsidian to Claude Desktop

This guide shows you how to quickly connect your Obsidian vault to Claude Desktop using the Model Context Protocol (MCP).

## Prerequisites

1. **Claude Desktop**: [https://claude.ai/download](https://claude.ai/download)
2. **Obsidian**: [https://obsidian.md/download](https://obsidian.md/download)

## Quick Setup 🚀

### Step 1: Enable the Filesystem MCP Server

Use Anthropic's official Filesystem MCP Server for secure file access: [https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)

### Step 2: Configure Claude Desktop

Choose your preferred method to edit the config:

#### Option 1: Using nano
```bash
# Quick edit in terminal
nano ~/claude_desktop_config.json
```

#### Option 2: One-liner config
```bash
cat > ~/claude_desktop_config.json << 'EOL'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/your/obsidian/vault"
      ]
    }
  }
}
EOL
```

#### Option 3: VS Code
```bash
code ~/claude_desktop_config.json
```

### Configuration Details

Replace `/path/to/your/obsidian/vault` with the actual path to your Obsidian vault directory.

**Example configuration:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Documents/MyObsidianVault"
      ]
    }
  }
}
```

## Troubleshooting

### Common Issues

#### NPX/Node.js Issues
If you encounter issues with npx, try installing the package globally:

```bash
npm install -g @modelcontextprotocol/server-filesystem
```

Then update your config to use the direct path:

**Windows:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": [
        "C:\\Users\\username\\AppData\\Roaming\\npm\\node_modules\\@modelcontextprotocol\\server-filesystem\\dist\\index.js",
        "c:\\Users\\username\\OneDrive\\MyVault"
      ]
    }
  }
}
```

**macOS/Linux:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": [
        "/path/to/global/node_modules/@modelcontextprotocol/server-filesystem/dist/index.js",
        "/path/to/your/obsidian/vault"
      ]
    }
  }
}
```

#### Python Version Issues
Some MCP servers require Python 3.13 or greater. If you encounter issues:

1. Check your Python version: `python --version`
2. Update to Python 3.13+ if needed
3. Restart Claude Desktop completely

#### Verifying Setup

1. **Check MCP logs**: In Claude Desktop, go to Hamburger menu → Developer → MCP log file
2. **Restart Claude Desktop**: Hamburger menu → File → Exit, then reopen
3. **Verify tools are available**: Look for the hammer icon in the bottom right of the chat interface

### Advanced Setup: Obsidian API Integration

For more advanced integration using the Obsidian API instead of just file access, consider using the dedicated MCP Obsidian server:

- **MCP Obsidian**: [https://github.com/MarkusPfundstein/mcp-obsidian](https://github.com/MarkusPfundstein/mcp-obsidian)
- **Alternative**: [https://github.com/smithery-ai/mcp-obsidian](https://github.com/smithery-ai/mcp-obsidian)

This provides more granular access with functions like:
- `patch_content`: Insert content relative to headings or block references
- `append_content`: Append to new or existing files
- Better handling of Obsidian-specific features

## Benefits

- **Direct vault access**: Claude can read and write to your Obsidian notes
- **Contextual assistance**: Ask Claude to help organize, summarize, or expand your notes
- **Automated workflows**: Create templates, format content, and maintain consistency
- **Knowledge management**: Search through your vault and create connections between notes

## Limitations

- **Desktop only**: Currently only works with Claude Desktop (not mobile)
- **File path access**: The filesystem MCP requires direct file system access
- **Rate limits**: Subject to Claude's usage limits

## Source

Based on the Reddit post: [MCP Rocks - Quickly Connected Obsidian to Claude Desktop](https://www.reddit.com/r/ClaudeAI/comments/1h2e5e9/mcp_rocks_quickly_connected_obsidian_to_claude/)

---

*Last updated: July 18, 2025*
