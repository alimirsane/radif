import { createInstanceCreator, ServiceBase } from "@api/service";
import { ExperimentType } from "@api/service/experiment/type";

class ApiExperiment extends ServiceBase {
  override getAll<RES = ExperimentType>(params?: {}) {
    return super.getAll<RES>({ params });
  }
  override getById<RES = ExperimentType>(experimentId: string) {
    return super.getById<RES>(experimentId);
  }
  getByIdPublic<RES = ExperimentType>(experimentId: string) {
    return super.getById<RES>(experimentId, {
      url: this.url + experimentId + "/pub/",
    });
  }
  override create<
    RES = ExperimentType,
    REQ = Omit<ExperimentType, "id" | "device" | "lab_name" | "form_obj">,
  >() {
    return super.create<RES, REQ>();
  }

  update<
    RES = ExperimentType,
    REQ = Omit<
      ExperimentType,
      "id" | "device" | "lab_name" | "form" | "form_obj"
    >,
  >(itemId: string | undefined) {
    return super.updateAll<RES, REQ>({ url: this.url + itemId + "/" });
  }

  override delete<RES = ExperimentType>(experimentId: string) {
    return super.delete<RES>(experimentId);
  }
}

export const apiExperiment = createInstanceCreator(
  "/labs/experiments/",
  ApiExperiment,
);
