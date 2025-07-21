import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import { DateHandler } from "@utils/date-handler";
import { DiscountType } from "@api/service/request/type";

const DiscountHistory = () => {
  const hideModal = useModalHandler((state) => state.hideModal);

  const discountHistoryList = useModalHandler((state) => state.modalData);
  return (
    <Card
      color="white"
      className="2xl:w-[40vw] max-h-[95vh] w-[95vw] overflow-y-auto p-6 sm:w-[80vw] xl:w-[55vw]"
    >
      <span className="flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">تاریخچه تخفیف‌ها</h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <div className="pt-2 lg:px-5 lg:pb-5 lg:pt-8">
        <span className="hidden lg:block">
          <Card
            className="flex w-full flex-nowrap justify-between gap-6 overflow-x-auto whitespace-nowrap bg-background-paper-dark px-[24px] 
        py-[22px] font-bold lg:gap-2 lg:whitespace-normal"
          >
            <span className="w-full lg:w-[17%]">میزان تخفیف</span>
            <span className="w-full lg:w-[21%]">اعمال شده توسط</span>
            <span className="w-full lg:w-[22%]">تاریخ اعمال تخفیف</span>
            <span className="w-full lg:w-[40%]">توضیحات</span>
          </Card>
        </span>
        {discountHistoryList
          ?.toReversed()
          .map((item: DiscountType, index: number) => (
            <Card
              key={index}
              color={index % 2 === 0 ? "paper" : "white"}
              variant={index % 2 === 0 ? "flat" : "outline"}
              className="mt-3 flex w-full flex-col flex-nowrap items-center justify-between gap-2 overflow-x-auto whitespace-nowrap p-3
          text-[14px] lg:flex-row lg:whitespace-normal lg:px-[24px] lg:py-[22px]"
            >
              <span className="w-full lg:w-[17%]">
                <span className="font-medium lg:hidden">میزان تخفیف: </span>
                {item.discount}%
              </span>
              <span className="w-full lg:w-[21%]">
                <span className="font-medium lg:hidden">اعمال شده توسط: </span>

                {`${item.action_by_obj.first_name} ${item.action_by_obj.last_name}`}
              </span>
              <span className="w-full lg:w-[22%]">
                <span className="font-medium lg:hidden">
                  تاریخ اعمال تخفیف:{" "}
                </span>

                {item.created_at
                  ? DateHandler.formatDate(item.created_at, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "---"}
              </span>
              <span className="w-full lg:w-[40%]">
                <span className="font-medium lg:hidden">توضیحات: </span>
                {item.description}
              </span>
            </Card>
          ))}
      </div>
    </Card>
  );
};

export default DiscountHistory;
