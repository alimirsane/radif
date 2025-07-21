import React from "react";
import * as yup from "yup";

import { FormHandler } from "@utils/form-handler";
import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcDocument } from "@feature/kits/common/icons";

interface FormStartProps {
  formTitleValidationSchema: yup.ObjectSchema<any>;
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  createForm: () => void;
}

const FormStart: React.FC<FormStartProps> = ({
  formTitleValidationSchema,
  setFormTitle,
  createForm,
}) => {
  return (
    <FormHandler
      validationSchema={formTitleValidationSchema}
      initialValues={{ title: "" }}
      handleSubmit={(values, utils) => {
        setFormTitle(values.title);
        createForm();
      }}
    >
      {(formik) => (
        <div className="flex flex-col justify-center gap-5 px-4">
          <h6 className="text-[18px] font-semibold">
            برای شروع ابتدا یک عنوان برای فرم تعیین کنید.
          </h6>
          <Input
            placeholder="مثلا: پذیرش نمونه XRD ..."
            label="عنوان فرم"
            className="w-full md:w-1/2"
            name={"title"}
            formik={formik}
            autoComplete={"title"}
          />
          <Button
            variant="solid"
            color="primary"
            type={"submit"}
            disabled={!formik.isValid}
            className="mx-auto mt-3"
            startIcon={
              <SvgIcon
                strokeColor={"white"}
                className={"[&_svg]:h-[18px] [&_svg]:w-[18px]"}
              >
                <IcDocument />
              </SvgIcon>
            }
          >
            شروع ساخت فرم
          </Button>
        </div>
      )}
    </FormHandler>
  );
};

export default FormStart;
