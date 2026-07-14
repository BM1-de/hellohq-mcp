import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { HelloHQClient } from "../api-client.js";

export function registerPlannedRevenueTools(server: McpServer, client: HelloHQClient) {
  server.tool(
    "list_planned_revenues",
    "List planned revenues (Planumsätze) with optional filtering. Planned revenues are recurring or one-off revenue plans per company/project, from which invoices are generated. Each entry includes estimations (projected and already invoiced amounts per period).",
    {
      filter: z.string().optional().describe("OData filter expression, e.g. \"projectId eq 30\" or \"companyId eq 61309\""),
      top: z.number().optional().describe("Maximum number of results (default: 50, max: 1000)"),
      skip: z.number().optional().describe("Number of results to skip for pagination"),
      orderby: z.string().optional().describe("Orderby expression, e.g. \"id desc\" or \"startDate\""),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"Company,Project\" (also: Lead, Positions)"),
    },
    async ({ filter, top, skip, orderby, expand }) => {
      const result = await client.listPlannedRevenues({ filter, top: top ?? 50, skip, orderby, expand });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_planned_revenue",
    "Get a single planned revenue (Planumsatz) by ID, including its estimations",
    {
      id: z.number().describe("Planned revenue ID"),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"Company,Project,Positions\""),
    },
    async ({ id, expand }) => {
      const result = await client.getPlannedRevenue(id, expand);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_planned_revenue",
    "Create a new planned revenue (Planumsatz). Net/gross totals are calculated from positions added afterwards via create_free_text_position — pass the planned revenue id as documentEntityId and the Grid element id from orderedElements (see get_planned_revenue) as documentTableId.",
    {
      companyId: z.number().describe("Company ID (required)"),
      documentType: z.enum(["PlannedRevenueStandard", "PlannedRevenueTimeAndMaterial"]).describe("Type of planned revenue: Standard (fixed positions) or TimeAndMaterial (billed by reported time)"),
      description: z.string().optional().describe("Description of the planned revenue"),
      interval: z.enum(["Once", "Annually", "HalfAnnually", "QuarterAnnually", "Monthly", "Weekly", "TwoYears", "ThreeYears", "FourYears", "FiveYears", "Fortnightly", "BiMonthly"]).optional().describe("Invoicing interval"),
      startDate: z.string().optional().describe("Start date of invoicing (ISO 8601, e.g. \"2026-08-01T00:00:00\")"),
      endDate: z.string().optional().describe("Last date of invoicing (ISO 8601); omit for open-ended"),
      dueMonth: z.number().optional().describe("Month (1-12) in which invoices are due; for intervals longer than monthly"),
      dueDay: z.number().optional().describe("Day of the month on which invoices are due"),
      performancePeriod: z.enum(["DueDateMonth", "MonthBeforeDueDate", "DueDateYear", "YearBeforeDueDate"]).optional().describe("Performance period of generated invoices"),
      invoiceType: z.enum(["AdvancedInvoice", "Invoice", "FinalInvoice", "IncomingInvoice"]).optional().describe("Type of the documents generated from this plan"),
      invoiceDate: z.enum(["InvoiceCreation", "DueDate", "LastDayOfPerformancePeriod", "LastDayOfMonthBeforeDueDate"]).optional().describe("Date type used for generated invoices"),
      currency: z.string().optional().describe("Currency, e.g. \"EUR\""),
      marginPercent: z.number().optional().describe("Margin applied to this plan (e.g. 0.03 = 3%)"),
      discountPercent: z.number().optional().describe("Discount applied to this plan (e.g. 0.01 = 1%)"),
      leadId: z.number().optional().describe("Lead ID to associate"),
      projectId: z.number().optional().describe("Project ID to associate"),
    },
    async (params) => {
      const result = await client.createPlannedRevenue(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_planned_revenue",
    "Update an existing planned revenue (Planumsatz). IMPORTANT: like other helloHQ PUT endpoints this may reset fields that are not passed — read the record via get_planned_revenue first and pass all current values along with your changes. Estimations are recalculated automatically when value or date fields change.",
    {
      id: z.number().describe("Planned revenue ID"),
      companyId: z.number().optional().describe("Company ID"),
      description: z.string().optional().describe("Description of the planned revenue"),
      interval: z.enum(["Once", "Annually", "HalfAnnually", "QuarterAnnually", "Monthly", "Weekly", "TwoYears", "ThreeYears", "FourYears", "FiveYears", "Fortnightly", "BiMonthly"]).optional().describe("Invoicing interval"),
      startDate: z.string().optional().describe("Start date of invoicing (ISO 8601)"),
      endDate: z.string().optional().describe("Last date of invoicing (ISO 8601)"),
      dueMonth: z.number().optional().describe("Month (1-12) in which invoices are due; for intervals longer than monthly"),
      dueDay: z.number().optional().describe("Day of the month on which invoices are due"),
      performancePeriod: z.enum(["DueDateMonth", "MonthBeforeDueDate", "DueDateYear", "YearBeforeDueDate"]).optional().describe("Performance period of generated invoices"),
      invoiceType: z.enum(["AdvancedInvoice", "Invoice", "FinalInvoice", "IncomingInvoice"]).optional().describe("Type of the documents generated from this plan"),
      invoiceDate: z.enum(["InvoiceCreation", "DueDate", "LastDayOfPerformancePeriod", "LastDayOfMonthBeforeDueDate"]).optional().describe("Date type used for generated invoices"),
      currency: z.string().optional().describe("Currency, e.g. \"EUR\""),
      marginPercent: z.number().optional().describe("Margin applied to this plan (e.g. 0.03 = 3%)"),
      discountPercent: z.number().optional().describe("Discount applied to this plan (e.g. 0.01 = 1%)"),
      leadId: z.number().optional().describe("Lead ID to associate"),
      projectId: z.number().optional().describe("Project ID to associate"),
    },
    async ({ id, ...data }) => {
      const result = await client.updatePlannedRevenue(id, data);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_planned_revenue",
    "Delete a planned revenue (Planumsatz)",
    {
      id: z.number().describe("Planned revenue ID to delete"),
    },
    async ({ id }) => {
      await client.deletePlannedRevenue(id);
      return { content: [{ type: "text", text: `Planned revenue ${id} deleted successfully.` }] };
    }
  );

  server.tool(
    "change_planned_revenue_status",
    "Change the status of a planned revenue (Planumsatz)",
    {
      id: z.number().describe("Planned revenue ID"),
      status: z.enum(["Quoted", "Planned", "Billed", "Deferred", "Declined"]).describe("New status"),
    },
    async ({ id, status }) => {
      await client.changePlannedRevenueStatus(id, status);
      return { content: [{ type: "text", text: `Planned revenue ${id} status changed to ${status}.` }] };
    }
  );
}
