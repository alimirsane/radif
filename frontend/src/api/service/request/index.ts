import { createInstanceCreator, ServiceBase } from "@api/service";
import {
  CertificateObjType,
  CertificateParams,
  RequestType,
} from "@api/service/request/type";
import { RequestButtonAction } from "./type/request-status/request-button-action";

class ApiRequest extends ServiceBase {
  override getAll<RES = RequestType>(params?: {}) {
    return super.getAll<RES>({ params });
  }
  getAllList<RES = Array<RequestType>>(params?: {}) {
    return super.getAllPagination<RES>({ params });
  }
  getFileUrl<RES = RequestType>(params?: {}) {
    return super.query<RES>({ params });
  }
  getAllMine<RES = Array<RequestType>>(params?: {}) {
    return super.getAllPagination<RES>({ params, url: this.url + "owned/" });
  }

  override getById<RES = RequestType>(requestId: string | undefined) {
    return super.getById<RES>(requestId);
  }

  getCertificateById<RES = CertificateObjType>(requestId: string | undefined) {
    return super.query<RES>({
      url: this.url + requestId + "/certificate",
    });
  }

  updateCertificate<
    RES = CertificateObjType,
    REQ = Pick<
      CertificateParams,
      "temperature" | "humidity" | "pressure" | "uncertainty"
    >,
  >(requestId: number) {
    return super.updateSome<RES, REQ>({
      url: this.url + requestId + "/request-certificate/",
    });
  }

  override create<
    RES = RequestType,
    REQ = Omit<
      RequestType,
      | "id"
      | "created_at"
      | "updated_at"
      | "experiment_obj"
      | "parameter_obj"
      | "owner_obj"
      | "forms"
    >,
  >() {
    return super.create<RES, REQ>();
  }

  updateRequestStatus<
    RES = Omit<RequestButtonAction, "description" | "action" | "value">,
    REQ = RequestButtonAction,
  >(requestId: number) {
    return super.updateAll<RES, REQ>({
      url: this.url + requestId + "/status/",
    });
  }

  updateRequestParameters<
    RES = RequestType,
    REQ = Omit<
      RequestType,
      | "id"
      | "created_at"
      | "updated_at"
      | "experiment_obj"
      | "parameter_obj"
      | "owner_obj"
      | "forms"
    >,
  >(requestId: number) {
    return super.updateSome<RES, REQ>({
      url: this.url + requestId + "/",
    });
  }

  completeRequest<
    RES = RequestType,
    REQ = Pick<
      RequestType,
      "is_completed" | "has_parent_request" | "parent_request" | "test_duration"
    >,
  >(requestId: number) {
    return super.updateSome<RES, REQ>({
      url: this.url + requestId + "/",
    });
  }

  cancelByCustomer<RES = RequestType, REQ = Pick<RequestType, "is_cancelled">>(
    requestId: number,
  ) {
    return super.updateSome<RES, REQ>({
      url: this.url + requestId + "/",
    });
  }

  returnSample<
    RES = RequestType,
    REQ = Pick<RequestType, "is_sample_returned">,
  >(requestId: number) {
    return super.updateSome<RES, REQ>({
      url: this.url + requestId + "/",
    });
  }

  selectLabsnet<
    RES = RequestType,
    REQ = Pick<RequestType, "labsnet" | "labsnet_code1" | "labsnet_code2">,
  >(requestId: number) {
    return super.updateSome<RES, REQ>({
      url: this.url + requestId + "/",
    });
  }

  updateLabsnet<
    RES = RequestType,
    REQ = Pick<RequestType, "labsnet1_id" | "labsnet2_id">,
  >(requestId: number) {
    return super.updateSome<RES, REQ>({
      url: this.url + requestId + "/labsnet/",
    });
  }

  submitLabsnetDiscount<
    RES = RequestType,
    REQ = Pick<RequestType, "labsnet_discount" | "labsnet_description">,
  >(requestId: number) {
    return super.updateSome<RES, REQ>({
      url: this.url + requestId + "/",
    });
  }

  submitDiscount<
    RES = Omit<RequestButtonAction, "description" | "action" | "value">,
    REQ = RequestButtonAction,
  >(requestId: number) {
    return super.updateAll<RES, REQ>({
      url: this.url + requestId + "/status/",
    });
  }
  updateTestDuration<
    RES = RequestType,
    REQ = Pick<RequestType, "test_duration">,
  >(requestId: number) {
    return super.updateSome<RES, REQ>({
      url: this.url + requestId + "/",
    });
  }
}

export const apiRequest = createInstanceCreator("/labs/requests/", ApiRequest);
