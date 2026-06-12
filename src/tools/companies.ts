import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { HelloHQClient } from "../api-client.js";

export function registerCompanyTools(server: McpServer, client: HelloHQClient) {
  server.tool(
    "list_companies",
    "List companies (customers, suppliers, partners) with optional filtering",
    {
      filter: z.string().optional().describe("OData filter expression, e.g. \"name eq 'Acme Corp'\""),
      top: z.number().optional().describe("Maximum number of results (default: 50, max: 1000)"),
      skip: z.number().optional().describe("Number of results to skip for pagination"),
      orderby: z.string().optional().describe("OData orderby expression"),
      expand: z.string().optional().describe("Related entities to expand"),
    },
    async ({ filter, top, skip, orderby, expand }) => {
      const result = await client.listCompanies({ filter, top: top ?? 50, skip, orderby, expand });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_company",
    "Get a single company by ID",
    {
      id: z.number().describe("Company ID"),
      expand: z.string().optional().describe("Related entities to expand"),
    },
    async ({ id, expand }) => {
      const result = await client.getCompany(id, expand);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_company",
    "Create a new company (customer, supplier, partner). Requires at least a name and a default address with a description.",
    {
      name: z.string().describe("Company name"),
      addressDescription: z.string().describe("Address label, e.g. 'Hauptadresse'"),
      street: z.string().optional().describe("Street name"),
      houseNumber: z.string().optional().describe("House number"),
      zipCode: z.string().optional().describe("ZIP / postal code"),
      city: z.string().optional().describe("City"),
      country: z.string().optional().describe("Country code, e.g. 'DE'"),
      phone: z.string().optional().describe("Phone number"),
      fax: z.string().optional().describe("Fax number"),
      email: z.string().optional().describe("Email address"),
      website: z.string().optional().describe("Website URL"),
      addressLine2: z.string().optional().describe("Additional address line"),
      description: z.string().optional().describe("Company description / note"),
      industrialSector: z.string().optional().describe("Industrial sector"),
      vatId: z.string().optional().describe("VAT ID (Umsatzsteuer-ID)"),
      iban: z.string().optional().describe("IBAN"),
      bic: z.string().optional().describe("BIC / SWIFT code"),
      homepage: z.string().optional().describe("Company homepage URL"),
      debitorNumber: z.string().optional().describe("Debitor number"),
      creditorNumber: z.string().optional().describe("Creditor number"),
    },
    async ({ name, addressDescription, street, houseNumber, zipCode, city, country, phone, fax, email, website, addressLine2, description, industrialSector, vatId, iban, bic, homepage, debitorNumber, creditorNumber }) => {
      const result = await client.createCompany({
        name,
        defaultAddress: {
          description: addressDescription,
          street,
          houseNumber,
          zipCode,
          city,
          country,
          phone,
          fax,
          email,
          website,
          addressLine2,
        },
        description,
        industrialSector,
        vatId,
        iban,
        bic,
        homepage,
        debitorNumber,
        creditorNumber,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_company",
    "Update an existing company",
    {
      id: z.number().describe("Company ID"),
      name: z.string().optional().describe("Company name"),
      description: z.string().optional().describe("Company description / note"),
      industrialSector: z.string().optional().describe("Industrial sector"),
      vatId: z.string().optional().describe("VAT ID (Umsatzsteuer-ID)"),
      iban: z.string().optional().describe("IBAN"),
      bic: z.string().optional().describe("BIC / SWIFT code"),
      homepage: z.string().optional().describe("Company homepage URL"),
      debitorNumber: z.string().optional().describe("Debitor number"),
      creditorNumber: z.string().optional().describe("Creditor number"),
    },
    async ({ id, ...updates }) => {
      const result = await client.updateCompany(id, updates);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_company",
    "Delete a company by ID",
    {
      id: z.number().describe("Company ID"),
    },
    async ({ id }) => {
      await client.deleteCompany(id);
      return { content: [{ type: "text", text: `Company ${id} deleted.` }] };
    }
  );

  // --- Contact Persons ---

  server.tool(
    "list_contact_persons",
    "List contact persons with optional filtering. Use filter \"companyId eq 123\" to list by company.",
    {
      filter: z.string().optional().describe("OData filter expression, e.g. \"companyId eq 61037\""),
      top: z.number().optional().describe("Maximum number of results (default: 50, max: 1000)"),
      skip: z.number().optional().describe("Number of results to skip for pagination"),
      orderby: z.string().optional().describe("OData orderby expression"),
      expand: z.string().optional().describe("Related entities to expand, e.g. \"company,defaultAddress\""),
    },
    async ({ filter, top, skip, orderby, expand }) => {
      const result = await client.listContactPersons({ filter, top: top ?? 50, skip, orderby, expand });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_contact_person",
    "Get a single contact person by ID",
    {
      id: z.number().describe("Contact person ID"),
      expand: z.string().optional().describe("Related entities to expand"),
    },
    async ({ id, expand }) => {
      const result = await client.getContactPerson(id, expand);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_contact_person",
    "Create a new contact person for a company. Requires companyId, lastName, salutation and salutationForm. Note: email is set via the contact's address, phone fields are set directly. Cannot combine email with phone fields in a single create — if both are needed, create first with email, then update to add phone.",
    {
      companyId: z.number().describe("Company ID"),
      lastName: z.string().describe("Last name"),
      salutation: z.string().describe("Salutation: 'Herr', 'Frau' or 'Divers'"),
      salutationForm: z.string().describe("Salutation form: 'Formal' or 'Informal'"),
      firstName: z.string().optional().describe("First name"),
      eMail: z.string().optional().describe("Email address (set via default address)"),
      phoneLandline: z.string().optional().describe("Landline phone number (direct field)"),
      phoneMobile: z.string().optional().describe("Mobile phone number (direct field)"),
      position: z.string().optional().describe("Job position / title"),
      language: z.string().optional().describe("Language code, e.g. 'de-DE'"),
      birthdate: z.string().optional().describe("Birthdate (ISO 8601)"),
      note: z.string().optional().describe("Internal note"),
    },
    async (params) => {
      const { eMail, phoneLandline, phoneMobile, ...rest } = params;
      const hasEmail = eMail !== undefined;
      const hasPhone = phoneLandline !== undefined || phoneMobile !== undefined;

      // Helper: build defaultAddress from company's address + email
      async function buildDefaultAddress(companyId: number, email: string) {
        const company = await client.getCompany(companyId, "defaultAddress") as Record<string, unknown>;
        const companyAddr = (company.defaultAddress ?? {}) as Record<string, unknown>;
        return {
          description: "Standard",
          email,
          street: companyAddr.street ?? "",
          houseNumber: companyAddr.houseNumber,
          zipCode: companyAddr.zipCode ?? "",
          city: companyAddr.city ?? "",
          country: companyAddr.country ?? "",
        };
      }

      let body: Record<string, unknown>;
      if (hasEmail && !hasPhone) {
        body = { ...rest, defaultAddress: await buildDefaultAddress(rest.companyId, eMail!) };
      } else if (!hasEmail && hasPhone) {
        body = { ...rest, phoneLandline, phoneMobile };
      } else if (hasEmail && hasPhone) {
        // Create with email first, then update to add phone fields
        const created = await client.createContactPerson({
          ...rest,
          defaultAddress: await buildDefaultAddress(rest.companyId, eMail!),
        }) as Record<string, unknown>;
        const createdId = created.id as number;
        const existing = await client.getContactPerson(createdId) as Record<string, unknown>;
        const merged: Record<string, unknown> = {
          companyId: existing.companyId,
          firstName: existing.firstName,
          lastName: existing.lastName,
          salutation: existing.salutation,
          salutationForm: existing.salutationForm,
          phoneLandline,
          phoneMobile,
          position: existing.position,
          language: existing.language,
          birthdate: existing.birthdate,
          note: existing.note,
        };
        const result = await client.updateContactPerson(createdId, merged);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } else {
        body = rest;
      }

      const result = await client.createContactPerson(body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_contact_person",
    "Update an existing contact person. Automatically fetches current data first to prevent overwriting existing fields (helloHQ API uses full PUT, not partial update).",
    {
      id: z.number().describe("Contact person ID"),
      lastName: z.string().optional().describe("Last name"),
      salutation: z.string().optional().describe("Salutation: 'Herr', 'Frau' or 'Divers'"),
      salutationForm: z.string().optional().describe("Salutation form: 'Formal' or 'Informal'"),
      firstName: z.string().optional().describe("First name"),
      eMail: z.string().optional().describe("Email address"),
      phoneLandline: z.string().optional().describe("Landline phone number"),
      phoneMobile: z.string().optional().describe("Mobile phone number"),
      position: z.string().optional().describe("Job position / title"),
      language: z.string().optional().describe("Language code, e.g. 'de-DE'"),
      birthdate: z.string().optional().describe("Birthdate (ISO 8601)"),
      note: z.string().optional().describe("Internal note"),
    },
    async (params) => {
      const { id, eMail, ...updates } = params;
      // Fetch current data to merge (PUT replaces all fields)
      const existing = await client.getContactPerson(id) as Record<string, unknown>;
      const merged: Record<string, unknown> = {
        companyId: existing.companyId,
        firstName: existing.firstName,
        lastName: existing.lastName,
        salutation: existing.salutation,
        salutationForm: existing.salutationForm,
        phoneLandline: existing.phoneLandline,
        phoneMobile: existing.phoneMobile,
        position: existing.position,
        language: existing.language,
        birthdate: existing.birthdate,
        note: existing.note,
      };
      // Apply only provided updates
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          merged[key] = value;
        }
      }

      // If email is being updated, set it via defaultAddress
      if (eMail !== undefined) {
        const existingAddr = await client.getContactPerson(id, "defaultAddress") as Record<string, unknown>;
        const addr = (existingAddr.defaultAddress ?? {}) as Record<string, unknown>;
        merged.defaultAddress = {
          description: addr.description ?? "Standard",
          email: eMail,
          street: addr.street,
          houseNumber: addr.houseNumber,
          zipCode: addr.zipCode,
          city: addr.city,
          country: addr.country,
          phone: addr.phone,
          fax: addr.fax,
          website: addr.website,
        };
      }

      const result = await client.updateContactPerson(id, merged);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_contact_person",
    "Delete a contact person",
    {
      id: z.number().describe("Contact person ID"),
    },
    async ({ id }) => {
      await client.deleteContactPerson(id);
      return { content: [{ type: "text", text: `Contact person ${id} deleted.` }] };
    }
  );
}