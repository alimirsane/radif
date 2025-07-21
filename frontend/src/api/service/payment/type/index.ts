import { OrderType } from "@api/service/order/type";
import { CurrentUserType } from "@api/service/user/type/current-user";

export interface PaymentConfirmRequestType {
  id2: string;
  result: number;
  orderid?: string;
  orderguid?: string;
}

export interface PaymentConfirmResponseType {
  amount: number;
  successful: string;
  charged: boolean;
  called_back: boolean;
  payer_obj: Pick<
    CurrentUserType,
    "id" | "username" | "first_name" | "last_name"
  >;
  order_obj: Omit<
    OrderType,
    "use_balance" | "promo_code" | "transaction" | "payment_record"
  > & { request_number: string };
}
