import { useModalHandler } from "@utils/modal-handler/config";
import { IcClose } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { Button } from "@kit/button";
import { routes } from "@data/routes";
import { usePayOrder } from "@hook/pay-order";
import { useRouter } from "next/router";

export const RedirectToPrePayment = () => {
  const router = useRouter();
  // pay request price
  const setOrder = usePayOrder((state) => state.setOrder);
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);

  // get modal data
  const modalData = useModalHandler((state) => state.modalData);

  const handlePrePaymentClick = () => {
    setOrder(
      modalData?.requestId?.toString(),
      modalData?.requestTotalPrePayment?.toString(),
    );
    // Navigate to the customer payment route with the updated query parameter
    router.push(routes.customerPrePayment());
    hideModal();
  };
  return (
    <Card
      color={"paper"}
      className="flex max-h-[95vh] w-[95vw] flex-col px-7 pb-6 pt-4 md:max-h-[80vh] md:w-[40vw] md:pb-8 md:pt-6"
    >
      <div className="flex flex-row items-center justify-between md:mb-4">
        <h6 className="text-[22px] font-[700]">ثبت نهایی درخواست</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <Card
        color="info"
        className="mt-2 flex flex-col items-center justify-center gap-3 border border-background-paper-dark px-2 py-8 md:px-6"
      >
        <p className="text-error">
          درخواست شما دارای{" "}
          {Number(modalData?.requestTotalPrePayment)?.toLocaleString()} ریال پیش
          پرداخت می‌باشد.
        </p>
        <p className="pb-3 pt-1 text-center leading-8">
          جهت ثبت نهایی درخواست و بررسی توسط اپراتور، 15 دقیقه مهلت دارید تا
          هزینه پیش پرداخت را پرداخت نمایید. در غیر این صورت درخواست و نوبت شما
          به صورت خودکار لغو می‌گردد.
        </p>
        <Button onClick={handlePrePaymentClick}>پرداخت هزینه پیش پرداخت</Button>
      </Card>
    </Card>
  );
};
