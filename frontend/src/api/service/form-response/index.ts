import { createInstanceCreator, ServiceBase } from "@api/service";
import { FormResponseType } from "./type";

class ApiFormResponse extends ServiceBase {
  override getAll<RES = FormResponseType>(params?: {}) {
    return super.getAll<RES>({ params });
  }

  override getById<RES = FormResponseType>(formResponseId: string) {
    return super.getById<RES>(formResponseId);
  }

  override create<
    RES = FormResponseType,
    REQ = Pick<
      FormResponseType,
      "response" | "response_json" | "request" | "is_main" | "response_count"
    >,
  >() {
    return super.create<RES, REQ>();
  }

  update<
    RES = FormResponseType,
    REQ = Pick<
      FormResponseType,
      "response" | "response_json" | "request" | "is_main" | "response_count"
    >,
  >(formResponseId: string) {
    return super.updateAll<RES, REQ>({ url: this.url + formResponseId + "/" });
  }

  override delete<RES = FormResponseType>(sampleId: string) {
    return super.delete<RES>(sampleId);
  }
  // override updateAll<
  //   RES = FormResponseType,
  //   REQ = Pick<FormResponseType, "id">,
  // >() {
  //   return super.updateAll<RES, REQ>();
  // }
}

export const apiFormResponse = createInstanceCreator(
  "/labs/form-responses/",
  ApiFormResponse,
);
