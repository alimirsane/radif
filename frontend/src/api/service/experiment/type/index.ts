import { DepartmentType } from "@api/service/department/type";
import { DeviceType } from "@api/service/device/type";
import { FormType } from "@api/service/form/type";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { statusTypes } from "@feature/dashboard/operator/component/template/type";

export interface LaboratoryObjType {
  id: 1;
  name: string;
  name_en: string;
  status: statusTypes;
  address: string;
  phone_number: null | string;
  description: string;
  image: string;
  technical_manager: number;
  technical_manager_obj: Pick<
    CurrentUserType,
    "id" | "first_name" | "last_name" | "username"
  >;
  operator: number;
  operator_obj: Pick<
    CurrentUserType,
    "id" | "first_name" | "last_name" | "username"
  >;
  department_obj: DepartmentType;
  department: number;
  lab_type: number;
  device: number[];
  device_objs?: DeviceType[];
  telephone1?: string | undefined;
  telephone2?: string | undefined;
  add_telephone1?: string | undefined;
  add_telephone2?: string | undefined;
  economic_number?: string;
  national_id?: string;
  control_code?: string;
  postal_code?: string;
  email?: string;
  fax?: string;
  has_iso_17025?: boolean;
  is_visible_iso?: boolean;
}

export interface ExperimentType {
  id: number;
  name: string;
  name_en: string;
  status: string;
  laboratory: number | undefined;
  device: number | string;
  device_obj?: DeviceType;
  lab_name: string;
  need_turn?: boolean;
  form: FormType | number | undefined;
  form_obj: FormType | number;
  work_scope?: string;
  test_unit_type?: string;
  rules?: string;
  operator?: number;
  laboratory_obj?: LaboratoryObjType;
  estimated_result_time?: string | number;
  estimated_urgent_result_time?: string | number;
  labsnet_experiment_id?: string;
  labsnet_test_type_id?: string;
  control_code?: string;
  description?: string;
  prepayment_amount?: string;
  description_appointment?: string;
  appointment_limit_hours?: number;
}

export interface CreateExperimentType
  extends Omit<
    ExperimentType,
    "id" | "status" | "device_obj" | "form_obj" | "lab_name" | "laboratory_obj"
  > {}
