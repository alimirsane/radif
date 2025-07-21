import { FormikProps, useFormik } from "formik";
import { FormikHelpers, FormikValues } from "formik/dist/types";
import * as Yup from "yup";
import * as React from "react";
import FormHandlerProvider from "./provider";

export interface FormHandlerProps<FORM_VALUES extends FormikValues> {
  handleSubmit: (
    values: FORM_VALUES,
    formikHelpers: FormikHelpers<FORM_VALUES>,
  ) => void | Promise<any>;
  children: (formik: FormikProps<FORM_VALUES>) => React.ReactNode;
  initialValues: FORM_VALUES;
  validationSchema?: Yup.Schema;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
}

export const FormHandler = <FORM_VALUES extends FormikValues>(
  props: FormHandlerProps<FORM_VALUES> &
    Omit<React.FormHTMLAttributes<HTMLFormElement>, "children" | "onSubmit">,
) => {
  const {
    initialValues,
    handleSubmit,
    validationSchema,
    validateOnBlur,
    validateOnMount,
    validateOnChange,
    children,
    ...options
  } = props;

  const formik = useFormik<FORM_VALUES>({
    validateOnBlur: validateOnBlur ?? true,
    validateOnMount: validateOnMount,
    validateOnChange: validateOnChange ?? true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, formikHelpers) => {
      handleSubmit(values, formikHelpers);
    },
  });

  return (
    <form {...options} onSubmit={formik.handleSubmit}>
      <FormHandlerProvider
        initialFormProps={formik}
        initialValidationSchema={validationSchema}
      >
        {children(formik)}
      </FormHandlerProvider>
    </form>
  );
};
