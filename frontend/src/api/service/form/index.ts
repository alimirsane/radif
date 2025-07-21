import { createInstanceCreator, ServiceBase } from "@api/service";
import { FormType } from "@api/service/form/type";

class ApiForm extends ServiceBase {
  override getAll<RES = FormType>(params?: {}) {
    return super.getAll<RES>({ params });
  }

  override getById<RES = FormType>(formId: string) {
    return super.getById<RES>(formId);
  }

  override create<
    RES = FormType,
    REQ = Omit<
      FormType,
      "id" | "created_at" | "updated_at" | "json_init" | "experiment_objs"
    > & {
      json_init: string;
    },
  >() {
    return super.create<RES, REQ>();
  }

  update<
    RES = FormType,
    REQ = Omit<
      FormType,
      "id" | "created_at" | "updated_at" | "json_init" | "experiment_objs"
    > & {
      json_init: string;
    },
  >(itemId: string | undefined) {
    return super.updateAll<RES, REQ>({ url: this.url + itemId + "/" });
  }

  override updateSome<
    RES = FormType,
    REQ = Omit<
      FormType,
      "id" | "created_at" | "updated_at" | "experiment_objs"
    >,
  >() {
    return super.updateSome<RES, REQ>();
  }

  override delete<RES = FormType>(formId: string) {
    return super.delete<RES>(formId);
  }
}

export const apiForm = createInstanceCreator("/form/forms/", ApiForm);
