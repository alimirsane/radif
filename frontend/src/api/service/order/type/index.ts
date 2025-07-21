import { GrantRequestType } from "@api/service/grant-request/type";

interface PaymentType {
  amount: number;
  payer: number;
  order: number;
  id?: number;
  transaction_code: string;
  payment_order_guid: string;
  payment_order_id: string;
  payment_link: string;
  tref?: string;
  successful?: boolean;
  payment_type?: string;
  created_at?: string;
  settlement_type?: string;
}
export interface OrderType {
  request: number;
  buyer: number | undefined;
  id: number;
  use_balance: boolean;
  promo_code: string;
  transaction: string;
  payment_record: PaymentType[];
  order_type: "user" | "expert";
  order_status: "new" | "pending" | "completed" | "canceled" | string;
  amount_wo_pc: number;
  amount: number;
  paid: number;
  description: string;
  order_code: string;
  created_at: string;
  updated_at: string;
  promotion_code: number;
  grant_request1?: number | null;
  grant_request2?: number | null;
  grant_record1?: GrantRequestType;
  grant_record2?: GrantRequestType;
  remaining_amount?: number;
}
