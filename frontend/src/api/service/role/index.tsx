import { createInstanceCreator, ServiceBase } from "@api/service";
import { RoleType } from "./type";

class ApiRole extends ServiceBase {
  override getAll<RES = RoleType>(params?: {}) {
    return super.getAll<RES>({ params });
  }

  override getById<RES = RoleType>(roleId: string) {
    return super.getById<RES>(roleId);
  }

  override create<RES = RoleType, REQ = Omit<RoleType, "id">>() {
    return super.create<RES, REQ>({ formData: true });
  }
}

export const apiRole = createInstanceCreator(
  "/accounts/role/",
  ApiRole,
);
