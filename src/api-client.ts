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
}
