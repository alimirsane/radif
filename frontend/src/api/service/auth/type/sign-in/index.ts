import { UserType } from "@api/service/user/type/user-type";

export interface SignInType {
  token: string;
  username: string;
  password?: string;
  otp?: string;
  user_type?: UserType;
  business_accounts: {
    id: number;
    username: string;
    company_national_id: string;
    company_name: string;
    token: string;
  };
}
