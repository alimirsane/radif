import { useMutation, useQuery } from "@tanstack/react-query";
import { apiAuth } from "@api/service/auth";
import { setCookie } from "@utils/cookie-handler";
import { routes } from "@data/routes";
import { useRouter } from "next/router";
import { apiUser } from "@api/service/user";
import { UserType } from "@api/service/user/type/user-type";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { useState } from "react";

export const useSignInService = () => {
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState(false);

  const { mutateAsync: signInMutation, data: singInData } = useMutation(
    apiAuth(true, {
      success: "ورود شما موفقیت آمیز بود",
      waiting: "در حال انتظار",
    }).signIn(),
  );
  const { refetch } = useQuery(apiUser().me());

  const openModal = useModalHandler((state) => state.openModal);

  return (phoneNumber: string, password: string) => {
    const data = router.query.step
      ? { username: `+98${phoneNumber?.slice(1, 11)}`, otp: password }
      : {
          username: `+98${phoneNumber?.slice(1, 11)}`,
          password: password,
        };
    signInMutation(data)
      .then(async (res) => {
        if (
          process.env.NEXT_PUBLIC_ACCOUNT_SELECTION === "true" &&
          res?.business_accounts?.token
        ) {
          openModal(ModalKeys.SELECT_ACCOUNT_TYPE, {
            businessToken: res?.business_accounts.token,
            naturalToken: res?.token,
          });
        } else {
          // set token based on account type: business/natural
          setCookie(
            "token",
            res?.business_accounts?.token
              ? res?.business_accounts.token
              : // : "f44fa9487924dfcbd8e893655d7e8913ab8116dc",
                res?.token ?? "",
            7,
          );
          // navigate to dashboard basede on user type
          setTimeout(() => {
            refetch().then((data) => {
              res?.user_type === UserType.STAFF
                ? router.push(routes.operator())
                : router.push(routes.customer());
            });
          }, 500);
        }
      })
      .catch((err) => {});
  };
};
