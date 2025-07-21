import { createInstanceCreator, ServiceBase } from "@api/service";
import {
  CreateLaboratoryType,
  EditLabType,
  LaboratoryType,
} from "@api/service/laboratory/type";

class ApiLaboratory extends ServiceBase {
  override getAll<RES = LaboratoryType>(params?: {}) {
    return super.getAll<RES>({ params });
  }

  override getById<RES = LaboratoryType>(laboratoryId: string) {
    return super.getById<RES>(laboratoryId);
  }

  override create<RES = LaboratoryType, REQ = CreateLaboratoryType>() {
    return super.create<RES, REQ>({ formData: true });
  }

  update<RES = LaboratoryType, REQ = EditLabType>(id: string | undefined) {
    return super.updateAll<RES, REQ>({
      url: this.url + id + "/",
      formData: true,
    });
  }

  getAllPublic<RES = LaboratoryType>(params?: {}) {
    return super.getAll<RES>({
      params,
      url: this.url + "pub/",
    });
  }
  getByIdPublic<RES = LaboratoryType>(laboratoryId: string) {
    return super.getById<RES>(laboratoryId, {
      url: this.url + laboratoryId + "/pub/",
    });
  }
}

export const apiLaboratory = createInstanceCreator(
  "/labs/laboratories/",
  ApiLaboratory,
);
