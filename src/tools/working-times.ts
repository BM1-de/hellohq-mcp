import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { HelloHQClient } from "../api-client.js";

export function registerWorkingTimeTools(server: McpServer, client: HelloHQClient) {
  server.tool(
    "list_working_times",
    "List working time entries with optional filtering",
    {
      filter: z.string().optional().describe("OData filter expression, e.g. \"userId eq 5\""),
      top: z.number().optional().describe("Maximum number of results (default: 50, max: 1000)"),
      skip: z.number().optional().describe("Number of results to skip for pagination"),
      orderby: z.string().optional().describe("OData orderby expression, e.g. \"startOn desc\""),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"project,task,user\""),
    },
    async ({ filter, top, skip, orderby, expand }) => {
      const result = await client.listWorkingTimes({ filter, top: top ?? 50, skip, orderby, expand });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_working_time",
    "Create a completed working time entry",
    {
      startOn: z.string().describe("Start time (ISO 8601)"),
      endOn: z.string().describe("End time (ISO 8601)"),
      taskId: z.number().describe("Task ID"),
      userId: z.number().describe("User ID"),
      isBreak: z.boolean().optional().describe("Whether this is a break"),
      reportingName: z.string().optional().describe("Name for the auto-created reporting entry"),
    },
    async (data) => {
      const result = await client.createWorkingTime(data);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_running_working_time",
    "Get the currently running working time (active timer)",
    {},
    async () => {
      const result = await client.getRunningWorkingTime();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "start_working_time",
    "Start the working time timer",
    {
      taskId: z.number().optional().describe("Task ID to track time against"),
      note: z.string().optional().describe("Note for this working time entry"),
    },
    async ({ taskId, note }) => {
      const result = await client.startWorkingTime({ taskId, note });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "stop_working_time",
    "Stop the currently running working time timer",
    {},
    async () => {
      const result = await client.stopWorkingTime();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_running_working_time",
    "Update the currently running working time (change task or note)",
    {
      taskId: z.number().optional().describe("New task ID"),
      note: z.string().optional().describe("Updated note"),
    },
    async ({ taskId, note }) => {
      const result = await client.updateRunningWorkingTime({ taskId, note });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
