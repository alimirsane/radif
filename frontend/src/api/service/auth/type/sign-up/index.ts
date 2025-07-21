import { UserType } from "@api/service/user/type/user-type";

export interface SignUpType {
  username: string;
  user_type: UserType;
  account_type: "personal" | "business";
  first_name: string;
  password: string;
  last_name: string;
  national_id: string;
  email: string;
  company_national_id: string;
  postal_code: string;
  address: string;
  company_name?: string;
  company_telephone: string;
  is_sharif_student?: boolean;
  department?: number;
  telephone?: string;
  company_economic_number: string;
  educational_level?: number;
  educational_field?: number;
  student_id?: string | undefined;
}
export interface PersonalSignUpType {
  user_type: UserType;
  account_type: "personal" | "business";
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  national_id: string;
  email: string;
  student_id?: string | undefined;
  educational_level?: number;
  educational_field?: number;
  postal_code: string;
  is_sharif_student?: boolean;
  department?: number;
  telephone?: string;
  address: string;
}
export interface BusinessSignUpType {
  user_type: UserType;
  account_type: "personal" | "business";
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  company_national_id: string;
  company_name?: string;
  postal_code: string;
  company_telephone: string;
  address: string;
  national_id: string;
  company_economic_number?: string;
}
