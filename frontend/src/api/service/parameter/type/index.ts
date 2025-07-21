export interface ParameterType {
  id: number;
  name: string;
  price: string;
  urgent_price: string | undefined;
  partner_price: string;
  partner_urgent_price: string;
  experiment: number | undefined;
  exp_name: string;
  unit: string;
  unit_value: number;
  name_en: string;
}
export interface CreateParameterType
  extends Omit<ParameterType, "id" | "exp_name"> {}
