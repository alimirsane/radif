import { ColorTypes } from "@kit/common/color-type";

export interface RequestButton {
  id: number;
  action_slug:
    | "print_result"
    | "next_step"
    | "reject_step"
    | "upload_result"
    | "view_result"
    | "request_discount";
  title: string;
  color: ColorTypes;
}
