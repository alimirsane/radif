import * as yup from "yup";
import { useMemo, useState } from "react";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { useModalHandler } from "@utils/modal-handler/config";
import { apiVerifyOtp } from "@api/service/verify-otp";
import { VerifyOtpType } from "@api/service/verify-otp/type";
import { apiRequestOtp } from "@api/service/request-otp";
const ChangePassword = () => {
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get phone number form modal
  const mobile = useModalHandler((state) => state.modalData);
  // validation
  const resetPasswordValidationSchema = useMemo(() => {
    return yup.object({
      new_password: validation.password,
      otp_code: validation.requiredInput,
    });
  }, []);
  const [viewPasswordForm, setViewPasswordForm] = useState<boolean>(false);
  // request otp create api
  const { mutateAsync: getCode } = useMutation(
    apiRequestOtp(true, {
      success: "کد تایید ارسال شد",
      fail: "ارسال کد تایید انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
  );
  // submit phone number
  const getOtp = () => {
    setViewPasswordForm(true);
    if (!mobile) return;
    const data = {
      phone_number: mobile,
    };
    getCode(data)
      .then((res) => {})
      .catch((err) => {});
  };
  // verify otp create api
  const { mutateAsync: verifyCode } = useMutation(
    apiVerifyOtp(true, {
      success: "تغییر رمز عبور با موفقیت انجام شد",
      fail: "تغییر رمز عبور انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
  );
  // submit new password and otp
  const verifyOtp = (values: Omit<VerifyOtpType, "phone_number">) => {
    const data = {
      phone_number: mobile,
      otp_code: values.otp_code,
      new_password: values.new_password,
    };
    verifyCode(data)
      .then((res) => {
        hideModal();
      })
      .catch((err) => {});
  };
  return (
    <Card
      color={"white"}
      className="flex w-[90vw] flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[50vw] xl:w-[40vw] xxl:w-[30vw]"
    >
      <div className="mb-9 flex flex-row justify-between gap-6 sm:flex-row sm:items-center">
        <h6 className="text-[18px] font-bold">تغییر رمز عبور</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      {!viewPasswordForm && (
        <div className="w-full">
          <h6 className="text-[14px]">
            {`برای تغییر رمز عبور، کد تایید به شماره 0${mobile?.slice(3)} ارسال می‌شود.`}
          </h6>
          <Button
            variant="solid"
            className="mx-auto mb-2 mt-6"
            onClick={getOtp}
          >
            دریافت کد تایید
          </Button>
        </div>
      )}
      {viewPasswordForm && (
        <FormHandler
          validationSchema={resetPasswordValidationSchema}
          initialValues={{ new_password: "", otp_code: "" }}
          handleSubmit={(values, utils) => {
            verifyOtp(values);
          }}
        >
          {(formik) => (
            <div className="flex flex-col items-center justify-center gap-6 text-right">
              <div className="w-full">
                <h6 className="text-[14px]">
                  {`کد تایید ارسال شده به شماره 0${mobile?.slice(3)} و رمز عبور جدید را وارد کنید.`}
                </h6>
              </div>
              <div className="w-full">
                <Input
                  name={"otp_code"}
                  formik={formik}
                  autoComplete={"otp_code"}
                  placeholder={"کد تایید ارسال شده را وارد کنید"}
                  label={"کد تایید"}
                  maxLength={6}
                  minLength={6}
                />
              </div>
              <div className="w-full">
                <Input
                  name={"new_password"}
                  formik={formik}
                  autoComplete={"new_password"}
                  placeholder="رمز عبور جدید خود را وارد کنید"
                  label="رمز عبور جدید (حداقل 5 کاراکتر)"
                  type="password"
                  passwordHandler
                />
              </div>
              <div className="w-full pt-1">
                <Button
                  type={"submit"}
                  variant="solid"
                  color="primary"
                  disabled={!formik.isValid}
                  className="mr-auto"
                >
                  ثبت رمز عبور جدید
                </Button>
              </div>
            </div>
          )}
        </FormHandler>
      )}
    </Card>
  );
};
export default ChangePassword;
