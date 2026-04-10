# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

```bash
npm run build     # TypeScript → dist/
npm run dev       # Watch mode (tsc --watch)
npm run start     # Run the MCP server (requires HELLOHQ_API_TOKEN)
```

No test framework is configured. Verify changes by building (`npm run build`) and checking for type errors.

## Architecture

This is an MCP (Model Context Protocol) server that wraps the **helloHQ v2 REST API** (`https://api.hellohq.io/v2`). It uses stdio transport and exposes 63 tools.

### Key Components

- **`src/index.ts`** — Entry point. Reads `HELLOHQ_API_TOKEN` from env, creates the `HelloHQClient`, instantiates `McpServer`, and registers all tool modules.
- **`src/api-client.ts`** — Single `HelloHQClient` class with a generic `request()` method. All API calls go through this. Handles auth (Bearer token), OData query params (`$filter`, `$expand`, `$top`, `$skip`, `$orderby`), and error handling.
- **`src/tools/*.ts`** — Each file exports a `register*Tools(server, client)` function that registers MCP tools via `server.tool()`. Tool params use Zod schemas.

### Adding a New Tool

1. Add the API method to `HelloHQClient` in `api-client.ts`
2. Register the MCP tool in the appropriate `src/tools/*.ts` file (or create a new one)
3. If new file: import and call the register function in `index.ts`

### Tool Pattern

Every tool follows the same structure:
```ts
server.tool(
  "tool_name",
  "Description for the AI",
  { /* Zod schema for params */ },
  async (params) => {
    const result = await client.someMethod(params);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);
```

### API Conventions

- The helloHQ v2 API uses OData-style query parameters: `$filter`, `$expand`, `$top`, `$skip`, `$orderby`
- All list endpoints default to `top: 50`, max is 1000
- Expand parameter joins related entities (e.g. `"company,projectStatus,projectMembers"`)
- Auth: Bearer JWT token via `Authorization` header
- Rate limit: 1000 requests/minute
- **Never guess API endpoints or field names!** Always test against the real API first (e.g. via `curl`) to verify structure, required fields, and field names before implementing. Consult the API docs at https://developer.hellohq.io/ as well.
- **Test every field individually** before committing. Create a test record, verify each writable field via GET, then clean up. Do not commit untested tools.
- **CRITICAL: Never modify or delete production data for testing!** There is no backup. Always create dedicated test records, verify, then delete them immediately.

### After Changes Checklist

1. **Build:** `npm run build` — must pass without errors
2. **Update README.md:** Features table, tool count, project structure
3. **Update CLAUDE.md:** Tool count if it changed
4. **Serve locally:** After building, the MCP server is immediately available for both Claude Code and Claude Desktop (both use `dist/index.js`)

### Remotes

- `origin` → GitLab (private): `git@git.bm1.de:bm1/hellohq-mcp.git`
- `github` → GitHub (public): `git@github.com:bm1-phillip/hellohq-mcp.git`

Push to both after changes: `git push origin main && git push github main`