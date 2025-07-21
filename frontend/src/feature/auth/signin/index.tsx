import Link from "next/link";
import { useRouter } from "next/router";

import { Button } from "@kit/button";
import { routes } from "@data/routes";
import { SignInWithOtp } from "./form-with-otp";
import { EnterOtp } from "./form-with-otp/receive-otp";
import { SignInWithPassword } from "./form-with-password";
import { generatePKCE, initiateOIDCLogin } from "@api/service/auth/type/oidc";

export const SignInForm = () => {
  const router = useRouter();
  // const handleLoginWithSharifAccount = (event: any) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   window.open(
  //     process.env.NEXT_PUBLIC_SHARIF_SSO,
  //     "sharif-auth",
  //     "width=500,height=600",
  //   );
  // };

  const handleLoginWithSharifAccount = () => {
    const { codeVerifier, codeChallenge } = generatePKCE();
    localStorage.setItem("pkce_code_verifier", codeVerifier); // Store verifier securely
    const ssoUrl = initiateOIDCLogin(codeChallenge);
    // Redirect to SSO login page
    window.location.href = ssoUrl;
    // window.open(ssoUrl, "sharif-auth");
  };

  return (
    <>
      {!router.query.step && <SignInWithPassword />}
      {router.query.step === "mobile-number" && <SignInWithOtp />}
      {router.query.step === "otp" && <EnterOtp />}

      <div className={"flex flex-col items-center gap-1 py-3"}>
        <div className={"relative my-3 w-full md:w-1/2"}>
          <hr className={"w-full border-common-gray"} />
          <span
            className={
              "absolute left-0 right-0 top-0 mx-auto w-fit translate-y-[-50%] bg-background-default p-1 text-xs text-common-gray"
            }
          >
            یا
          </span>
        </div>
        <div className={"flex w-full flex-col gap-2 py-2 md:w-1/2"}>
          {router.query.step && (
            <Button
              type="button"
              variant="outline"
              className="mx-auto w-full"
              onClick={() => {
                delete router.query.step;
                router.push(router);
              }}
            >
              ورود با رمز عبور
            </Button>
          )}
          {router.query.step !== "mobile-number" &&
            router.query.step !== "otp" && (
              <Button
                type="button"
                variant="outline"
                className="mx-auto w-full"
                onClick={() => {
                  router.query.step = "mobile-number";
                  router.push(router);
                }}
              >
                ورود با رمز یکبار مصرف
              </Button>
            )}
          <Button
            type="button"
            variant="outline"
            className="mx-auto w-full"
            onClick={handleLoginWithSharifAccount}
          >
            ورود با حساب شریف
          </Button>
        </div>
      </div>
      {/*<div className="flex flex-row items-center justify-center pt-6">*/}
      {/*  <p className="text-[14px]">استاد یا دانشجوی دانشگاه شریف هستید؟</p>*/}
      {/*  <span*/}
      {/*    onClick={handleLoginWithSharifAccount}*/}
      {/*    color="secondary"*/}
      {/*    className="cursor-pointer rounded-md px-2 py-1 text-[14px] font-medium text-info transition-all duration-500 hover:bg-info-light/10"*/}
      {/*  >*/}
      {/*    ورود با حساب شریف*/}
      {/*  </span>*/}
      {/*</div>*/}
      <div className="flex flex-row items-center justify-center pt-3">
        <p className="text-[12px]">حساب کاربری ندارید؟</p>
        <Link
          href={routes.signup()}
          color="secondary"
          className="rounded-md px-2 py-1 text-[12px] font-medium text-info transition-all duration-500 hover:bg-info-light/10"
        >
          ثبت نام
        </Link>
      </div>
    </>
  );
};
