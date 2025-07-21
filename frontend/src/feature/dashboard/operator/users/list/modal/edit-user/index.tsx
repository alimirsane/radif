import { useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { IcClose } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { Card } from "@kit/card";
import EditUserForm from "../../edit-user-form";
import { useRouter } from "next/router";
import { useMemo } from "react";

const EditUser = () => {
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
      className="flex max-h-[100vh] w-full flex-col overflow-y-auto px-8 py-4 md:max-h-[95vh] md:w-[80vw] md:pb-10 md:pt-8 lg:w-[60vw]"
    >
      <div className="mb-5 flex flex-row items-center justify-between md:mb-10">
        <h6 className="text-[22px] font-[700]">ویرایش {labelCustomerUser}</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      {/* <Card className="mb-4 p-5" color="info" variant="outline">
        <p className="mb-3 text-[18px] font-bold">عنوان</p>
        <ul className="list-disc px-4">
          {[1, 2, 3].map((item, index) => (
            <li key={index} className=" mb-2">
              {"اپراتور "}
              آزمایشگاه
              {" نام آزمایشگاه  "}
            </li>
          ))}
        </ul>
      </Card> */}
      <EditUserForm />
    </Card>
  );
};

export default EditUser;
