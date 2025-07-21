import { createInstanceCreator, ServiceBase } from "@api/service";
import { GrantRequestType } from "./type";

class ApiGrantRequest extends ServiceBase {
  override getAll<RES = GrantRequestType>(params?: {}) {
    return super.getAll<RES>({ params });
  }

  getFileUrl<RES = GrantRequestType>(params?: {}) {
    return super.query<RES>({ params });
  }
  override getById<RES = GrantRequestType>(grantId: string) {
    return super.getById<RES>(grantId);
  }

  override create<
    RES = GrantRequestType,
    REQ = Omit<GrantRequestType, "id" | "sender_obj" | "receiver_obj">,
  >() {
    return super.create<RES, REQ>();
  }

  override delete<RES = GrantRequestType>(grantId: string) {
    return super.delete<RES>(grantId);
  }

  update<
    RES = GrantRequestType,
    REQ = Omit<GrantRequestType, "id" | "sender_obj" | "receiver_obj">,
  >(grantId: string | undefined) {
    return super.updateAll<RES, REQ>({
      url: this.url + grantId + "/",
    });
  }

  approveGrant<
    RES = GrantRequestType,
    REQ = Pick<GrantRequestType, "approved_amount" | "approved_grant_record">,
  >(grantId: string | undefined) {
    return super.updateAll<RES, REQ>({
      url: this.url + grantId + "/approved/",
    });
  }

  revokeGrant<RES = GrantRequestType, REQ = {}>(grantId: string | undefined) {
    return super.updateAll<RES, REQ>({
      url: this.url + grantId + "/revoke/",
    });
  }
}

export const apiGrantRequest = createInstanceCreator(
  "/accounts/grant-request/",
  ApiGrantRequest,
);
