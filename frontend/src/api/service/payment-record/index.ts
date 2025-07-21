import { createInstanceCreator, ServiceBase } from "@api/service";
import { ResultType } from "./type";

class ApiPaymentRecord extends ServiceBase {
  getAllByOperator<RES = Array<ResultType>>(params?: {}) {
    return super.getAllPagination<RES>({
      params,
      url: this.url + "manager/list/",
    });
  }
  getFileUrl<RES = ResultType>(params?: {}) {
    return super.getAllPagination<RES>({
      params,
      url: this.url + "manager/list/",
    });
  }
  getAllByCustomer<RES = ResultType>(params?: {}) {
    return super.getAllPagination<Array<RES>>({
      params,
      url: this.url + "list/",
    });
  }

  updateTref<
    RES = ResultType,
    REQ = Pick<ResultType, "tref" | "settlement_type" | "successful">,
  >(paymentId: number) {
    return super.updateSome<RES, REQ>({
      url: this.url + paymentId + "/manager/",
    });
  }

  updateTransactionByOperator<
    RES = ResultType,
    REQ = Pick<
      ResultType,
      "tref" | "settlement_type" | "successful" | "transaction_code" | "amount"
    >,
  >(paymentId: number) {
    return super.updateSome<RES, REQ>({
      url: this.url + paymentId + "/manager/",
    });
  }

  createTransactionByOperator<
    RES = ResultType,
    REQ = Pick<
      ResultType,
      | "tref"
      | "settlement_type"
      | "successful"
      | "transaction_code"
      | "amount"
      | "order"
      | "payer"
      | "payment_type"
      | "charged"
      | "called_back"
      | "is_returned"
    >,
  >() {
    return super.create<RES, REQ>({
      url: this.url + "manager/list/",
    });
  }

  override delete<RES = ResultType>(paymentId: string) {
    const url = paymentId + "/manager/";
    return super.delete<RES>(url);
  }

  lockTransaction<RES = ResultType, REQ = Pick<ResultType, "is_lock">>(
    paymentId: number,
  ) {
    return super.updateSome<RES, REQ>({
      url: this.url + paymentId + "/manager/",
    });
  }

  createTransactionsContradiction<
    RES = ResultType,
    REQ = Pick<ResultType, "file">,
  >() {
    return super.create<RES, REQ>({
      url: this.url + "excel/",
      formData: true,
    });
  }
}

export const apiPaymentRecord = createInstanceCreator(
  "/order/payment-record/",
  ApiPaymentRecord,
);
