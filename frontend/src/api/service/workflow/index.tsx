import { createInstanceCreator, ServiceBase } from "@api/service";
import { WorkflowType } from "./type";

class ApiWorkflow extends ServiceBase {
  override getAll<RES = WorkflowType>(params?: {}) {
    return super.getAll<RES>({ params });
  }

  override getById<RES = WorkflowType>(workId: string) {
    return super.getById<RES>(workId);
  }

  override create<RES = WorkflowType, REQ = Omit<WorkflowType, "id">>() {
    return super.create<RES, REQ>();
  }
}

export const apiWorkflow = createInstanceCreator(
  "/labs/workflow/",
  ApiWorkflow,
);
