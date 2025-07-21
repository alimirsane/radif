import { ColorTypes } from "@kit/common/color-type";

interface StepsObjType {
  id: number;
  name: string;
  description: string;
  is_first_step: boolean;
  next_button_title: string;
  next_button_color: string;
  step_color?: ColorTypes;
  request_count: string;
  request_counter?: string;
  progress: number;
  workflow: number;
  next_step: number;
  assigned_to: number;
}

export interface WorkflowType {
  id: number;
  steps_objs: StepsObjType[] | undefined;
}
