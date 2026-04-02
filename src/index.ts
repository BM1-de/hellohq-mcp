#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HelloHQClient } from "./api-client.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerDocumentTools } from "./tools/documents.js";
import { registerReportingTools } from "./tools/reportings.js";
import { registerWorkingTimeTools } from "./tools/working-times.js";
import { registerUserTools } from "./tools/users.js";

const token = process.env.HELLOHQ_API_TOKEN;
if (!token) {
  console.error("Error: HELLOHQ_API_TOKEN environment variable is required.");
  console.error("Generate a token in helloHQ: Admin → Settings → API");
  process.exit(1);
}

const baseUrl = process.env.HELLOHQ_API_URL;
const client = new HelloHQClient(token, baseUrl);

const server = new McpServer({
  name: "hellohq",
  version: "1.0.0",
  description: "MCP Server for helloHQ project management & ERP",
});

registerProjectTools(server, client);
registerTaskTools(server, client);
registerDocumentTools(server, client);
registerReportingTools(server, client);
registerWorkingTimeTools(server, client);
registerUserTools(server, client);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
