import { UserType } from "@api/service/user/type/user-type";
import { AccountType } from "@api/service/user/type/account-type";
import {
  AccessLevelModules,
  AccessLevelPermissions,
} from "@feature/dashboard/common/access-level/types";

export interface CurrentUserType {
  id: number;
  last_login: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  email: string | undefined;
  user_type: UserType | undefined;
  account_type: AccountType | undefined;
  national_id: string | undefined;
  student_id?: string | undefined;
  address?: string | undefined;
  postal_code: string | undefined;
  company_name?: string;
  company_national_id?: string;
  company_telephone?: string;
  company_economic_number?: string;
  username?: string | undefined;
  educational_field?: number | string;
  educational_level?: number | string;
  password?: string;
  balance?: number;
  linked_users: Array<unknown>;
  research_grant?: number;
  access_level?: number[];
  access_level_obj: {
    id: string;
    name: string;
    access_key: string;
  }[];
  access_levels_dict: Record<
    AccessLevelModules,
    Array<AccessLevelPermissions> | undefined
  >;
  role?: number[];
  role_obj: {
    id: string;
    name: string;
    role_key: string;
  }[];
  file_url?: string;
  is_sharif_student?: boolean;
  is_partner?: boolean;
  department?: number | string;
  telephone?: string;
  linked_users_objs?: LinkedUserType[];
}
interface LinkedUserType
  extends Pick<
    CurrentUserType,
    "username" | "id" | "company_national_id" | "company_name" | "national_id"
  > {
  token: string;
}

export interface CreateUserType
  extends Pick<
    CurrentUserType,
    | "first_name"
    | "last_name"
    | "role"
    | "access_level"
    | "username"
    | "national_id"
    | "password"
    | "email"
    | "postal_code"
    | "educational_field"
    | "educational_level"
    | "student_id"
    | "department"
    | "telephone"
    | "address"
    | "company_economic_number"
    | "company_national_id"
    | "company_telephone"
    | "company_name"
  > {}
export interface LabsnetGrantListType {
  labsnet_result: {
    customer_name?: string;
    credits?: {
      id: string;
      amount: string;
      start_date: string;
      end_date: string;
      remain: string;
      percent: string;
      title: string;
    }[];
  };
}
