import * as yup from "yup";
import { FormikValues } from "formik/dist/types";
import { useEffect, useMemo, useState } from "react";
import { FormHandler, FormHandlerProps } from "@utils/form-handler";
import { createYupSchema } from "../utils/yup-generator";
import { FBCoreType } from "../type/core";

interface FBFormHandler<TYPE extends FormikValues>
  extends Omit<FormHandlerProps<TYPE>, "initialValues" | "validationSchema"> {
  formSchema: Array<FBCoreType>;
}

export const FormBuilderCoreManagement = <TYPE extends FormikValues>(
  props: FBFormHandler<TYPE>,
) => {
  const { children } = props;

  const validationSchema = useMemo(() => {
    const yepSchema = props.formSchema?.reduce(createYupSchema, {});
    return yup.object().shape(yepSchema);
  }, [props.formSchema]);

  const [initialValues, setInitialValues] = useState<any>({});

  useEffect(() => {
    props.formSchema?.map((value) =>
      setInitialValues((prevState: any) => ({
        ...prevState,
        [value.name as string]: value.value ?? undefined,
      })),
    );
  }, [props.formSchema]);

  return (
    <FormHandler
      initialValues={initialValues}
      validationSchema={validationSchema}
      {...props}
    >
      {(formik) => children(formik)}
    </FormHandler>
  );
};
