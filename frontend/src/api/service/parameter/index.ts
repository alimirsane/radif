import { createInstanceCreator, ServiceBase } from "@api/service";
import { ParameterType } from "@api/service/parameter/type";

class ApiParameter extends ServiceBase {
  getAllByExperimentId<RES = ParameterType>(
    experiment: string | undefined,
    search?: string,
  ) {
    const params = {
      search: search,
      experiment: experiment,
    };
    if (!params?.search) delete params?.search;
    return super.getAll<RES>({ params: params, url: this.url + "pub/" });
  }

  getAllPublic<RES = ParameterType>(params?: {}) {
    return super.getAll<RES>({ params: params, url: this.url + "pub/" });
  }

  override getAll<RES = ParameterType>(params?: {}) {
    return super.getAll<RES>({ params });
  }
  override getById<RES = ParameterType>(parameterId: string) {
    return super.getById<RES>(parameterId);
  }

  override create<
    RES = ParameterType,
    REQ = Omit<ParameterType, "id" | "exp_name">,
  >() {
    return super.create<RES, REQ>();
  }
  override delete<RES = ParameterType>(parameterId: string) {
    return super.delete<RES>(parameterId);
  }
  update<RES = ParameterType, REQ = Omit<ParameterType, "id" | "exp_name">>(
    paramId: string,
  ) {
    return super.updateAll<RES, REQ>({ url: this.url + paramId + "/" });
  }
}

export const apiParameter = createInstanceCreator(
  "/labs/parameters/",
  ApiParameter,
);
