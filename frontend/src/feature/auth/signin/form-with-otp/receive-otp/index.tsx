import { useMemo } from "react";
import * as yup from "yup";
import { useRouter } from "next/router";

import { Button } from "@kit/button";
import { Input } from "@kit/input";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { useResetPasswordHandler } from "@hook/reset-password";
import { useSignInService } from "@hook/sign-in-service";
import Link from "next/link";
import { IcBulding, IcEdit } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";

export const EnterOtp = () => {
  const router = useRouter();
  const signIn = useSignInService();

  const signInValidationSchema = useMemo(() => {
    return yup.object({
      otp_code: validation.requiredInput,
    });
  }, []);

  // get phoneNumber from state management
  const phoneNumber: string | undefined = useResetPasswordHandler(
    (state) => state.phoneNumber,
  );

  return (
    <>
      <FormHandler
        validationSchema={signInValidationSchema}
        initialValues={{ otp_code: "" }}
        handleSubmit={(values, utils) => {
          signIn(phoneNumber ?? "", values.otp_code);
        }}
      >
        {(formik) => (
          <div className="flex flex-col items-center justify-center gap-6 pt-6 text-right">
            <div className={"flex w-full flex-col gap-4 md:w-1/2"}>
              <div className={"flex w-full flex-col gap-1 pb-2"}>
                <span className={"w-full text-xs text-common-gray"}>
                  کد ارسال شده به شماره{" "}
                  <span className={"inline px-0 py-0 text-xs"}>
                    {phoneNumber}
                  </span>{" "}
                  را وارد کنید.
                </span>
              </div>

              <div className="relative flex w-full flex-col">
                <Input
                  name={"otp_code"}
                  formik={formik}
                  autoComplete={"otp_code"}
                  placeholder={`کد تایید را وارد کنید`}
                  label={"کد تایید"}
                  maxLength={6}
                  minLength={6}
                />
                <div className="absolute left-0 top-[1.5px] mx-auto flex w-fit flex-row text-[11px] text-info">
                  <span
                    onClick={() => {
                      router.query.step = "mobile-number";
                      router.push(router);
                    }}
                    className="cursor-pointer text-xs text-info"
                  >
                    اصلاح شماره موبایل
                  </span>
                </div>
              </div>
              {/* <div className={`w-full`}>
                <Input
                  name={"otp_code"}
                  formik={formik}
                  autoComplete={"otp_code"}
                  placeholder={`کد تایید را وارد کنید`}
                  label={"کد تایید"}
                  maxLength={6}
                  minLength={6}
                />
              </div> */}
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
              >
                ورود به سامانه
              </Button>
            </div>
          </div>
        )}
      </FormHandler>
    </>
  );
};
