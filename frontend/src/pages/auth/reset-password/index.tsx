import { Layout } from "@feature/auth/common/layout";
import { ResetPasswordSteps } from "@feature/auth/reset-password";

const ResetPassword = () => {
  return (
    <>
      <Layout title="بازیابی رمز عبور">
        <ResetPasswordSteps />
      </Layout>
    </>
  );
};

export default ResetPassword;
