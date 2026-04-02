# helloHQ MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for [helloHQ](https://hellohq.io) — the project management & ERP platform.

This server connects AI assistants (Claude, etc.) to your helloHQ instance, enabling them to read projects, documents, and time tracking data, as well as create and manage reportings.

## Features

### Projects & Tasks
- List and search projects with filtering
- Read project details, members, and task plans
- Create, update, and manage tasks
- Set task statuses, mark tasks as done/open

### Documents
- List and read documents (invoices, quotations, credit notes, delivery notes)
- View document positions, elements, and comments
- Filter by document type, company, project, and more

### Reportings (Time Entries)
- List, create, update, and delete time reportings
- Move reportings between tasks
- Filter by user, project, date range

### Working Times
- List working time entries
- Start/stop time tracking timer
- Create completed working time entries
- Update running timer (change task or note)

### Users & Companies
- List and search users and companies
- Read user and company details

## Setup

### 1. Get an API Token

Generate an access token in helloHQ:
**Admin → Settings → API** → Create a new token (User Token or Sync Token).

### 2. Install

```bash
npm install -g hellohq-mcp
```

Or clone and build from source:

```bash
git clone https://github.com/YOUR_USERNAME/hellohq-mcp.git
cd hellohq-mcp
npm install
npm run build
```

### 3. Configure

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "hellohq": {
      "command": "node",
      "args": ["/path/to/hellohq-mcp/dist/index.js"],
      "env": {
        "HELLOHQ_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

Or for Claude Code (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "hellohq": {
      "command": "node",
      "args": ["/path/to/hellohq-mcp/dist/index.js"],
      "env": {
        "HELLOHQ_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `HELLOHQ_API_TOKEN` | Yes | API access token from helloHQ |
| `HELLOHQ_API_URL` | No | Custom API base URL (default: `https://api.hellohq.io/v2`) |

## Available Tools

| Tool | Description |
|---|---|
| `list_projects` | List/search projects |
| `get_project` | Get project details |
| `get_project_members` | Get project members |
| `get_project_statuses` | Get available project statuses |
| `list_tasks` | List tasks across all projects |
| `get_project_tasks` | Get tasks for a specific project |
| `get_task_statuses` | Get task statuses for a project |
| `create_task` | Create a new task |
| `update_task` | Update a task |
| `set_task_status` | Set task status |
| `mark_task_done` | Mark task as done |
| `mark_task_open` | Reopen a task |
| `list_documents` | List/search documents |
| `get_document` | Get document with full details |
| `get_document_positions` | Get document line items |
| `get_document_elements` | Get document text/table elements |
| `get_document_comments` | Get document comments |
| `get_document_statuses` | Get available document statuses |
| `list_reportings` | List time reportings |
| `get_reporting` | Get reporting details |
| `create_reporting` | Create a time reporting |
| `update_reporting` | Update a reporting |
| `delete_reporting` | Delete a reporting |
| `change_reporting_task` | Move reporting to another task |
| `list_working_times` | List working time entries |
| `create_working_time` | Create a working time entry |
| `get_running_working_time` | Get active timer |
| `start_working_time` | Start time tracking |
| `stop_working_time` | Stop time tracking |
| `update_running_working_time` | Update running timer |
| `list_users` | List users |
| `get_user` | Get user details |
| `list_companies` | List companies |
| `get_company` | Get company details |

## Filtering

All list tools support OData-style filtering via the `filter` parameter:

```
# Documents from a specific company
filter: "companyId eq 123"

# Open tasks
filter: "isDone eq false"

# Reportings for a date range
filter: "startOn ge 2025-01-01T00:00:00 and startOn lt 2025-02-01T00:00:00"

# Projects by status
filter: "status eq 'Active'"
```

## API Reference

This server uses the [helloHQ API v2](https://developer.hellohq.io). Rate limit: 1000 requests/minute.

## License

MIT
