import { useRouter } from "next/router";

import { PhoneNumberForm } from "./phone-number-form";
import { EmailMessage } from "./email-message";
import { NewPasswordForm } from "./new-password-form";

export const ResetPasswordSteps = () => {
  const router = useRouter();

  return (
    <>
      {!router.query.step && <PhoneNumberForm></PhoneNumberForm>}
      {router.query.step === "validation-link" && <EmailMessage></EmailMessage>}
      {router.query.step === "new-password" && (
        <NewPasswordForm></NewPasswordForm>
      )}
    </>
  );
};
