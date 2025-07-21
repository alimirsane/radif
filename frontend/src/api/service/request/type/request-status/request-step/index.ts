import { RequestButton } from "@api/service/request/type/request-status/request-buttons";
import { ColorTypes } from "@kit/common/color-type";

export interface RequestStatusStep {
  id: number;
  request_count: number;
  buttons: RequestButton[];
  name: string;
  description: string;
  next_button_title: string;
  next_button_color: string;
  reject_button_title: string;
  reject_button_color: string;
  is_first_step: boolean;
  has_next_step: boolean;
  has_reject_step: boolean;
  progress: number;
  workflow: number;
  next_step: number;
  reject_step?: number;
  assigned_to?: number;
  button: number[];
  step_color?: ColorTypes;
}
