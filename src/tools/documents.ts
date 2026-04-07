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

  server.tool(
    "get_document_templates",
    "Get all available document templates",
    {},
    async () => {
      const result = await client.getDocumentTemplates();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_document",
    "Create a new document (invoice, quotation, credit note, etc.)",
    {
      documentType: z.string().describe("Document type, e.g. \"Quotation\", \"Invoice\", \"FinalInvoice\", \"AdvanceInvoice\", \"CreditNote\", \"DeliveryNote\""),
      companyId: z.number().describe("Customer/company ID"),
      projectId: z.number().optional().describe("Project ID"),
      leadId: z.number().optional().describe("Lead ID (alternative to projectId)"),
      contactPersonId: z.number().optional().describe("Contact person ID at the company"),
      date: z.string().optional().describe("Document date (ISO 8601)"),
      validUntilDate: z.string().optional().describe("Valid until date (ISO 8601)"),
      currency: z.string().optional().describe("Currency code, e.g. \"EUR\""),
      discountNet: z.number().optional().describe("Net discount amount"),
      discountPercent: z.number().optional().describe("Discount percentage"),
      performancePeriodStartDate: z.string().optional().describe("Performance period start (ISO 8601)"),
      performancePeriodEndDate: z.string().optional().describe("Performance period end (ISO 8601)"),
      paymentConditionId: z.number().optional().describe("Payment condition ID"),
      deliveryConditionId: z.number().optional().describe("Delivery condition ID"),
      internalContactPersonId: z.number().optional().describe("Internal user ID (employee responsible)"),
      documentTemplateEntityId: z.number().optional().describe("Document template ID (use get_document_templates)"),
      financesBankAccountId: z.number().optional().describe("Bank account ID"),
      number: z.string().optional().describe("Custom document number (auto-generated if omitted)"),
    },
    async (params) => {
      const result = await client.createDocument(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_document",
    "Update an existing document",
    {
      id: z.number().describe("Document ID"),
      companyId: z.number().optional().describe("Customer/company ID"),
      projectId: z.number().optional().describe("Project ID"),
      contactPersonId: z.number().optional().describe("Contact person ID"),
      date: z.string().optional().describe("Document date (ISO 8601)"),
      validUntilDate: z.string().optional().describe("Valid until date (ISO 8601)"),
      note: z.string().optional().describe("Internal note"),
      currency: z.string().optional().describe("Currency code"),
      taxOption: z.string().optional().describe("Tax option, e.g. \"VatApplicable\""),
      serviceType: z.string().optional().describe("Service type, e.g. \"Service\""),
      discountNet: z.number().optional().describe("Net discount amount"),
      discountPercent: z.number().optional().describe("Discount percentage"),
      performancePeriodStartDate: z.string().optional().describe("Performance period start"),
      performancePeriodEndDate: z.string().optional().describe("Performance period end"),
      paymentConditionId: z.number().optional().describe("Payment condition ID"),
      deliveryConditionId: z.number().optional().describe("Delivery condition ID"),
      internalContactPersonId: z.number().optional().describe("Internal user ID"),
      number: z.string().optional().describe("Document number"),
    },
    async ({ id, ...data }) => {
      const result = await client.updateDocument(id, data);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_document",
    "Delete a document",
    { id: z.number().describe("Document ID") },
    async ({ id }) => {
      await client.deleteDocument(id);
      return { content: [{ type: "text", text: `Document ${id} deleted successfully.` }] };
    }
  );

  server.tool(
    "change_document_status",
    "Change the status of a document (e.g. mark as sent, paid, cancelled)",
    {
      id: z.number().describe("Document ID"),
      documentStatusId: z.number().describe("New status ID (use get_document_statuses)"),
    },
    async ({ id, documentStatusId }) => {
      const result = await client.changeDocumentStatus(id, documentStatusId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "change_document_template",
    "Change the template of a document",
    {
      id: z.number().describe("Document ID"),
      documentTemplateId: z.number().describe("New template ID (use get_document_templates)"),
      replaceOrderedElementsFromTemplate: z.boolean().optional().describe("Replace existing elements with template defaults"),
    },
    async ({ id, documentTemplateId, replaceOrderedElementsFromTemplate }) => {
      const result = await client.changeDocumentTemplate(id, documentTemplateId, replaceOrderedElementsFromTemplate);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "copy_document",
    "Create a copy of an existing document",
    { id: z.number().describe("Document ID to copy") },
    async ({ id }) => {
      const result = await client.copyDocument(id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_document_from_document",
    "Create a new document of a different type from an existing one (e.g. invoice from quotation)",
    {
      id: z.number().describe("Source document ID"),
      documentType: z.string().describe("Target document type, e.g. \"Invoice\", \"FinalInvoice\", \"AdvanceInvoice\""),
    },
    async ({ id, documentType }) => {
      const result = await client.createDocumentFromDocument(id, documentType);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "add_document_payment",
    "Add a payment to a document",
    {
      id: z.number().describe("Document ID"),
      paymentDate: z.string().describe("Payment date (ISO 8601)"),
      amount: z.number().describe("Payment amount"),
      typeOfPayment: z.string().optional().describe("Payment type"),
    },
    async ({ id, paymentDate, amount, typeOfPayment }) => {
      const result = await client.addDocumentPayment(id, { paymentDate, amount, typeOfPayment });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "add_document_comment",
    "Add a comment to a document",
    {
      id: z.number().describe("Document ID"),
      message: z.string().describe("Comment message"),
    },
    async ({ id, message }) => {
      const result = await client.addDocumentComment(id, message);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Document Positions ──

  server.tool(
    "create_free_text_position",
    "Add a free text position (custom line item) to a document",
    {
      documentEntityId: z.number().describe("Document ID"),
      text: z.string().optional().describe("Position text/description"),
      amount1: z.number().optional().describe("Quantity"),
      unitId1: z.number().optional().describe("Unit ID for amount1"),
      amount2: z.number().optional().describe("Secondary quantity"),
      unitId2: z.number().optional().describe("Unit ID for amount2"),
      price: z.number().optional().describe("Unit price (net)"),
      cost: z.number().optional().describe("Unit cost"),
      tax: z.number().optional().describe("Tax rate (e.g. 19 for 19%)"),
      discountNet: z.number().optional().describe("Net discount"),
      discountPercent: z.number().optional().describe("Discount percentage"),
      isOptional: z.boolean().optional().describe("Mark as optional position"),
      isExternal: z.boolean().optional().describe("Mark as external cost"),
      documentTableId: z.string().optional().describe("Table UUID if adding to a specific table"),
    },
    async (params) => {
      const result = await client.createFreeTextPosition(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_service_position",
    "Add a position from an existing service price to a document",
    {
      documentEntityId: z.number().describe("Document ID"),
      servicePriceId: z.number().describe("Service price ID"),
      documentTableId: z.string().optional().describe("Table UUID"),
    },
    async (params) => {
      const result = await client.createServicePosition(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_service_set_position",
    "Add positions from a service set to a document",
    {
      documentEntityId: z.number().describe("Document ID"),
      serviceSetId: z.number().describe("Service set ID"),
      documentTableId: z.string().optional().describe("Table UUID"),
    },
    async (params) => {
      const result = await client.createServiceSetPosition(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_text_position",
    "Add a text-only position to a document",
    {
      documentEntityId: z.number().describe("Document ID"),
      text: z.string().optional().describe("Custom text"),
      textFieldId: z.number().optional().describe("Predefined text field ID"),
      documentTableId: z.string().optional().describe("Table UUID"),
    },
    async (params) => {
      const result = await client.createTextPosition(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_document_position",
    "Update an existing document position",
    {
      id: z.number().describe("Position ID"),
      text: z.string().optional().describe("Position text"),
      amount1: z.number().optional().describe("Quantity"),
      unitId1: z.number().optional().describe("Unit ID"),
      amount2: z.number().optional().describe("Secondary quantity"),
      unitId2: z.number().optional().describe("Unit ID"),
      price: z.number().optional().describe("Unit price"),
      cost: z.number().optional().describe("Unit cost"),
      tax: z.number().optional().describe("Tax rate"),
      discountNet: z.number().optional().describe("Net discount"),
      discountPercent: z.number().optional().describe("Discount percentage"),
      isOptional: z.boolean().optional().describe("Optional position"),
      isExternal: z.boolean().optional().describe("External cost"),
    },
    async ({ id, ...data }) => {
      const result = await client.updateDocumentPosition(id, data);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_document_position",
    "Delete a document position",
    { id: z.number().describe("Position ID") },
    async ({ id }) => {
      await client.deleteDocumentPosition(id);
      return { content: [{ type: "text", text: `Position ${id} deleted successfully.` }] };
    }
  );

  // ── Document Elements ──

  server.tool(
    "create_document_text_element",
    "Add a text element (text block) to a document",
    {
      documentId: z.number().describe("Document ID"),
      index: z.number().describe("Position index in the document"),
      text: z.string().describe("Text content (HTML supported)"),
    },
    async ({ documentId, index, text }) => {
      const result = await client.createDocumentTextElement(documentId, index, text);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_document_text_element",
    "Update a text element in a document",
    {
      documentId: z.number().describe("Document ID"),
      elementId: z.string().describe("Element UUID"),
      text: z.string().describe("New text content"),
      index: z.number().optional().describe("New position index"),
    },
    async ({ documentId, elementId, text, index }) => {
      const result = await client.updateDocumentTextElement(documentId, elementId, text, index);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_document_page_break",
    "Add a page break element to a document",
    {
      documentId: z.number().describe("Document ID"),
      index: z.number().describe("Position index in the document"),
    },
    async ({ documentId, index }) => {
      const result = await client.createDocumentPageBreak(documentId, index);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_document_table",
    "Add a table element to a document (positions go inside this table)",
    {
      documentId: z.number().describe("Document ID"),
      index: z.number().describe("Position index in the document"),
      text: z.string().optional().describe("Table title/text"),
    },
    async ({ documentId, index, text }) => {
      const result = await client.createDocumentTable(documentId, index, text);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_document_element",
    "Delete a document element",
    {
      documentId: z.number().describe("Document ID"),
      elementId: z.string().describe("Element UUID"),
    },
    async ({ documentId, elementId }) => {
      await client.deleteDocumentElement(documentId, elementId);
      return { content: [{ type: "text", text: `Element ${elementId} deleted successfully.` }] };
    }
  );
}
