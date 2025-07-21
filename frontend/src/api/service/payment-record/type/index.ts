import { OrderType } from "@api/service/order/type";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { RequestType } from "@api/service/request/type";

export interface ResultType {
  id: number;
  order_obj: Omit<OrderType, "use_balance" | "transaction" | "promo_code">;
  payment_type: "account" | "order" | string;
  amount: number | string;
  successful: boolean;
  charged: boolean;
  transaction_code?: string;
  payment_order_guid: string;
  payment_order_id: string;
  payment_link: string;
  called_back: boolean;
  is_returned: boolean;
  created_at: string;
  updated_at: string;
  payer: number;
  request_obj: RequestType;
  payer_obj: Pick<
    CurrentUserType,
    | "id"
    | "username"
    | "first_name"
    | "last_name"
    | "national_id"
    | "email"
    | "student_id"
    | "educational_level"
    | "educational_field"
    | "postal_code"
    | "address"
  >;
  order: number;
  tref: string;
  settlement_type: string;
  is_lock: boolean;
  file?: string | undefined | File;
  download_url?: string;
}
