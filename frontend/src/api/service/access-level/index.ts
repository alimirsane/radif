import { createInstanceCreator, ServiceBase } from "@api/service";
import { AccessLevelType } from "./type";

class ApiAccessLevel extends ServiceBase {
  override getAll<RES = AccessLevelType>(params?: {}) {
    return super.getAll<RES>({ params });
  }

  override getById<RES = AccessLevelType>(roleId: string) {
    return super.getById<RES>(roleId);
  }

  override create<RES = AccessLevelType, REQ = Omit<AccessLevelType, "id">>() {
    return super.create<RES, REQ>({ formData: true });
  }
}

export const apiAccessLevel = createInstanceCreator(
  "/accounts/access-level/",
  ApiAccessLevel,
);
