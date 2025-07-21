import { useRouter } from "next/router";
import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import { routes } from "@data/routes";
import { setCookie } from "@utils/cookie-handler";
import { useModalHandler } from "@utils/modal-handler/config";

export const AccountSwitcher = () => {
  const router = useRouter();
  const { refetch } = useQuery(apiUser().me());
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get user type
  const loginData = useModalHandler((state) => state.modalData);
  // hide modal and navigate to dashboard on user click
  const selectAccountType = () => {
    setTimeout(() => {
      refetch().then((data) => {
        router.push(routes.customer());
      });
    }, 500);
    hideModal();
  };
  return (
    <Card color={"white"} className="w-[80vw] p-6 md:w-[50vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[18px] font-[700]">انتخاب نوع حساب کاربری</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <p className="py-2 text-[14px]">
        برای ورود به سامانه نوع حساب کاربری خود را انتخاب کنید.
      </p>
      <div className="flex flex-row gap-6 px-12 py-4">
        <Card
          color={"primary"}
          variant="outline"
          className="flex-1 cursor-pointer px-4 py-7 text-center text-[14px] font-medium text-primary transition-all duration-500 hover:bg-opacity-20"
          onClick={() => {
            setCookie("token", loginData.naturalToken, 7);
            selectAccountType();
          }}
        >
          ورود با حساب حقیقی
        </Card>
        <Card
          color={"primary"}
          variant="outline"
          className="flex-1 cursor-pointer px-4 py-7 text-center text-[14px] font-medium text-primary transition-all duration-500 hover:bg-opacity-20"
          onClick={() => {
            setCookie("token", loginData.businessToken, 7);
            selectAccountType();
          }}
        >
          ورود با حساب حقوقی
        </Card>
      </div>
    </Card>
  );
};
