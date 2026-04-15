import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { HelloHQClient } from "../api-client.js";

export function registerTaskTools(server: McpServer, client: HelloHQClient) {
  server.tool(
    "list_tasks",
    "List tasks across all projects with optional filtering",
    {
      filter: z.string().optional().describe("OData filter expression, e.g. \"isDone eq false\""),
      top: z.number().optional().describe("Maximum number of results (default: 50, max: 1000)"),
      skip: z.number().optional().describe("Number of results to skip for pagination"),
      orderby: z.string().optional().describe("OData orderby expression, e.g. \"startOn desc\""),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"project,taskType,resourceToTasks\""),
    },
    async ({ filter, top, skip, orderby, expand }) => {
      const result = await client.listTasks({ filter, top: top ?? 50, skip, orderby, expand });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_project_tasks",
    "Get all tasks for a specific project",
    {
      projectId: z.number().describe("Project ID"),
      filter: z.string().optional().describe("OData filter expression"),
      top: z.number().optional().describe("Maximum number of results"),
      skip: z.number().optional().describe("Number of results to skip"),
      orderby: z.string().optional().describe("OData orderby expression"),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"taskType,taskTypeStatus,resourceToTasks\""),
    },
    async ({ projectId, filter, top, skip, orderby, expand }) => {
      const result = await client.getProjectTasks(projectId, { filter, top: top ?? 100, skip, orderby, expand });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_task_statuses",
    "Get available task statuses for a project",
    {
      projectId: z.number().describe("Project ID"),
    },
    async ({ projectId }) => {
      const result = await client.getProjectTaskStatuses(projectId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_task",
    "Create a new task in a project",
    {
      projectId: z.number().describe("Project ID"),
      name: z.string().describe("Task name"),
      description: z.string().optional().describe("Task description"),
      startOn: z.string().optional().describe("Start date (ISO 8601)"),
      endOn: z.string().optional().describe("End date (ISO 8601)"),
      plannedEffort: z.number().optional().describe("Planned effort in hours"),
      taskTypeId: z.number().optional().describe("Task type ID"),
      taskTypeStatusId: z.number().optional().describe("Task type status ID"),
      phaseId: z.number().optional().describe("Phase ID"),
      parentId: z.number().optional().describe("Parent task ID for subtasks"),
    },
    async ({ projectId, ...task }) => {
      const result = await client.createTask(projectId, task);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_task",
    "Update an existing task",
    {
      projectId: z.number().describe("Project ID"),
      taskId: z.number().describe("Task ID"),
      name: z.string().optional().describe("Task name"),
      description: z.string().optional().describe("Task description"),
      startOn: z.string().optional().describe("Start date (ISO 8601)"),
      endOn: z.string().optional().describe("End date (ISO 8601)"),
      plannedEffort: z.number().optional().describe("Planned effort in hours"),
      taskTypeId: z.number().optional().describe("Task type ID"),
      taskTypeStatusId: z.number().optional().describe("Task type status ID"),
      phaseId: z.number().optional().describe("Phase ID"),
      parentId: z.number().optional().describe("Parent task ID"),
    },
    async ({ projectId, taskId, ...task }) => {
      const result = await client.updateTask(projectId, taskId, task);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "set_task_status",
    "Set the status of a task",
    {
      projectId: z.number().describe("Project ID"),
      taskId: z.number().describe("Task ID"),
      statusId: z.number().describe("Status ID (use get_task_statuses to find available statuses)"),
    },
    async ({ projectId, taskId, statusId }) => {
      const result = await client.setTaskStatus(projectId, taskId, statusId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "mark_task_done",
    "Mark a task as done",
    {
      projectId: z.number().describe("Project ID"),
      taskId: z.number().describe("Task ID"),
    },
    async ({ projectId, taskId }) => {
      const result = await client.markTaskDone(projectId, taskId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "mark_task_open",
    "Reopen a completed task",
    {
      projectId: z.number().describe("Project ID"),
      taskId: z.number().describe("Task ID"),
    },
    async ({ projectId, taskId }) => {
      const result = await client.markTaskOpen(projectId, taskId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
