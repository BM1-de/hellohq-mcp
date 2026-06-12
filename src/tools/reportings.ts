import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { HelloHQClient } from "../api-client.js";

export function registerReportingTools(server: McpServer, client: HelloHQClient) {
  server.tool(
    "list_reportings",
    "List user reportings (time entries) with optional filtering. Reportings track time spent on tasks.",
    {
      filter: z.string().optional().describe("OData filter expression, e.g. \"userId eq 5\" or \"projectId eq 100\""),
      top: z.number().optional().describe("Maximum number of results (default: 50, max: 1000)"),
      skip: z.number().optional().describe("Number of results to skip for pagination"),
      orderby: z.string().optional().describe("OData orderby expression, e.g. \"startOn desc\""),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"project,task,user\""),
    },
    async ({ filter, top, skip, orderby, expand }) => {
      const result = await client.listReportings({ filter, top: top ?? 50, skip, orderby, expand });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_reporting",
    "Get a single reporting entry by ID",
    {
      id: z.number().describe("Reporting ID"),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"project,task,user\""),
    },
    async ({ id, expand }) => {
      const result = await client.getReporting(id, expand ?? "project,task,user");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_reporting",
    "Create a new reporting entry (time tracking record)",
    {
      name: z.string().describe("Description of the work done"),
      startOn: z.string().describe("Start time (ISO 8601, e.g. \"2025-01-15T09:00:00\")"),
      endOn: z.string().describe("End time (ISO 8601, e.g. \"2025-01-15T10:30:00\")"),
      taskId: z.number().describe("Task ID to report time against"),
      userId: z.number().describe("User ID of the person reporting"),
      breakDuration: z.number().optional().describe("Break duration in hours"),
      isApproved: z.boolean().optional().describe("Whether the reporting is approved"),
    },
    async ({ name, startOn, endOn, taskId, userId, breakDuration, isApproved }) => {
      const result = await client.createReporting({ name, startOn, endOn, taskId, userId, breakDuration, isApproved });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_reporting",
    "Update an existing reporting entry",
    {
      id: z.number().describe("Reporting ID"),
      name: z.string().optional().describe("Description of the work done"),
      startOn: z.string().optional().describe("Start time (ISO 8601)"),
      endOn: z.string().optional().describe("End time (ISO 8601)"),
      breakDuration: z.number().optional().describe("Break duration in hours"),
      isApproved: z.boolean().optional().describe("Whether the reporting is approved"),
    },
    async ({ id, ...data }) => {
      const result = await client.updateReporting(id, data);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_reporting",
    "Delete a reporting entry",
    {
      id: z.number().describe("Reporting ID to delete"),
    },
    async ({ id }) => {
      await client.deleteReporting(id);
      return { content: [{ type: "text", text: `Reporting ${id} deleted successfully.` }] };
    }
  );

  server.tool(
    "change_reporting_task",
    "Move a reporting entry to a different task",
    {
      id: z.number().describe("Reporting ID"),
      taskId: z.number().describe("New task ID"),
    },
    async ({ id, taskId }) => {
      const result = await client.changeReportingTask(id, taskId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
