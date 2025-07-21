import { createInstanceCreator, ServiceBase } from "@api/service";
import { GrantTransactionType } from "./type";

class ApiGrantTransaction extends ServiceBase {
  override getAll<RES = GrantTransactionType>(params?: {}) {
    return super.getAll<RES>({ params });
  }

  override getById<RES = GrantTransactionType>(grantId: string) {
    return super.getById<RES>(grantId);
  }

  override create<
    RES = GrantTransactionType,
    REQ = Omit<GrantTransactionType, "id">,
  >() {
    return super.create<RES, REQ>();
  }

  override delete<RES = GrantTransactionType>(grantId: string) {
    return super.delete<RES>(grantId);
  }

  update<RES = GrantTransactionType, REQ = Omit<GrantTransactionType, "id">>(
    grantId: string | undefined,
  ) {
    return super.updateAll<RES, REQ>({ url: this.url + grantId + "/" });
  }
}

export const apiGrantTransaction = createInstanceCreator(
  "/accounts/grant-transaction/",
  ApiGrantTransaction,
);
