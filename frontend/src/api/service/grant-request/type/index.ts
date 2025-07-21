import { CurrentUserType } from "@api/service/user/type/current-user";
import { GrantStatusType } from "./grant-status-type";

export interface GrantRequestType {
  id: number;
  requested_amount: string;
  approved_amount: number;
  remaining_amount?: number;
  approved_datetime: string;
  datetime: string;
  expiration_date: string;
  status: GrantStatusType;
  sender: number;
  receiver: number;
  sender_obj: Pick<
    CurrentUserType,
    "first_name" | "last_name" | "id" | "username"
  >;
  receiver_obj: Pick<
    CurrentUserType,
    "first_name" | "last_name" | "id" | "username"
  >;
  file_url?: string;
  approved_grant_record?: number;
}
