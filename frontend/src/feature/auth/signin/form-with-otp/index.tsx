import { useMemo } from "react";
import * as yup from "yup";
import { useRouter } from "next/router";

import { Button } from "@kit/button";
import { Input } from "@kit/input";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { SvgIcon } from "@kit/svg-icon";
import { IcArrowLeft } from "@feature/kits/common/icons";
import { useMutation } from "@tanstack/react-query";
import { apiRequestOtp } from "@api/service/request-otp";
import { useResetPasswordHandler } from "@hook/reset-password";
import { RequestOtpType } from "@api/service/request-otp/type";

export const SignInWithOtp = () => {
  const router = useRouter();

  const signInValidationSchema = useMemo(() => {
    return yup.object({
      phone_number: validation.mobile,
    });
  }, []);

  // request otp create api
  const { mutateAsync } = useMutation(
    apiRequestOtp(true, {
      success: "کد یکبار مصرف ارسال شد",
      fail: "ارسال کد یکبار مصرف انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
  );
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
        router.query.step = "otp";
        router.push(router);
      })
      .catch((err) => {});
  };
  return (
    <>
      <FormHandler
        validationSchema={signInValidationSchema}
        initialValues={{ phone_number: "" }}
        handleSubmit={(values, utils) => {
          resetPassword(values);
        }}
      >
        {(formik) => (
          <div className="flex flex-col items-center justify-center gap-6 pt-6 text-right">
            <div className={`w-full md:w-1/2`}>
              <Input
                name={"phone_number"}
                formik={formik}
                autoComplete={"phone_number"}
                placeholder="شماره موبایل خود را وارد کنید"
                label={"شماره موبایل"}
              />
            </div>
            <div className="flex w-full flex-row gap-3 md:w-1/2">
              {/*<Button*/}
              {/*  variant="outline"*/}
              {/*  className="mx-auto"*/}
              {/*  onClick={() => {*/}
              {/*    delete router.query.step;*/}
              {/*    router.push(router);*/}
              {/*  }}*/}
              {/*>*/}
              {/*  ورود با رمز عبور*/}
              {/*</Button>*/}
              <Button
                type={"submit"}
                variant="solid"
                color="primary"
                className="mx-auto w-full"
                disabled={!formik.isValid}
                //   endIcon={
                //   <SvgIcon
                //     strokeColor={"white"}
                //     className={"[&_svg]:h-[10px] [&_svg]:w-[10px]"}
                //   >
                //     <IcArrowLeft />
                //   </SvgIcon>
                // }
              >
                ادامه
              </Button>
            </div>
          </div>
        )}
      </FormHandler>
    </>
  );
};
