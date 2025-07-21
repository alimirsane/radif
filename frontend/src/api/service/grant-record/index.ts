import { createInstanceCreator, ServiceBase } from "@api/service";
import { GrantRecordType } from "./type";

class ApiGrantRecord extends ServiceBase {
  override getAll<RES = GrantRecordType>(params?: {}) {
    return super.getAll<RES>({ params });
  }

  override getById<RES = GrantRecordType>(grantId: string) {
    return super.getById<RES>(grantId);
  }

  override create<
    RES = GrantRecordType,
    REQ = Omit<GrantRecordType, "id" | "receiver_obj">,
  >() {
    return super.create<RES, REQ>();
  }

  createGroupList<
    RES = GrantRecordType,
    REQ = Pick<GrantRecordType, "file">,
  >() {
    return super.create<RES, REQ>({
      url: this.url + "file/",
      formData: true
    });
  }

  override delete<RES = GrantRecordType>(grantId: string) {
    return super.delete<RES>(grantId);
  }

  update<
    RES = GrantRecordType,
    REQ = Omit<GrantRecordType, "id" | "receiver_obj">,
  >(grantId: string | undefined) {
    return super.updateAll<RES, REQ>({
      url: this.url + grantId + "/",
    });
  }
}

export const apiGrantRecord = createInstanceCreator(
  "/accounts/grant-record/",
  ApiGrantRecord,
);
