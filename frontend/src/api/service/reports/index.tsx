import { createInstanceCreator, ServiceBase } from "@api/service";
import { ReportType } from "./type";

class ApiReports extends ServiceBase {
  override getAll<RES = ReportType>(params?: {}) {
    return super.getAll<RES>({ params });
  }
  getFileUrl<RES = ReportType>(params?: {}) {
    return super.query<RES>({ params });
  }
}

export const apiReports = createInstanceCreator(
  "/reports/main_excel/",
  ApiReports,
);
