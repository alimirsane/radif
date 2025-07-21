import React from "react";
import { CustomerProfileRequestParamatersType } from "../../type";
import { ParameterType } from "@api/service/parameter/type";

const RequestParameters: React.FC<{
  request_paramaters: ParameterType[] | undefined;
}> = ({ request_paramaters }) => {
  return (
    <div id="ParameterInfo">
      <h3 className="pb-[8px] pt-[24px] text-[18px] font-bold text-typography-gray">
        پارامترهای درخواستی
      </h3>
      <div className="grid w-full grid-cols-2 items-center gap-[16px] rounded-[8px] bg-background-paper-light px-4 py-[16px] text-typography-main md:px-[24px]">
        {request_paramaters?.length !== 0 ? (
          request_paramaters?.map((parameter: ParameterType, index: number) => (
            <div
              className="col-span-2 flex gap-[4px]  md:col-span-1 md:items-center"
              key={index}
            >
              <span className="text-[16px] font-bold">
                پارامتر {index + 1}:
              </span>
              <span className="pr-1 text-[14px]">{parameter.name}</span>
            </div>
          ))
        ) : (
          <p>---</p>
        )}
      </div>
    </div>
  );
};

export default RequestParameters;
