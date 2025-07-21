import { useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { IcClose } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { Card } from "@kit/card";
import { useRouter } from "next/router";
import { useMemo } from "react";
import ViewUserForm from "../../view-user-form";

const ViewUser = () => {
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
      color={"white"}
      className="flex max-h-[95vh] w-[95vw] flex-col overflow-y-auto px-8 pb-8 pt-4 md:max-h-[95vh] md:w-[80vw] md:pb-11 md:pt-8 lg:w-[60vw]"
    >
      <div className="mb-4 flex flex-row items-center justify-between md:mb-9">
        <h6 className="text-[22px] font-[700]">اطلاعات {labelCustomerUser}</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <ViewUserForm />
    </Card>
  );
};

export default ViewUser;
