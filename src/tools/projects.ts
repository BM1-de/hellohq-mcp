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
    "create_project",
    "Create a new project in helloHQ. ProjectTemplateId values: 2002=Extern, 2003=Intern, 2006=Betreuung. ProjectStatusId values: 1=Läuft, 2=Anbahnung, 3=Abgeschlossen, 4=Nachbereitung, 5=Abgebrochen, 9=Abgerechnet, 10=Pausiert.",
    {
      name: z.string().describe("Project name"),
      number: z.string().optional().describe("Project number (may be auto-generated from template)"),
      startDate: z.string().optional().describe("Project start date (ISO 8601, e.g. '2026-01-15T00:00:00')"),
      projectTemplateId: z.number().optional().describe("Project template ID: 2002=Extern, 2003=Intern, 2006=Betreuung"),
      companyId: z.number().optional().describe("Company ID to link the project to"),
      projectStatusId: z.number().optional().describe("Project status ID: 1=Läuft, 2=Anbahnung, 3=Abgeschlossen, 4=Nachbereitung, 5=Abgebrochen, 9=Abgerechnet, 10=Pausiert"),
      initialContactDate: z.string().optional().describe("Date of initial contact (ISO 8601)"),
      plannedFinishDate: z.string().optional().describe("Planned finish date (ISO 8601)"),
      internalContactPersonId: z.number().optional().describe("Internal contact person ID"),
      financesCostCenterId: z.number().optional().describe("Cost center ID"),
    },
    async (params) => {
      const result = await client.createProject(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_project",
    "Update an existing project. IMPORTANT: This is a full PUT — all fields not provided will be reset to defaults. Always include name, number, and startDate (required). Note: initialContactDate cannot be changed after creation.",
    {
      id: z.number().describe("Project ID to update"),
      name: z.string().describe("Project name"),
      number: z.string().describe("Project number (e.g. 'B-26-142')"),
      startDate: z.string().describe("Project start date (ISO 8601, required by API)"),
      projectTemplateId: z.number().optional().describe("Project template ID"),
      companyId: z.number().optional().describe("Company ID"),
      projectStatusId: z.number().optional().describe("Project status ID"),
      plannedFinishDate: z.string().optional().describe("Planned finish date (ISO 8601)"),
      internalContactPersonId: z.number().optional().describe("Internal contact person ID"),
      financesCostCenterId: z.number().optional().describe("Cost center ID"),
      customFields: z.array(z.object({
        filterName: z.string().describe("Field identifier, e.g. 'CustomFieldText1'"),
        name: z.string().describe("Display name, e.g. 'Informationen'"),
        type: z.string().describe("Field type, e.g. 'TextMultiline'"),
        value: z.unknown().describe("Field value"),
      })).optional().describe("Custom fields array"),
    },
    async ({ id, ...params }) => {
      const result = await client.updateProject(id, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_project",
    "Delete a project by ID. WARNING: This is irreversible!",
    {
      id: z.number().describe("Project ID to delete"),
    },
    async ({ id }) => {
      await client.deleteProject(id);
      return { content: [{ type: "text", text: `Project ${id} deleted successfully.` }] };
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
