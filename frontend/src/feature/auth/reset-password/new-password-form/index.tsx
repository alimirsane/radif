import { useMemo } from "react";
import * as yup from "yup";

import { Button } from "@kit/button";
import { Input } from "@kit/input";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { useResetPasswordHandler } from "@hook/reset-password";
import { useMutation } from "@tanstack/react-query";
import { apiVerifyOtp } from "@api/service/verify-otp";
import { VerifyOtpType } from "@api/service/verify-otp/type";
import { routes } from "@data/routes";
import { useRouter } from "next/router";
import Link from "next/link";

export const NewPasswordForm = () => {
  const router = useRouter();

  // get phoneNumber from state management
  const phoneNumber: string | undefined = useResetPasswordHandler(
    (state) => state.phoneNumber,
  );
  const resetPasswordValidationSchema = useMemo(() => {
    return yup.object({
      new_password: validation.password,
      otp_code: validation.requiredInput,
    });
  }, []);

  // verify otp create api
  const { mutateAsync } = useMutation(apiVerifyOtp(true).create());
  // submit new password and otp
  const verifyOtp = (values: Omit<VerifyOtpType, "phone_number">) => {
    const data = {
      phone_number: `+98${phoneNumber?.slice(1)}`,
      otp_code: values.otp_code,
      new_password: values.new_password,
    };
    mutateAsync(data)
      .then((res) => {
        router.push({
          pathname: routes.signIn(),
          query: {},
        });
      })
      .catch((err) => {});
  };

  return (
    <>
      <FormHandler
        validationSchema={resetPasswordValidationSchema}
        initialValues={{ new_password: "", otp_code: "" }}
        handleSubmit={(values, utils) => {
          verifyOtp(values);
        }}
      >
        {(formik) => (
          <div className="flex flex-col items-center justify-center gap-6 pb-3 pt-6 text-right">
            <div className={`w-full md:w-1/2`}>
              <Input
                name={"otp_code"}
                formik={formik}
                autoComplete={"otp_code"}
                placeholder={`کد تایید ارسال شده به شماره ${phoneNumber} را وارد کنید`}
                label={"کد تایید"}
                maxLength={6}
                minLength={6}
              />
            </div>
            <div className={`w-full md:w-1/2`}>
              <Input
                name={"new_password"}
                formik={formik}
                autoComplete={"new_password"}
                placeholder="رمز عبور جدید خود را وارد کنید"
                label={"رمز جدید"}
                type="password"
                passwordHandler
              />
            </div>
            <div className={"flex w-full flex-col gap-2 pb-2 md:w-1/2"}>
              <Button
                type={"submit"}
                variant="solid"
                color="primary"
                disabled={!formik.isValid}
                className="mx-auto w-full"
              >
                ثبت رمز عبور جدید
              </Button>
              <Link href={routes.signIn()}>
                <Button
                  variant="outline"
                  color="primary"
                  className="mx-auto w-full"
                >
                  بازگشت به صفحه ورود
                </Button>
              </Link>
            </div>
          </div>
        )}
      </FormHandler>
    </>
  );
};
