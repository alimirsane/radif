import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import { apiPaymentRecord } from "@api/service/payment-record";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

const DeleteTransaction = () => {
  const router = useRouter();
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const transaction = useModalHandler((state) => state.modalData);
  const { mutateAsync } = useMutation(
    apiPaymentRecord(true, {
      success: "حذف تراکنش موفقیت آمیز بود",
      fail: "حذف تراکنش انجام نشد",
      waiting: "در حال انتظار",
    }).delete(transaction.id.toString()),
  );

  const queryClient = useQueryClient();

  const deletedHandler = () => {
    mutateAsync(transaction.id.toString())
      .then((res) => {
        // queryClient.invalidateQueries({
        //   queryKey: [apiPaymentRecord().url],
        // });
        router.query.action = "delete";
        router.push(router);
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[45vw] lg:w-[35vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">حذف تراکنش</h6>
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
        آیا از حذف تراکنش &quot;
        {`${transaction.payer_obj.first_name} ${transaction.payer_obj.last_name}`}
        &quot; با شماره تراکنش &quot;
        {transaction.transaction_code}
        &quot; اطمینان دارید؟
      </Card>
      <div className="flex justify-center gap-[12px] pb-1">
        <Button className="w-[100px]" variant="outline" onClick={hideModal}>
          خیر
        </Button>
        <Button className="w-[100px]" onClick={deletedHandler}>
          بله
        </Button>
      </div>
    </Card>
  );
};

export default DeleteTransaction;
