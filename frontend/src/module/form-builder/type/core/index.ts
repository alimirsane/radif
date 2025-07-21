import { FBElements } from "../element";
import { FBDependencies } from "../dependencies";
import { BooleanSchema, NumberSchema, StringSchema } from "yup";

type Role = number;

export class FBCoreType {
  id?: string;
  element?: FBElements;
  permission?: string;
  name?: string;
  readonlyRole?: Array<Role>;
  dependencies?: FBDependencies;
  grid?: string;
  value?: string;
  containerId?: string;
  validationType?: "string" | "bool" | "number";
  validations?: Array<{
    type: keyof StringSchema | keyof NumberSchema | keyof BooleanSchema;
    params: any;
  }>;
}
