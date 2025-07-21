import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import { apiPaymentRecord } from "@api/service/payment-record";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

const LockTransaction = () => {
  const router = useRouter();
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const transaction = useModalHandler((state) => state.modalData);
  const queryClient = useQueryClient();
  // lock api
  const { mutateAsync } = useMutation(
    apiPaymentRecord(true, {
      success: `${transaction.is_lock ? "باز کردن" : "قفل کردن"} تراکنش موفقیت آمیز بود`,
      fail: `${transaction.is_lock ? "باز کردن" : "قفل کردن"} تراکنش انجام نشد`,
      waiting: "در حال انتظار",
    }).lockTransaction(transaction.id),
  );
  const lockHandler = () => {
    const data = {
      is_lock: !transaction.is_lock,
    };
    mutateAsync(data)
      .then((res) => {
        // queryClient.invalidateQueries({
        //   queryKey: [apiPaymentRecord().url],
        // });
        router.query.action = "edit";
        router.push(router);
        hideModal();
      })
      .catch((err) => {});
  };
  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[45vw] lg:w-[35vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">
          {transaction.is_lock ? "باز کردن" : "قفل کردن"} تراکنش
        </h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <Card
        color={"info"}
        className="mb-8 mt-7 px-4 py-7 text-center text-[14px]"
      >
        آیا از {transaction.is_lock ? "باز کردن" : "قفل کردن"} تراکنش &quot;
        {`${transaction.payer_obj.first_name} ${transaction.payer_obj.last_name}`}
        &quot; با شماره تراکنش &quot;
        {transaction.transaction_code}
        &quot; اطمینان دارید؟
      </Card>
      <div className="flex justify-center gap-[12px] pb-1">
        <Button className="w-[100px]" variant="outline" onClick={hideModal}>
          خیر
        </Button>
        <Button className="w-[100px]" onClick={lockHandler}>
          بله
        </Button>
      </div>
    </Card>
  );
};

export default LockTransaction;
