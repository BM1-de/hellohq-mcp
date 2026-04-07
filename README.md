# helloHQ MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.x-blueviolet.svg)](https://modelcontextprotocol.io)
[![helloHQ](https://img.shields.io/badge/helloHQ-by%20everii-00B4D8.svg)](https://hellohq.io)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for [helloHQ](https://hellohq.io) — the project management & ERP platform by [everii](https://everii.com).

This server connects AI assistants like **Claude** to your helloHQ instance, giving them access to projects, documents, time tracking, and more.

---

## Features

| Category | Read | Write | Tools |
|---|:---:|:---:|---|
| **Projects** | ✅ | — | `list_projects` `get_project` `get_project_members` `get_project_statuses` |
| **Tasks** | ✅ | ✅ | `list_tasks` `get_project_tasks` `get_task_statuses` `create_task` `update_task` `set_task_status` `mark_task_done` `mark_task_open` |
| **Documents** | ✅ | ✅ | `list_documents` `get_document` `get_document_positions` `get_document_elements` `get_document_comments` `get_document_statuses` `get_document_templates` `create_document` `update_document` `delete_document` `change_document_status` `change_document_template` `copy_document` `create_document_from_document` `add_document_payment` `add_document_comment` |
| **Document Positions** | — | ✅ | `create_free_text_position` `create_service_position` `create_service_set_position` `create_text_position` `update_document_position` `delete_document_position` |
| **Document Elements** | — | ✅ | `create_document_text_element` `update_document_text_element` `create_document_page_break` `create_document_table` `delete_document_element` |
| **Reportings** | ✅ | ✅ | `list_reportings` `get_reporting` `create_reporting` `update_reporting` `delete_reporting` `change_reporting_task` |
| **Working Times** | ✅ | ✅ | `list_working_times` `create_working_time` `get_running_working_time` `start_working_time` `stop_working_time` `update_running_working_time` |
| **Users** | ✅ | — | `list_users` `get_user` |
| **Companies** | ✅ | — | `list_companies` `get_company` |

**55 tools** total, covering the helloHQ v2 REST API.

---

## Quick Start

### 1. Get an API Token

In helloHQ, go to **Admin → Settings → API** and create an access token:

- **User Token** — respects the user's permissions (recommended)
- **Sync Token** — system-wide access without user context

### 2. Install

**From source:**

```bash
git clone https://github.com/bm1-phillip/hellohq-mcp.git
cd hellohq-mcp
npm install
npm run build
```

### 3. Configure your MCP Client

<details>
<summary><strong>Claude Desktop</strong></summary>

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "hellohq": {
      "command": "node",
      "args": ["/path/to/hellohq-mcp/dist/index.js"],
      "env": {
        "HELLOHQ_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude mcp add hellohq -s user \
  -e HELLOHQ_API_TOKEN=your-api-token \
  -- node /path/to/hellohq-mcp/dist/index.js
```

</details>

<details>
<summary><strong>Other MCP Clients</strong></summary>

Any MCP-compatible client can use this server. Configure it as a **stdio** transport:

- **Command:** `node`
- **Args:** `["/path/to/hellohq-mcp/dist/index.js"]`
- **Environment:** `HELLOHQ_API_TOKEN=your-api-token`

</details>

### Environment Variables

| Variable | Required | Description |
|---|:---:|---|
| `HELLOHQ_API_TOKEN` | ✅ | API access token from helloHQ |
| `HELLOHQ_API_URL` | — | Custom API base URL (default: `https://api.hellohq.io/v2`) |

---

## Usage Examples

Once configured, you can ask your AI assistant things like:

> "Show me all active projects"

> "What tasks are open in project K-25-398?"

> "List all invoices from this month"

> "Create a reporting: 2 hours on task 12345 for today"

> "Start the time tracker on task 54321"

### Example: Listing Projects

```
User: Show me active projects for Acme Corp

Tool call: list_projects
  filter: "companyId eq 61037"
  expand: "company,projectStatus"
  top: 10
```

```json
[
  {
    "id": 519,
    "name": "Website Relaunch (Acme)",
    "number": "K-25-398",
    "projectStatus": {
      "name": "In Progress",
      "inProgress": true
    },
    "company": {
      "name": "Acme Corp GmbH"
    },
    "startDate": "2025-02-01T00:00:00",
    "plannedFinishDate": "2026-01-31T00:00:00"
  }
]
```

### Example: Reading a Document

```
User: Show me quotation AN-26-0126

Tool call: get_document
  id: 1963
  expand: "company,project,positions,documentStatusEntity"
```

```json
{
  "id": 1963,
  "documentType": "Quotation",
  "number": "AN-26-0126",
  "date": "2026-04-02T00:00:00",
  "netValue": 892.50,
  "taxValue": 169.58,
  "grossValue": 1062.08,
  "currency": "EUR",
  "company": {
    "name": "Acme Corp GmbH"
  },
  "project": {
    "name": "Website Relaunch (Acme)",
    "number": "K-25-398"
  },
  "documentStatusEntity": {
    "name": "Sent"
  }
}
```

### Example: Reporting Time

```
User: Log 1.5 hours for task "Analytics Setup" today

Tool call: create_reporting
  name: "Set up analytics properties and configured events"
  startOn: "2026-04-02T12:30:00"
  endOn: "2026-04-02T14:00:00"
  taskId: 96095
  userId: 11009
```

```json
{
  "id": 32355,
  "name": "Set up analytics properties and configured events",
  "startOn": "2026-04-02T12:30:00Z",
  "endOn": "2026-04-02T14:00:00Z",
  "duration": 1.5,
  "chargeRateValue": 85,
  "isApproved": false,
  "projectId": 41,
  "taskId": 96095,
  "userId": 11009
}
```

### Example: Time Tracking

```
User: Start the timer on task 97875

Tool call: start_working_time
  taskId: 97875
  note: "Bug fixes"
```

```
User: Stop the timer

Tool call: stop_working_time
```

---

## Filtering

All `list_*` tools support OData-style filtering, sorting, and pagination:

```
# Filter by company
filter: "companyId eq 123"

# Filter by date range
filter: "startOn ge 2025-01-01T00:00:00 and startOn lt 2025-02-01T00:00:00"

# Filter by status
filter: "isDone eq false"

# Sort results
orderby: "date desc"

# Pagination
top: 20
skip: 40

# Expand related entities
expand: "company,project,projectStatus"
```

### Common filter operators

| Operator | Description | Example |
|---|---|---|
| `eq` | Equals | `"status eq 'Active'"` |
| `ne` | Not equals | `"isDone ne true"` |
| `gt` / `ge` | Greater than / or equal | `"date gt 2025-01-01T00:00:00"` |
| `lt` / `le` | Less than / or equal | `"netValue le 1000"` |
| `and` / `or` | Logical operators | `"isDone eq false and projectId eq 10"` |

---

## API Reference

This server uses the **helloHQ API v2** — a standard REST API with token-based authentication.

- **Base URL:** `https://api.hellohq.io/v2`
- **Rate Limit:** 1000 requests/minute
- **Documentation:** [developer.hellohq.io](https://developer.hellohq.io)

---

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

### Project Structure

```
src/
├── index.ts           # MCP server entry point
├── api-client.ts      # HelloHQ API client
└── tools/
    ├── projects.ts    # Project tools
    ├── tasks.ts       # Task tools
    ├── documents.ts   # Document tools
    ├── reportings.ts  # Reporting tools
    ├── working-times.ts # Working time tools
    └── users.ts       # User & company tools
```

---

## License

MIT