import React from "react";
import { FBSimpleLoader } from "@module/form-builder/simple-loader";
import { RequestTypeForm } from "@api/service/request/type";

interface SampleCardProps {
  sample: RequestTypeForm;
}
const SampleCard = (props: SampleCardProps) => {
  const { sample } = props;
  return (
    <div className="w-full rounded-[8px] bg-common-white p-[16px] text-typography-main">
      <span className="flex flex-row items-center justify-between">
        <h5 className="text-[14px]">
          کد نمونه:
          <span className="text-[15px] font-bold"> {sample.form_number}</span>
        </h5>
      </span>
      {/* <span className="mb-[4px]">
        <span className="text-[14px]">کد نمونه: </span>
        <span className="text-[15px] font-bold" dir="ltr">
          {sample.form_number}
        </span>
      </span> */}
      <FBSimpleLoader jsonFB={sample.response_json} />
      {/* <p className="mt-2 border-t-2 border-t-background-paper-dark pt-2 text-[14px]">
        <span className="whitespace-nowrap">تعداد نمونه: </span>
        <span className="font-[700]">
          {sample.response_count !== 0 ? sample.response_count : 1}
        </span>
      </p> */}
      <span></span>
    </div>
  );
};

export default SampleCard;
