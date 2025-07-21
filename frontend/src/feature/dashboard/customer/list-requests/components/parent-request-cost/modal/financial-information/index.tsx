import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import Badge from "@feature/kits/badge";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import FinancialInformation from "@feature/dashboard/customer/request-id/components/financial-information";

const ParentRequestFinancialInfo = () => {
  const hideModal = useModalHandler((state) => state.hideModal);
  // get request order data from modal
  const order_obj = useModalHandler((state) => state.modalData);
  return (
    <Card
      color={"white"}
      className="2xl:w-[35vw] w-[90vw] px-8 py-6 sm:w-[70vw] xl:w-[50vw]"
    >
      <span className="mb-8 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-[20px] font-[700]">اطلاعات مالی</h2>
          {order_obj[0]?.is_returned && (
            <Badge color="error" className="py-[5px]">
              استرداد شده
            </Badge>
          )}
        </div>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <FinancialInformation paymentRecords={order_obj} />
    </Card>
  );
};

export default ParentRequestFinancialInfo;
