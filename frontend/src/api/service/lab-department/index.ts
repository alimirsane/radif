import { createInstanceCreator, ServiceBase } from "@api/service";
import { LabDepartmentType } from "./type";

class ApiLabDepartment extends ServiceBase {
  override getAll<RES = LabDepartmentType>() {
    return super.getAll<RES>();
  }

  override getById<RES = LabDepartmentType>(departmentId: string) {
    return super.getById<RES>(departmentId);
  }

  override create<
    RES = LabDepartmentType,
    REQ = Omit<LabDepartmentType, "id">,
  >() {
    return super.create<RES, REQ>();
  }
}

export const apiLabDepartment = createInstanceCreator(
  "/labs/department/",
  ApiLabDepartment,
);
