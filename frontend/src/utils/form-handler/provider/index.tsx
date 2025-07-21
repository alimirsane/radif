import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormikProps } from "formik";
import { FormikValues } from "formik/dist/types";
import * as Yup from "yup";

export type FormHandlerContextType<FORM_VALUES> = FormikProps<FORM_VALUES> & {
  validationSchema?: Yup.Schema
};

const FormHandlerContext = createContext<
  FormHandlerContextType<any> | undefined
>(undefined);

function FormHandlerProvider<FORM_VALUES extends FormikValues>({
  children,
  initialFormProps,
  initialValidationSchema,
}: {
  children?: ReactNode;
  initialFormProps: FormikProps<FORM_VALUES>;
  initialValidationSchema?: Yup.Schema
}) {
  const [formProps, setFormProps] =
    useState<FormikProps<FORM_VALUES>>(initialFormProps);
  const [validationSchema, setValidationSchema] =
    useState<Yup.Schema | undefined>(initialValidationSchema);

  useEffect(() => {
    setFormProps(initialFormProps);
  }, [initialFormProps]);

  useEffect(() => {
    setValidationSchema(validationSchema);
  }, [validationSchema]);

  return (
    <FormHandlerContext.Provider value={{ ...formProps, validationSchema: validationSchema }}>
      {children}
    </FormHandlerContext.Provider>
  );
}

export default FormHandlerProvider;

export const useFormikProps = <FORM_VALUES extends FormikValues>() => {
  const context = useContext(
    FormHandlerContext,
  ) as FormHandlerContextType<FORM_VALUES>;
  if (!context) {
    return {
      validationSchema: undefined,
    }
  }
  return context;
};
