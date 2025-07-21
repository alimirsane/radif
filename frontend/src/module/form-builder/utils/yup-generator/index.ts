import * as yup from "yup";
import { FBCoreType } from "../../type/core";

export function createYupSchema(schema: any, config: FBCoreType) {
  const { name, validationType, validations } = config;
  if (!yup[validationType ?? "string"]) {
    return schema;
  }
  let validator = yup[validationType ?? "string"]();
  validations?.forEach((validation) => {
    const { params, type } = validation;
    if (!(validator as any)[type as any]) {
      return;
    }
    validator = (validator as any)[type as any](...params);
  });
  schema[name ?? ""] = validator;
  return schema;
}
