import { Card } from "@kit/card";
import { ParamCostType } from "./type";
import { useMemo } from "react";

export const FinalCostCard = (props: ParamCostType) => {
  const {
    price,
    paramsCount,
    estimatedResultTime,
    estimatedResultTimeUrgent,
    isUrgent,
    children,
    testUnitType,
  } = props;
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "زمان (دقیقه)" },
      { value: "hour", name: "زمان (ساعت)" },
    ];
  }, []);
  return (
    <>
      <Card
        color="info"
        className="flex flex-col items-center justify-between border border-background-paper-dark px-6 py-4 md:flex-row"
      >
        <div className="flex flex-col flex-wrap items-center gap-2 md:flex-row md:gap-8">
          <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
            <h6 className="text-[17px] font-[500]">تعداد پارامترها:</h6>
            <span className="mr-1 text-[20px] font-[700]">{paramsCount}</span>
          </div>
          <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
            <h6 className="text-[17px] font-[500]">نوع واحد آزمون:</h6>
            <span className="mr-1 text-[18px] font-[600]">
              {unitsList.find((unit) => unit.value === testUnitType)?.name ??
                testUnitType}
            </span>
          </div>
          <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
            <h6 className="text-[17px] font-[500]">هزینه نهایی:</h6>
            <span className="mr-2 text-[20px] font-[700]">
              {price.toLocaleString()}
              <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
            </span>
          </div>
          <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
            <h6 className="text-[17px] font-[500]">زمان انتظار انجام آزمون:</h6>
            <span
              className={`mr-1 text-[20px] font-[700] ${isUrgent ? "text-error" : ""}`}
            >
              {isUrgent
                ? estimatedResultTimeUrgent || "-"
                : estimatedResultTime}
              <span className="mr-1 text-[14px] font-[400]">روز کاری</span>
            </span>
          </div>
        </div>
        <div>{children}</div>
      </Card>
    </>
  );
};
