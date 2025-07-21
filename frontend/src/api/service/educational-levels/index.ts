import { createInstanceCreator, ServiceBase } from "@api/service";
import { EducationalLevelType } from "./type";

class ApiEducationalLevel extends ServiceBase {
  override getAll<RES = EducationalLevelType>() {
    return super.getAll<RES>()
  }
}

export const apiEducationalLevel = createInstanceCreator(
  "/accounts/educational-level/",
  ApiEducationalLevel,
);
