import { RequestStatusStep } from "@api/service/request/type/request-status/request-step";

export interface RequestStatus {
  id: number;
  step_obj: RequestStatusStep;
  description: string;
  seen: boolean;
  seen_at?: string;
  complete: boolean;
  accept: boolean;
  reject: boolean;
  created_at: string;
  updated_at: string;
  request: number;
  step: number;
  action_by?: number;
  action_by_name?: string;
}
