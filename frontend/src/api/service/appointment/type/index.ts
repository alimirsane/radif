import { RequestStatus } from "@api/service/request/type/request-status";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { ColorTypes } from "@kit/common/color-type";

export enum QueueStatusType {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}
export enum AppointmentStatusType {
  FREE = "free",
  RESERVED = "reserved",
  CANCELED = "canceled",
  PENDING = "pending",
}
export interface QueueType {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  break_start: string;
  break_end: string;
  status: QueueStatusType;
  experiment: number;
  time_unit: number;
  appointments: Pick<
    AppointmentType,
    "start_time" | "status" | "reserved_by" | "reserved_by_obj"
  >[];
}
export interface AppointmentType {
  id?: number;
  date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatusType;
  queue_id?: number;
  queue?: number;
  request?: number;
  reserved_by: number;
  reserved_at?: string;
  experiment: number;
  break_start?: string;
  break_end?: string;
  time_unit: string;
  appointment_id?: number;
  request_id?: number;
  request_parent_number?: string;
  request_status?: RequestStatus & { name: string; step_color: ColorTypes };
  reserved_by_obj?: Pick<
    CurrentUserType,
    "username" | "first_name" | "last_name" | "id"
  >;
  extra_fields?: {
    request_id: number;
    request_number: string;
    request_parent_number: string;
    experiment_name: string;
    queue_status: QueueStatusType;
  };
}
