import Link from "next/link";
import { useMemo } from "react";
import * as yup from "yup";
import { useRouter } from "next/router";

import { Button } from "@kit/button";
import { Input } from "@kit/input";
import { routes } from "../../../../data/routes";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { useMutation } from "@tanstack/react-query";
import { apiRequestOtp } from "@api/service/request-otp";
import { RequestOtpType } from "@api/service/request-otp/type";
import { useResetPasswordHandler } from "@hook/reset-password";

export const PhoneNumberForm = () => {
  const router = useRouter();

  const resetPasswordValidationSchema = useMemo(() => {
    return yup.object({
      phone_number: validation.mobile,
    });
  }, []);

  // request otp create api
  const { mutateAsync } = useMutation(apiRequestOtp(true).create());
  // reset password state management
  const setPhoneNumber = useResetPasswordHandler(
    (state) => state.setPhoneNumber,
  );
  // submit phone number
  const resetPassword = (values: RequestOtpType) => {
    const data = {
      phone_number: `+98${values.phone_number.slice(1)}`,
    };
    mutateAsync(data)
      .then((res) => {
        // set phone number state
        setPhoneNumber(values.phone_number);
        router.query.step = "new-password";
        router.push(router);
      })
      .catch((err) => {});
  };

  return (
    <>
      <FormHandler
        validationSchema={resetPasswordValidationSchema}
        initialValues={{ phone_number: "" }}
        handleSubmit={(values, utils) => {
          resetPassword(values);
        }}
      >
        {(formik) => (
          <div className="flex flex-col items-center justify-center gap-6 py-6 text-right">
            <div className={`w-full md:w-4/5 xl:w-3/5 xxl:w-1/2`}>
              <Input
                name={"phone_number"}
                formik={formik}
                autoComplete={"phone_number"}
                placeholder="شماره موبایل خود را وارد کنید"
                label={"شماره موبایل"}
                // maxLength={10}
                // minLength={10}
              />
            </div>
            <div className={"flex w-full flex-col gap-2 pb-2 md:w-1/2"}>
              {/* </div>
            <div className="flex flex-row gap-3 pt-2"> */}
              <Button
                type={"submit"}
                variant="solid"
                color="primary"
                disabled={!formik.isValid}
                className="mx-auto w-full"
              >
                بازیابی رمز عبور
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
