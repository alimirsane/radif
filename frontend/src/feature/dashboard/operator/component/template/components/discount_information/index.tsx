import { ExperimentType } from "@api/service/experiment/type";
import { RequestType } from "@api/service/request/type";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { useMemo } from "react";

const DiscountInformation = (
  props: Pick<
    RequestType,
    | "discount"
    // | "discount_description"
    // | "is_sample_returned"
    | "price"
    | "discount_history_objs"
    | "price_sample_returned"
    | "price_wod"
    | "test_duration"
  > &
    Pick<ExperimentType, "test_unit_type">,
) => {
  const {
    discount,
    // discount_description,
    // is_sample_returned,
    price,
    discount_history_objs,
    price_wod,
    price_sample_returned,
    test_duration,
    test_unit_type,
  } = props;
  const openModal = useModalHandler((state) => state.openModal);
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "دقیقه" },
      { value: "hour", name: "ساعت" },
    ];
  }, []);
  return (
    <div id="ChildRequestPriceInfo">
      <h3 className="pb-[8px] pt-[24px] text-[18px] font-bold text-typography-gray ">
        هزینه آزمون
      </h3>
      <div className="flex w-full flex-col flex-wrap gap-[16px] rounded-[8px] bg-background-paper-light px-4 py-[16px] md:flex-row md:items-center md:gap-[32px] md:px-[24px]">
        {test_unit_type !== "sample" && test_unit_type !== "نمونه" && (
          <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
            <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
              مدت زمان انجام آزمون
            </span>
            <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
              {test_duration}
              <span className="mr-1 text-[12px] font-[400]">
                (
                {
                  unitsList.find(
                    (unit) =>
                      unit.value === test_unit_type ||
                      unit.name === test_unit_type,
                  )?.name
                }
                )
              </span>
            </span>
          </div>
        )}
        <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
          <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
            تعرفه آزمون
          </span>
          <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
            {/* {(
                Number(price) - (is_sample_returned ? 850000 : 0)
              )?.toLocaleString()} */}
            {Number(price_wod ?? 0)?.toLocaleString()}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>
        {/* <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
            <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
              هزینه ارسال
            </span>
            <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
              {Number(price_sample_returned)?.toLocaleString()}
              {Number(price_sample_returned) !== 0 && (
                <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
              )}
            </span>
          </div>
          <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
            <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
              مجموع هزینه‌ها
            </span>
            <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
              {(
                Number(price_wod) + Number(price_sample_returned)
              )?.toLocaleString()}
              <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
            </span>
          </div> */}
        <div className="flex flex-row gap-[4px] md:flex-col">
          <span className="text-[16px] font-bold text-typography-main">
            میزان تخفیف
          </span>
          <span className="pr-[6px] text-[14px] text-typography-main md:pr-[1px]">
            {discount ?? 0}
            {!!discount && (
              <span className="mr-1 text-[12px] font-[400]">درصد</span>
            )}
          </span>
        </div>
        <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
          <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
            هزینه نهایی
          </span>
          <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
            {/* {(
                Number(price) * (discount ? (100 - discount) / 100 : 1)
              )?.toLocaleString()} */}
            {Number(price ?? 0)?.toLocaleString()}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>
        <div id="DiscountHistory" className="flex grow justify-end">
          {!!discount_history_objs?.length && (
            <span
              className="mr-auto cursor-pointer text-[13px] text-info"
              onClick={() =>
                openModal(ModalKeys.DISCOUNT_HISTORY, discount_history_objs)
              }
            >
              مشاهده تاریخچه تخفیف‌ها
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountInformation;
