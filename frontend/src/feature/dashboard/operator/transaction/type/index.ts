export interface TransactionType {
  id: number;
  request_title: string;
  applicant: string;
  transaction_date: string;
  request_date: string;
  transaction_amount: string;
  transaction_code: string;
  order_status ?: "new" | "pending" | "completed" | "canceled" | string
}
export interface TransactioLitType {
  id: number;
  successful: boolean;
  transaction_code: string;
  amount: string;
  payer: string;
  order: string;
  updated_at: string;
  created_at: string;
}
