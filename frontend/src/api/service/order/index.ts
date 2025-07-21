import { createInstanceCreator, ServiceBase } from "@api/service";
import { OrderType } from "./type";

class ApiOrder extends ServiceBase {
  override getById<RES = OrderType>(orderId: string | undefined) {
    return super.getById<RES>(orderId);
  }
  override create<
    RES = OrderType,
    REQ = Pick<OrderType, "buyer" | "request">,
  >() {
    return super.create<RES, REQ>();
  }
  getPaymentLink<RES = OrderType, REQ = Pick<OrderType, "order_status">>(
    orderId: string | undefined,
  ) {
    return super.updateAll<RES, REQ>({ url: this.url + orderId + "/pay/" });
  }
  getPrePaymentLink<RES = OrderType, REQ = Pick<OrderType, "order_status">>(
    orderId: string | undefined,
  ) {
    return super.updateAll<RES, REQ>({ url: this.url + orderId + "/prepay/" });
  }
}

export const apiOrder = createInstanceCreator("/order/order/", ApiOrder);
