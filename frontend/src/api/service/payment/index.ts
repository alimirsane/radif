import { createInstanceCreator, ServiceBase } from "@api/service";
import { PaymentConfirmRequestType, PaymentConfirmResponseType } from "./type";

class ApiPayment extends ServiceBase {
  getPaymentStatus<
    RES = PaymentConfirmResponseType,
    REQ = PaymentConfirmRequestType,
  >(paymentId2: string) {
    return super.updateAll<RES, REQ>({
      url: this.url + paymentId2 + "/confirm/",
    });
  }
}

export const apiPayment = createInstanceCreator("/order/payment/", ApiPayment);
