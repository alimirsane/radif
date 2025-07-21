import { createInstanceCreator, ServiceBase } from "@api/service";
import { EducationalFieldType } from "./type";

class ApiEducationalField extends ServiceBase {
  override getAll<RES = EducationalFieldType>() {
    return super.getAll<RES>()
  }
}

export const apiEducationalField = createInstanceCreator(
  "/accounts/educational-fields/",
  ApiEducationalField,
);
