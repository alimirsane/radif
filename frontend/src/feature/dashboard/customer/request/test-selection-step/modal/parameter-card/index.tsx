import { ParameterType } from "@api/service/parameter/type";
import { Card } from "@kit/card";
import { useMemo } from "react";

export const ParameterCard = (
  props: ParameterType & {
    selected: boolean;
    action?: () => void;
    urgentPriceIsChecked: boolean;
    isPartner: boolean;
  },
) => {
  const {
    id,
    name,
    price,
    urgent_price,
    unit,
    name_en,
    unit_value,
    experiment,
    exp_name,
    selected,
    action,
    urgentPriceIsChecked,
    partner_price,
    partner_urgent_price,
    isPartner,
  } = props;

  const getPrice = useMemo(() => {
    if (urgentPriceIsChecked) {
      if (isPartner) {
        return partner_urgent_price !== null
          ? Number(partner_urgent_price).toLocaleString()
          : partner_price !== null
            ? Number(partner_price).toLocaleString()
            : Number(price).toLocaleString();
      } else {
        return Number(urgent_price).toLocaleString();
      }
    } else {
      if (isPartner) {
        return partner_price !== null
          ? Number(partner_price).toLocaleString()
          : Number(price).toLocaleString();
      } else {
        return Number(price).toLocaleString();
      }
    }
  }, [
    urgentPriceIsChecked,
    isPartner,
    price,
    urgent_price,
    partner_price,
    partner_urgent_price,
  ]);
  return (
    <>
      <Card
        key={id}
        color="primary"
        onClick={action}
        className={`flex w-full cursor-pointer flex-col ${selected ? "bg-opacity-[7%]" : "bg-opacity-[5%]"} px-3 pb-5 pt-3 md:flex-row md:items-center md:pb-3 ${selected ? " border border-primary-light" : ""}`}
      >
        <div className="w-full pb-1 md:w-[5%]">
          {/* checkbox for md size */}
          <input
            type="checkbox"
            name={`test${id}`}
            className="hidden h-5 w-5 text-primary md:block"
            checked={selected}
            // onChange={action}
          ></input>
        </div>
        {/* <h6 className="whitespace-nowrap text-[18px] font-[500]">
          نام
          <span className="md:hidden"> پارامتر آزمون</span>
        </h6> */}
        <span className="w-full flex-grow overflow-hidden text-[14px] font-semibold md:w-[51%] md:font-normal">
          {name}
          {name_en ? ` (${name_en})` : ""}
        </span>

        <div className="flex flex-row items-center gap-3 py-1 md:hidden">
          <h6 className="whitespace-nowrap text-[14px] font-[500] md:text-[18px]">
            مقدار واحد
          </h6>
          <span className="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] font-[400] ">
            {unit_value}
          </span>
        </div>
        <div className="flex flex-row items-center gap-3 pb-2 md:hidden">
          <h6 className="whitespace-nowrap text-[14px] font-[500] md:text-[18px]">
            واحد اندازه‌ گیری
          </h6>
          <span className="flex-grow overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] font-[400] ">
            {unit ?? "---"}
          </span>
        </div>

        <div className="flex w-full flex-row items-center justify-between gap-2 whitespace-nowrap rounded-[8px] bg-primary-light bg-opacity-30 p-2 md:w-[44%] md:bg-background-paper-dark">
          {/* checkbox for sizes smaller than md */}
          <input
            type="checkbox"
            name={`test${id}`}
            checked={selected}
            // onChange={action}
            className="h-4 w-4 md:hidden"
          ></input>
          <h6 className="flex w-full flex-row items-center justify-between gap-1 text-[14px] font-[400] md:text-[17px] md:font-[500]">
            {urgentPriceIsChecked ? "تعرفه آزمون فوری" : "تعرفه آزمون"}
            <span
              className={`mr-2 text-[16px] font-[700] md:text-[14px] md:font-[400] ${urgentPriceIsChecked && "font-medium text-error"}`}
            >
              {getPrice}
              {/* {urgentPriceIsChecked
                ? Number(urgent_price).toLocaleString()
                : isPartner
                  ? partner_price !== null
                    ? Number(partner_price).toLocaleString()
                    : Number(price).toLocaleString()
                  : Number(price).toLocaleString()} */}
              <span className="mr-1 text-[13px] font-[400] text-common-gray">
                (ریال)
              </span>
            </span>
          </h6>
        </div>
      </Card>
    </>
  );
};
