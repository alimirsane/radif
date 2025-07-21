import { Layout } from "@feature/auth/common/layout";
import { SignInForm } from "@feature/auth/signin";
import { useMemo } from "react";

const SignInRoute = () => {
  const description = useMemo(() => {
    return undefined;
    // if (!router.query.step) return "لطفا شماره همراه و رمزعبور خود را وارد کنید"
    // if (router.query.step === "mobile-number") return "لطفا برای دریافت کد، شماره همراه خود را وارد کنید"
    // if (router.query.step === "otp") return "لطفا کد تایید ارسال شده را وارد کنید"
  }, []);

  return (
    <>
      <Layout title={"ورود به سامانه"} description={description}>
        <SignInForm />
      </Layout>
    </>
  );
};

export default SignInRoute;
