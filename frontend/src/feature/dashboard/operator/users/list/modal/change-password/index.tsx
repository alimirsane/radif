import { useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { IcClose } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { Card } from "@kit/card";
import { useRouter } from "next/router";
import { useMemo } from "react";
import ChangeUserPassword from "../../change-user-password";

const EditPassword = () => {
  const hideModal = useModalHandler((state) => state.hideModal);

  const router = useRouter();

  const isCustomer = useMemo(() => {
    return router.asPath.includes("customer");
  }, [router]);

  const labelCustomerUser = useMemo(() => {
    return isCustomer ? "مشتری" : "همکار";
  }, [isCustomer]);
  return (
    <Card
      color={"paper"}
      className="w-[80vw] px-6 pb-8 pt-6 md:w-[50vw] md:pb-10 md:pt-8 lg:w-[30vw]"
    >
      <div className="mb-6 flex flex-row items-center justify-between md:mb-10">
        <h6 className="text-[22px] font-[700]">
          تغییر رمز عبور {labelCustomerUser}
        </h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <ChangeUserPassword />
    </Card>
  );
};

export default EditPassword;
