import { SignUpForm } from "@feature/auth/signup";
import { Layout } from "@feature/auth/common/layout";

const SignupRoute = () => {
  return (
      <Layout title="ثبت نام در سامانه">
        <SignUpForm />
      </Layout>
  );
};

export default SignupRoute;
