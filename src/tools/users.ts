import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { HelloHQClient } from "../api-client.js";

export function registerUserTools(server: McpServer, client: HelloHQClient) {
  server.tool(
    "list_users",
    "List all users (employees) with optional filtering",
    {
      filter: z.string().optional().describe("OData filter expression"),
      top: z.number().optional().describe("Maximum number of results (default: 50, max: 1000)"),
      skip: z.number().optional().describe("Number of results to skip for pagination"),
      orderby: z.string().optional().describe("OData orderby expression, e.g. \"lastName asc\""),
      expand: z.string().optional().describe("Related entities to expand"),
    },
    async ({ filter, top, skip, orderby, expand }) => {
      const result = await client.listUsers({ filter, top: top ?? 50, skip, orderby, expand });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_user",
    "Get a single user by ID",
    {
      id: z.number().describe("User ID"),
      expand: z.string().optional().describe("Related entities to expand"),
    },
    async ({ id, expand }) => {
      const result = await client.getUser(id, expand);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}