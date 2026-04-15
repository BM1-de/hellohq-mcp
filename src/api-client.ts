const BASE_URL = "https://api.hellohq.io/v2";

interface RequestOptions {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

export class HelloHQClient {
  private token: string;
  private baseUrl: string;

  constructor(token: string, baseUrl?: string) {
    this.token = token;
    this.baseUrl = baseUrl ?? BASE_URL;
  }

  async request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, params } = options;

    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
    };

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HelloHQ API error ${response.status}: ${text}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  // --- Projects ---

  async listProjects(options?: { filter?: string; top?: number; skip?: number; expand?: string; orderby?: string }) {
    return this.request("/Projects", { params: { $filter: options?.filter, $top: options?.top, $skip: options?.skip, $expand: options?.expand, $orderby: options?.orderby } });
  }

  async getProject(id: number, expand?: string) {
    return this.request(`/Projects/${id}`, { params: { $expand: expand } });
  }

  async createProject(project: {
    name: string;
    number?: string;
    startDate?: string;
    projectTemplateId?: number;
    companyId?: number;
    projectStatusId?: number;
    initialContactDate?: string;
    plannedFinishDate?: string;
    internalContactPersonId?: number;
    financesCostCenterId?: number;
    customFields?: Array<{ filterName: string; name: string; type: string; value: unknown }>;
  }) {
    return this.request("/Projects", { method: "POST", body: project });
  }

  async updateProject(id: number, project: {
    name: string;
    number: string;
    startDate: string;
    projectTemplateId?: number;
    companyId?: number;
    projectStatusId?: number;
    plannedFinishDate?: string;
    internalContactPersonId?: number;
    financesCostCenterId?: number;
    customFields?: Array<{ filterName: string; name: string; type: string; value: unknown }>;
  }) {
    return this.request(`/Projects/${id}`, { method: "PUT", body: project });
  }

  async deleteProject(id: number) {
    return this.request(`/Projects/${id}`, { method: "DELETE" });
  }

  async getProjectMembers(projectId: number) {
    return this.request(`/Projects/${projectId}/ProjectMembers`);
  }

  async getProjectTasks(projectId: number, options?: { filter?: string; top?: number; skip?: number; expand?: string; orderby?: string }) {
    return this.request(`/Projects/${projectId}/Tasks`, { params: { $filter: options?.filter, $top: options?.top, $skip: options?.skip, $expand: options?.expand, $orderby: options?.orderby } });
  }

  async getProjectTaskStatuses(projectId: number) {
    return this.request(`/Projects/${projectId}/TaskStatus`);
  }

  async getProjectStatuses() {
    return this.request("/ProjectStatus");
  }

  // --- Tasks ---

  async listTasks(options?: { filter?: string; top?: number; skip?: number; expand?: string; orderby?: string }) {
    return this.request("/Projects/Tasks", { params: { $filter: options?.filter, $top: options?.top, $skip: options?.skip, $expand: options?.expand, $orderby: options?.orderby } });
  }

  async createTask(projectId: number, task: { name: string; description?: string; startOn?: string; endOn?: string; plannedEffort?: number; taskTypeId?: number; phaseId?: number; parentId?: number; taskTypeStatusId?: number }) {
    return this.request(`/Projects/${projectId}/Tasks`, { method: "POST", body: task });
  }

  async updateTask(projectId: number, taskId: number, task: { name?: string; description?: string; startOn?: string; endOn?: string; plannedEffort?: number; taskTypeId?: number; phaseId?: number; parentId?: number; taskTypeStatusId?: number }) {
    return this.request(`/Projects/${projectId}/Tasks/${taskId}`, { method: "PUT", body: task });
  }

  async setTaskStatus(projectId: number, taskId: number, statusId: number) {
    return this.request(`/Projects/${projectId}/Tasks/${taskId}/SetStatus`, { method: "POST", body: { statusId } });
  }

  async markTaskDone(projectId: number, taskId: number) {
    return this.request(`/Projects/${projectId}/Tasks/${taskId}/Done`, { method: "POST" });
  }

  async markTaskOpen(projectId: number, taskId: number) {
    return this.request(`/Projects/${projectId}/Tasks/${taskId}/Open`, { method: "POST" });
  }

  // --- Documents ---

  async listDocuments(options?: { filter?: string; top?: number; skip?: number; expand?: string; orderby?: string }) {
    return this.request("/Documents", { params: { $filter: options?.filter, $top: options?.top, $skip: options?.skip, $expand: options?.expand, $orderby: options?.orderby } });
  }

  async getDocument(id: number, expand?: string) {
    return this.request(`/Documents/${id}`, { params: { $expand: expand } });
  }

  async getDocumentPositions(documentId: number) {
    return this.request(`/Documents/${documentId}/DocumentPositions`);
  }

  async getDocumentElements(documentId: number) {
    return this.request(`/Documents/${documentId}/DocumentElements`);
  }

  async getDocumentComments(documentId: number) {
    return this.request(`/Documents/${documentId}/Comments`);
  }

  async getDocumentStatuses() {
    return this.request("/DocumentStatus");
  }

  async createDocument(document: {
    documentType: string;
    companyId: number;
    projectId?: number;
    leadId?: number;
    contactPersonId?: number;
    date?: string;
    validUntilDate?: string;
    currency?: string;
    discountNet?: number;
    discountPercent?: number;
    marginNet?: number;
    marginPercent?: number;
    performancePeriodStartDate?: string;
    performancePeriodEndDate?: string;
    deliveryConditionId?: number;
    paymentConditionId?: number;
    companyPurchaseOrderNumberId?: number;
    financesBankAccountId?: number;
    internalContactPersonId?: number;
    documentTemplateEntityId?: number;
    number?: string;
  }) {
    return this.request("/Documents", { method: "POST", body: document });
  }

  async updateDocument(id: number, document: {
    documentType?: string;
    companyId?: number;
    projectId?: number;
    leadId?: number;
    contactPersonId?: number;
    date?: string;
    validUntilDate?: string;
    note?: string;
    currency?: string;
    taxOption?: string;
    serviceType?: string;
    discountNet?: number;
    discountPercent?: number;
    marginNet?: number;
    marginPercent?: number;
    performancePeriodStartDate?: string;
    performancePeriodEndDate?: string;
    deliveryConditionId?: number;
    paymentConditionId?: number;
    companyPurchaseOrderNumberId?: number;
    financesBankAccountId?: number;
    internalContactPersonId?: number;
    number?: string;
  }) {
    return this.request(`/Documents/${id}`, { method: "PUT", body: document });
  }

  async deleteDocument(id: number) {
    return this.request(`/Documents/${id}`, { method: "DELETE" });
  }

  async changeDocumentStatus(id: number, documentStatusId: number, paymentDtos?: Array<{ paymentDate: string; amount: number; typeOfPayment?: string }>) {
    return this.request(`/Documents/${id}/ChangeStatus`, { method: "POST", body: { documentStatusId, paymentDtos: paymentDtos ?? [] } });
  }

  async changeDocumentTemplate(id: number, documentTemplateId: number, replaceOrderedElementsFromTemplate?: boolean) {
    return this.request(`/Documents/${id}/ChangeTemplate`, { method: "POST", body: { documentTemplateId, replaceOrderedElementsFromTemplate } });
  }

  async copyDocument(id: number) {
    return this.request(`/Documents/${id}/Copy`, { method: "POST" });
  }

  async createDocumentFromDocument(id: number, documentType: string) {
    return this.request(`/Documents/${id}/CreateFromDocument`, { method: "POST", body: { documentType } });
  }

  async setDocumentCompanyData(id: number) {
    return this.request(`/Documents/${id}/SetCompanyData`, { method: "POST" });
  }

  async addDocumentPayment(id: number, payment: { paymentDate: string; amount: number; typeOfPayment?: string }) {
    return this.request(`/Documents/${id}/Payments`, { method: "POST", body: payment });
  }

  async addDocumentComment(id: number, message: string) {
    return this.request(`/Documents/${id}/Comments`, { method: "POST", body: { message } });
  }

  async deleteDocumentComment(documentId: number, commentId: number) {
    return this.request(`/Documents/${documentId}/Comments/${commentId}`, { method: "DELETE" });
  }

  async getDocumentTemplates() {
    return this.request("/DocumentTemplates");
  }

  // --- Document Positions ---

  async createFreeTextPosition(position: {
    documentEntityId: number;
    text?: string;
    amount1?: number;
    unitId1?: number;
    amount2?: number;
    unitId2?: number;
    price?: number;
    cost?: number;
    tax?: number;
    discountNet?: number;
    discountPercent?: number;
    marginNet?: number;
    marginPercent?: number;
    isOptional?: boolean;
    isExternal?: boolean;
    isFactorizable?: boolean;
    documentTableId?: string;
    projectId?: number;
    taskTypeId?: number;
  }) {
    return this.request("/DocumentPositions/FreeTextPosition", { method: "POST", body: position });
  }

  async createServicePosition(position: { documentEntityId: number; servicePriceId: number; documentTableId?: string }) {
    return this.request("/DocumentPositions/ServicePosition", { method: "POST", body: position });
  }

  async createServiceSetPosition(position: { documentEntityId: number; serviceSetId: number; documentTableId?: string }) {
    return this.request("/DocumentPositions/ServiceSet", { method: "POST", body: position });
  }

  async createTextPosition(position: { documentEntityId: number; text?: string; textFieldId?: number; amount1?: number; amount2?: number; tax?: number; documentTableId?: string }) {
    return this.request("/DocumentPositions/TextPosition", { method: "POST", body: position });
  }

  async createPageBreakPosition(position: { documentEntityId: number; text?: string; amount1?: number; amount2?: number; tax?: number; documentTableId?: string }) {
    return this.request("/DocumentPositions/PageBreakPosition", { method: "POST", body: position });
  }

  async updateDocumentPosition(id: number, position: {
    text?: string;
    amount1?: number;
    unitId1?: number;
    amount2?: number;
    unitId2?: number;
    price?: number;
    cost?: number;
    tax?: number;
    discountNet?: number;
    discountPercent?: number;
    marginNet?: number;
    marginPercent?: number;
    isOptional?: boolean;
    isExternal?: boolean;
  }) {
    return this.request(`/DocumentPositions/${id}`, { method: "PUT", body: position });
  }

  async updateTextPosition(id: number, text: string) {
    return this.request(`/DocumentPositions/TextPosition/${id}`, { method: "PUT", body: { text } });
  }

  async deleteDocumentPosition(id: number) {
    return this.request(`/DocumentPositions/${id}`, { method: "DELETE" });
  }

  // --- Document Elements ---

  async createDocumentTextElement(documentId: number, index: number, text: string) {
    return this.request(`/Documents/${documentId}/Text`, { method: "POST", body: { index, text } });
  }

  async updateDocumentTextElement(documentId: number, elementId: string, text: string, index?: number) {
    return this.request(`/Documents/${documentId}/Text/${elementId}`, { method: "PUT", body: { text, index } });
  }

  async createDocumentPageBreak(documentId: number, index: number) {
    return this.request(`/Documents/${documentId}/PageBreak`, { method: "POST", body: { index } });
  }

  async createDocumentTable(documentId: number, index: number, text?: string) {
    return this.request(`/Documents/${documentId}/Table`, { method: "POST", body: { index, text } });
  }

  async deleteDocumentElement(documentId: number, elementId: string) {
    return this.request(`/Documents/${documentId}/DocumentElements/${elementId}`, { method: "DELETE" });
  }

  // --- User Reportings ---

  async listReportings(options?: { filter?: string; top?: number; skip?: number; expand?: string; orderby?: string }) {
    return this.request("/UserReportings", { params: { $filter: options?.filter, $top: options?.top, $skip: options?.skip, $expand: options?.expand, $orderby: options?.orderby } });
  }

  async getReporting(id: number, expand?: string) {
    return this.request(`/UserReportings/${id}`, { params: { $expand: expand } });
  }

  async createReporting(reporting: { name: string; startOn: string; endOn: string; taskId: number; userId: number; breakDuration?: number; isApproved?: boolean }) {
    return this.request("/UserReportings", { method: "POST", body: reporting });
  }

  async updateReporting(id: number, reporting: { name?: string; startOn?: string; endOn?: string; breakDuration?: number; isApproved?: boolean }) {
    return this.request(`/UserReportings/${id}`, { method: "PUT", body: reporting });
  }

  async deleteReporting(id: number) {
    return this.request(`/UserReportings/${id}`, { method: "DELETE" });
  }

  async changeReportingTask(id: number, taskId: number) {
    return this.request(`/UserReportings/${id}/ChangeTask/${taskId}`, { method: "PUT" });
  }

  // --- Working Times ---

  async listWorkingTimes(options?: { filter?: string; top?: number; skip?: number; expand?: string; orderby?: string }) {
    return this.request("/WorkingTimes", { params: { $filter: options?.filter, $top: options?.top, $skip: options?.skip, $expand: options?.expand, $orderby: options?.orderby } });
  }

  async createWorkingTime(workingTime: { startOn: string; endOn: string; taskId: number; userId: number; isBreak?: boolean; reportingName?: string }) {
    return this.request("/WorkingTimes", { method: "POST", body: workingTime });
  }

  async getRunningWorkingTime() {
    return this.request("/WorkingTimes/Running");
  }

  async startWorkingTime(data: { taskId?: number; note?: string }) {
    return this.request("/WorkingTimes/Start", { method: "POST", body: data });
  }

  async stopWorkingTime() {
    return this.request("/WorkingTimes/Stop", { method: "POST" });
  }

  async updateRunningWorkingTime(data: { taskId?: number; note?: string }) {
    return this.request("/WorkingTimes/UpdateRunning", { method: "PUT", body: data });
  }

  // --- Users ---

  async listUsers(options?: { filter?: string; top?: number; skip?: number; expand?: string; orderby?: string }) {
    return this.request("/Users", { params: { $filter: options?.filter, $top: options?.top, $skip: options?.skip, $expand: options?.expand, $orderby: options?.orderby } });
  }

  async getUser(id: number, expand?: string) {
    return this.request(`/Users/${id}`, { params: { $expand: expand } });
  }

  // --- Companies ---

  async listCompanies(options?: { filter?: string; top?: number; skip?: number; expand?: string; orderby?: string }) {
    return this.request("/Companies", { params: { $filter: options?.filter, $top: options?.top, $skip: options?.skip, $expand: options?.expand, $orderby: options?.orderby } });
  }

  async getCompany(id: number, expand?: string) {
    return this.request(`/Companies/${id}`, { params: { $expand: expand } });
  }

  async createCompany(company: {
    name: string;
    defaultAddress: {
      description: string;
      street?: string;
      houseNumber?: string;
      zipCode?: string;
      city?: string;
      country?: string;
      phone?: string;
      fax?: string;
      email?: string;
      website?: string;
      addressLine2?: string;
      alternativeCompanyName?: string;
      additionalInformation?: string;
    };
    description?: string;
    industrialSector?: string;
    vatId?: string;
    iban?: string;
    bic?: string;
    homepage?: string;
    debitorNumber?: string;
    creditorNumber?: string;
  }) {
    return this.request("/Companies", { method: "POST", body: company });
  }

  async updateCompany(id: number, company: {
    name?: string;
    description?: string;
    industrialSector?: string;
    vatId?: string;
    iban?: string;
    bic?: string;
    homepage?: string;
    debitorNumber?: string;
    creditorNumber?: string;
  }) {
    return this.request(`/Companies/${id}`, { method: "PUT", body: company });
  }

  async deleteCompany(id: number) {
    return this.request(`/Companies/${id}`, { method: "DELETE" });
  }

  // --- Contact Persons ---

  async listContactPersons(options?: { filter?: string; top?: number; skip?: number; expand?: string; orderby?: string }) {
    return this.request("/ContactPersons", { params: { $filter: options?.filter, $top: options?.top, $skip: options?.skip, $expand: options?.expand, $orderby: options?.orderby } });
  }

  async getContactPerson(id: number, expand?: string) {
    return this.request(`/ContactPersons/${id}`, { params: { $expand: expand } });
  }

  async createContactPerson(contactPerson: Record<string, unknown>) {
    return this.request("/ContactPersons", { method: "POST", body: contactPerson });
  }

  async updateContactPerson(id: number, contactPerson: Record<string, unknown>) {
    return this.request(`/ContactPersons/${id}`, { method: "PUT", body: contactPerson });
  }

  async deleteContactPerson(id: number) {
    return this.request(`/ContactPersons/${id}`, { method: "DELETE" });
  }
}
