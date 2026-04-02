import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { HelloHQClient } from "../api-client.js";

export function registerProjectTools(server: McpServer, client: HelloHQClient) {
  server.tool(
    "list_projects",
    "List projects with optional filtering and pagination",
    {
      filter: z.string().optional().describe("OData filter expression, e.g. \"status eq 'Active'\""),
      top: z.number().optional().describe("Maximum number of results (default: 50, max: 1000)"),
      skip: z.number().optional().describe("Number of results to skip for pagination"),
      orderby: z.string().optional().describe("OData orderby expression, e.g. \"name asc\""),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"company,projectStatus,projectMembers\""),
    },
    async ({ filter, top, skip, orderby, expand }) => {
      const result = await client.listProjects({ filter, top: top ?? 50, skip, orderby, expand });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_project",
    "Get a single project by ID with full details",
    {
      id: z.number().describe("Project ID"),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"company,projectStatus,projectMembers,customFields\""),
    },
    async ({ id, expand }) => {
      const result = await client.getProject(id, expand ?? "company,projectStatus,projectMembers,customFields");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_project_members",
    "Get all members of a project",
    {
      projectId: z.number().describe("Project ID"),
    },
    async ({ projectId }) => {
      const result = await client.getProjectMembers(projectId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_project_statuses",
    "Get all available project statuses",
    {},
    async () => {
      const result = await client.getProjectStatuses();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
