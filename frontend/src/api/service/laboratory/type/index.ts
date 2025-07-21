import { DepartmentType } from "@api/service/department/type";
import { UserType } from "@api/service/user/type/user-type";
import { CustomerProfileUserType } from "@feature/dashboard/operator/component/template/type";
import { CurrentUserType } from "@api/service/user/type/current-user";

export interface ExperimentsType {
  id: number;
  name: string;
  name_en: string;
  laboratory: number;
  work_scope: string;
  test_unit_type: string;
  need_turn: string;
  operator_name: string;
  status: "active" | "inactive" | "hidden";
  device?: number;
  device_obj?: {
    id: number;
    manufacturer?: string;
    model?: string;
    name: string;
    purchase_date?: string;
    serial_number?: string;
    status: "active" | "inactive";
    warranty_period?: string;
    application: string;
    description: string;
  };
  rules?: string;
  estimated_result_time?: string;
  estimated_urgent_result_time?: string;
  description_appointment?: string;
}

export interface LaboratoryType {
  id: number | undefined;
  name: string | undefined;
  name_en: string | undefined;
  address: string | undefined;
  response_hours: string | undefined;
  phone_number: string | undefined;
  telephone1: string | undefined;
  telephone2: string | undefined;
  add_telephone1: string | undefined;
  add_telephone2: string | undefined;
  operator_obj: Pick<CurrentUserType, "username" | "first_name" | "last_name">;
  operators_obj?: Pick<
    CurrentUserType,
    "username" | "first_name" | "last_name" | "id"
  >[];
  department: number | undefined;
  lab_type: number | undefined;
  device: number[] | undefined;
  description: string | undefined;
  operator?: number | undefined;
  operators: number[] | string;
  image: string | undefined;
  status?: "active" | "inactive" | undefined;
  experiments?: ExperimentsType[] | undefined | undefined;
  images: string[] | undefined;
  technical_manager: number | undefined;
  college_name: string | undefined;
  department_obj: DepartmentType | undefined;
  technical_manager_obj: CurrentUserType | undefined;
  economic_number?: string;
  national_id?: string;
  control_code?: string;
  postal_code?: string;
  email?: string;
  fax?: string;
  has_iso_17025?: boolean;
  is_visible_iso?: boolean;
}

export type CreateLaboratoryType = Omit<
  LaboratoryType,
  | "id"
  | "experiments"
  | "images"
  | "college_name"
  | "technical_manager_obj"
  | "department_obj"
  | "device"
  | "operator_obj"
> & { image: File | undefined };

export interface EditLabType {
  name: string | undefined;
  name_en: string | undefined;
  status: "active" | "inactive" | undefined;
  address: string | undefined;
  phone_number: string | undefined;
  description: string | undefined;
  image?: string | undefined;
  technical_manager: string | undefined;
  operators: number[] | string;
  department: string | undefined;
  lab_type: number | string | undefined;
  has_iso_17025?: boolean;
}
