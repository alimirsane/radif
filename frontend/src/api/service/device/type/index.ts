export interface DeviceType {
  id: number;
  name: string;
  lab_name: string;
  model: string;
  manufacturer: string;
  purchase_date: string;
  warranty_period: string;
  serial_number: string;
  status?: string;
  // status: "active" | "inactive" | undefined;
  laboratory: number | undefined;
  description?: string;
  application?: string;
  accuracy?: string;
  device_code?: string;
  labsnet_device_id?: string;
  labsnet_model_id?: string;
  manufacturer_representation?: string;
  country_of_manufacture?: string;
  commissioning_date?: string;
  control_code?: string;
  extra_status?:
    | "operational"
    | "under_repair"
    | "commissioning"
    | "calibration"
    | "awaiting_budget"
    | "decommissioned"
    | string
    | undefined;
}

export interface CreateDeviceType
  extends Omit<
    DeviceType,
    "id" | "lab_name" | "warranty_period" | "device_code" | "purchase_date"
  > {
  // description: string;
  // application: string;
  // manufacturer_origin: string;
  // manager: string;
  // start_date: string;
  // state: string;
  // type_id: string;
  // agency: string;
}

export interface EditDeviceType
  extends Omit<
    CreateDeviceType,
    | "manufacturer_origin"
    | "manager"
    | "start_date"
    | "state"
    | "type_id"
    | "agency"
    | "services"
    | "asset_tag"
  > {}
