import { ExperimentType } from "@api/service/experiment/type";
import { useMemo } from "react";

const ExperimentInfo = ({
  experiment,
}: {
  experiment: ExperimentType | undefined;
}) => {
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "زمان (دقیقه)" },
      { value: "hour", name: "زمان (ساعت)" },
    ];
  }, []);
  return (
    <>
      <h6 className="mb-3 text-[16px] font-bold">اطلاعات آزمون</h6>
      <div className="flex flex-col flex-wrap gap-6 pt-1 md:flex-row">
        <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
          <h6 className="text-[16px] font-[500]">نام آزمون:</h6>
          <span className="text-wrap pr-1 text-[14px]">
            {experiment?.name
              ? experiment?.name + " (" + experiment?.name_en + ")"
              : "---"}
          </span>
        </div>
        <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
          <h6 className="text-[16px] font-[500]">نام آزمایشگاه:</h6>
          <span className="text-wrap pr-1 text-[14px]">
            {experiment?.laboratory_obj?.name ?? "---"}
          </span>
        </div>
        <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
          <h6 className="text-[16px] font-[500]">نام دانشکده:</h6>
          <span className="text-wrap pr-1 text-[14px]">
            {experiment?.laboratory_obj?.department_obj?.name ?? "---"}
          </span>
        </div>
        <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
          <h6 className="text-[16px] font-[500]">گستره کاری:</h6>
          <span className="text-wrap pr-1 text-[14px]">
            {experiment?.work_scope ?? "---"}
          </span>
        </div>
        <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
          <h6 className="text-[16px] font-[500]">نوع واحد آزمون:</h6>
          <span className="text-wrap pr-1 text-[14px]">
            {unitsList.find((unit) => unit.value === experiment?.test_unit_type)
              ?.name ?? experiment?.test_unit_type}
          </span>
        </div>
      </div>
    </>
  );
};

export default ExperimentInfo;
