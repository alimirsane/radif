import { FBElementProp } from "@module/form-builder/type/sample";
import { ExperimentType } from "@api/service/experiment/type";

export interface FormType {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  json_init: FBElementProp[];
  experiment_objs: Array<ExperimentType>
  // json_init: FBElementProp[] | string;
}
