import { createInstanceCreator, ServiceBase } from "@api/service";
import { ResultType } from "./type";

class ApiResult extends ServiceBase {
  override getAll<RES = ResultType>(params?: {}) {
    return super.getAll<RES>({ params });
  }

  override getById<RES = ResultType>(roleId: string) {
    return super.getById<RES>(roleId);
  }

  override create<RES = ResultType, REQ = ResultType>() {
    return super.create<RES, REQ>({ formData: true });
  }
  update<RES = ResultType, REQ = ResultType>(requestId: number) {
    return super.updateAll<RES, REQ>({
      formData: true,
      url: this.url + requestId + "/",
    });
  }
}

export const apiResult = createInstanceCreator("/labs/results/", ApiResult);
