import Link from "next/link";
import { useMemo } from "react";
import * as yup from "yup";
import { Button } from "@kit/button";
import { Input } from "@kit/input";
import { routes } from "@data/routes";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { useSignInService } from "@hook/sign-in-service";
import { useRouter } from "next/router";

export const SignInWithPassword = () => {
  const router = useRouter();
  const signIn = useSignInService();

  const signInValidationSchema = useMemo(() => {
    return yup.object({
      password: validation.password,
      username: validation.mobile,
    });
  }, []);
  return (
    <>
      <FormHandler
        validationSchema={signInValidationSchema}
        initialValues={{ username: "", password: "" }}
        handleSubmit={(values, utils) => {
          signIn(values.username, values.password);
        }}
      >
        {(formik) => (
          <div className="flex flex-col items-center justify-center gap-4 pt-6 text-right">
            <div className={`w-full md:w-1/2`}>
              <Input
                name={"username"}
                formik={formik}
                autoComplete={"username"}
                placeholder="شماره موبایل خود را وارد کنید"
                label={"شماره موبایل"}
                // maxLength={10}
                // minLength={10}
              />
            </div>
            <div className="relative flex w-full flex-col md:w-1/2">
              <Input
                name={"password"}
                formik={formik}
                autoComplete={"password"}
                placeholder="رمز عبور خود را وارد کنید"
                label={"رمز عبور"}
                type="password"
                passwordHandler
              />
              <div className="absolute left-0 top-[1.5px] mx-auto flex w-fit flex-row text-[11px] text-info">
                <Link href={routes.resetPassword()}>
                  {/*<Button className={"text-xs px-[5px]"} variant={"text"} color={"primary"}>*/}
                  فراموشی رمز عبور
                  {/*</Button>*/}
                </Link>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-1/2">
              <Button
                type={"submit"}
                variant="solid"
                color="primary"
                className="w-full"
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
