import React, { ReactElement } from "react";
import { FormikValues } from "formik/dist/types";
import { FormikProps, getIn } from "formik";

interface CheckBoxGroupProps<FORMIK_VALUES extends FormikValues> {
  name: string | undefined
  formik: FormikProps<FORMIK_VALUES>;
  children: ReactElement
}

export const CheckBoxGroup = <FORMIK_VALUES extends FormikValues>(props: CheckBoxGroupProps<FORMIK_VALUES>) => {

  const {formik, name, children} = props

  return (
    <div className={"flex flex-col gap-1"}>
      {children}
      {formik && (
        <>
          {getIn(formik?.touched, String(name)) &&
            Boolean(getIn(formik?.errors, String(name))) && (
              <span className={"text-xs text-error"}>
                {getIn(formik?.touched, String(name)) &&
                  getIn(formik?.errors, String(name))}
              </span>
            )}
          {/*{formik?.errors?.[name ?? ""] && (*/}
          {/*  <span className={"text-xs text-error"}>*/}
          {/*      {formik?.errors?.[name ?? ""] as string}*/}
          {/*    </span>*/}
          {/*)}*/}
        </>
      )}
    </div>
  )
}