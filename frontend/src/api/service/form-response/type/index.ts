import { RequestType } from "@api/service/request/type";
import { FBElementProp } from "@module/form-builder/type/sample";

interface FormElementOption {
  value: string;
  label: string;
}
export interface FormElementValidations {
  type: string;
  params: string[];
}
export interface FormJsonType {
  element?: string;
  searchOn?: string;
  placeholder?: string;
  hint?: string;
  label?: string;
  id?: string;
  grid?: string;
  name?: string;
  validationType?: string;
  type?: string;
  value?: string;
  variant?: string;
  options?: FormElementOption[];
  validations?: FormElementValidations[];
  readonlyRole?: any[];
}
export interface FormResponseType {
  id: number;
  response?: string;
  response_json?: FBElementProp[];
  request?: number;
  request_obj: RequestType;
  form_number: string;
  created_at: string;
  updated_at: string;
  is_main?: boolean;
  response_count?: number;
}
