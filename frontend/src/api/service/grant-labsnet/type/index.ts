export interface CreditType {
  id: string;
  name: string;
  value: string;
  percent: number;
  expiration_date: string;
}

export interface LabsnetGrantType {
  national_id: string;
  type: string;
  services: string;
  customer_name: string;
  credits: CreditType[];
}
