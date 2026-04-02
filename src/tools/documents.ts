import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { HelloHQClient } from "../api-client.js";

export function registerDocumentTools(server: McpServer, client: HelloHQClient) {
  server.tool(
    "list_documents",
    "List documents (invoices, quotations, credit notes, etc.) with optional filtering",
    {
      filter: z.string().optional().describe("OData filter expression, e.g. \"documentType eq 'Invoice'\" or \"companyId eq 123\""),
      top: z.number().optional().describe("Maximum number of results (default: 50, max: 1000)"),
      skip: z.number().optional().describe("Number of results to skip for pagination"),
      orderby: z.string().optional().describe("OData orderby expression, e.g. \"date desc\""),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"company,project,documentStatusEntity\""),
    },
    async ({ filter, top, skip, orderby, expand }) => {
      const result = await client.listDocuments({ filter, top: top ?? 50, skip, orderby, expand });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_document",
    "Get a single document by ID with full details including positions and elements",
    {
      id: z.number().describe("Document ID"),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"company,project,positions,orderedElements,payments,attachments\""),
    },
    async ({ id, expand }) => {
      const result = await client.getDocument(id, expand ?? "company,project,positions,orderedElements,payments,attachments,documentStatusEntity,contactPerson");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_document_positions",
    "Get all positions (line items) of a document",
    {
      documentId: z.number().describe("Document ID"),
    },
    async ({ documentId }) => {
      const result = await client.getDocumentPositions(documentId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_document_elements",
    "Get all elements (text blocks, tables, page breaks) of a document",
    {
      documentId: z.number().describe("Document ID"),
    },
    async ({ documentId }) => {
      const result = await client.getDocumentElements(documentId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_document_comments",
    "Get all comments on a document",
    {
      documentId: z.number().describe("Document ID"),
    },
    async ({ documentId }) => {
      const result = await client.getDocumentComments(documentId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_document_statuses",
    "Get all available document statuses",
    {},
    async () => {
      const result = await client.getDocumentStatuses();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
