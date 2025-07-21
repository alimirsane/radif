export interface GrantTransactionType {
  id: number;
  amount: number;
  datetime: string;
  expiration_date: string;
  sender: number;
  receiver: number;
}
