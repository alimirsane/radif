import { ExperimentType } from "@api/service/experiment/type";
import { ParameterType } from "@api/service/parameter/type";
import { statusTypes } from "@feature/dashboard/operator/component/template/type";
import { RequestStatus } from "@api/service/request/type/request-status";
import { RequestStatusStep } from "./request-status/request-step";
import { FBElementProp } from "@module/form-builder/type/sample";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { ColorTypes } from "@kit/common/color-type";
import { OrderType } from "@api/service/order/type";
import { GrantRequestType } from "@api/service/grant-request/type";
import { AppointmentType } from "@api/service/appointment/type";

interface LatestStatusType {
  id: number;
  step_obj: RequestStatusStep;
}

interface ResultObjectsType {
  file?: string;
  description?: string;
  created_at?: string;
  result_by_obj: Pick<
    CurrentUserType,
    "username" | "first_name" | "last_name" | "id"
  >;
  result_by: number;
}

export interface PaymentType {
  amount: string;
  transaction_code: string;
  tref: string;
  successful: boolean;
  payment_type: string;
  created_at: string;
}
export interface DiscountType {
  id: number;
  discount: number;
  description: string;
  created_at: string;
  request: number;
  action_by: number;
  action_by_obj: Pick<
    CurrentUserType,
    "username" | "first_name" | "last_name" | "id"
  >;
}
export interface RequestType {
  latest_status_obj?: LatestStatusType;
  status_objs?: Array<RequestStatus>;
  id?: number;
  owner?: number;
  owner_obj?: CurrentUserType;
  result_objs?: ResultObjectsType[];
  experiment_obj?: ExperimentType;
  parameter_obj?: ParameterType[];
  price?: string;
  price_wod?: string;
  price_sample_returned?: string;
  is_urgent?: boolean;
  is_completed?: boolean;
  status?: statusTypes;
  created_at?: string;
  updated_at?: string;
  delivery_date?: string;
  description?: string;
  subject?: string;
  experiment?: number;
  request_number?: string;
  request_counter?: string;
  parameter?: number[];
  forms: RequestTypeForm[];
  file_url?: string;
  payment_record_objs?: PaymentType[];
  discount?: number;
  discount_description?: string;
  is_returned?: boolean;
  step_color?: ColorTypes;
  name?: string;
  is_sample_returned?: boolean;
  is_cancelled?: boolean;
  discount_history_objs?: DiscountType[];
  has_parent_request?: boolean;
  parent_request?: number | null;
  child_requests?: RequestType[];
  labsnet?: boolean;
  labsnet_discount?: string;
  labsnet_code1?: string;
  labsnet_code2?: string;
  order_obj?: Omit<OrderType, "use_balance" | "transaction" | "promo_code">[];
  grant_request1?: number | null;
  grant_request2?: number | null;
  grant_request1_obj?: GrantRequestType;
  grant_request2_obj?: GrantRequestType;
  grant_request_discount?: number;
  labsnet_result?: string;
  labsnet_description?: string;
  labsnet_status?: number;
  test_duration?: number;
  labsnet1_id?: string;
  labsnet2_id?: string;
  labsnet1_obj?: LabsnetInfoType;
  labsnet2_obj?: LabsnetInfoType;
  appointments_obj?: Pick<
    AppointmentType,
    | "reserved_by_obj"
    | "start_time"
    | "end_time"
    | "status"
    | "date"
    | "extra_fields"
    | "request"
    | "reserved_by"
    | "id"
  >[];
  has_prepayment?: boolean;
  total_prepayment_amount?: string;
}
export interface CertificateParams {
  id: number;
  issue_date: string;
  temperature: string;
  humidity: string;
  pressure: string;
  uncertainty: string;
  created_at: string;
  updated_at: string;
  request: number;
}
export interface CertificateObjType extends RequestType {
  certificate_obj?: CertificateParams;
  dates?: { result_date: string; sample_date: string };
}

export interface RequestTypeForm {
  id: number;
  form_number: string;
  response_json: FBElementProp[];
  request?: number;
  response_count?: number;
  is_main?: boolean;
  children?: RequestTypeForm[];
}
export interface LabsnetInfoType {
  id: number;
  labsnet_id: string;
  amount: string;
  start_date: string;
  end_date: string;
  remain: string;
  percent: string;
  title: string;
  created_at: string;
  updated_at: string;
  user: number;
}
