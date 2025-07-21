import { CurrentUserType } from "@api/service/user/type/current-user";

export interface GrantRecordType {
  id: number;
  receiver_obj: Pick<
    CurrentUserType,
    "first_name" | "last_name" | "id" | "username"
  >;
  title: string;
  amount: number | undefined;
  remaining_grant?: number | undefined;
  expiration_date: string;
  created_at: string;
  receiver: number | undefined;
  file?: string | undefined | File;
}
