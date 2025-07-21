import { createInstanceCreator, ServiceBase } from "@api/service";
import { DepartmentType } from "@api/service/department/type";

class ApiDepartment extends ServiceBase {
  override getAll<RES = DepartmentType>() {
    return super.getAll<RES>();
  }

  override getById<RES = DepartmentType>(departmentId: string) {
    return super.getById<RES>(departmentId);
  }

  override create<RES = DepartmentType, REQ = Omit<DepartmentType, "id">>() {
    return super.create<RES, REQ>();
  }
}

export const apiDepartment = createInstanceCreator(
  "/accounts/department/",
  ApiDepartment,
);
