import React, { useMemo } from "react";
import { Card } from "@kit/card";
import { LabelCard } from "@kit/label-card";
import { ParameterType } from "@api/service/parameter/type";
import { useCurrentRequestHandler } from "@hook/current-request-handler";
import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";

interface ParameterInformationProps {
  parameterList: Array<ParameterType>;
  noTitle?: boolean;
  isUrgent: boolean;
}

const ParameterInformation = (props: ParameterInformationProps) => {
  const { parameterList, isUrgent, noTitle } = props;
  // get user info
  const { data: user } = useQuery({
    ...apiUser().me(),
  });
  const isPartner = useMemo(() => {
    return user?.data?.is_partner;
  }, [user]);
  const getParamPrice = (param: ParameterType) => {
    if (isUrgent) {
      if (isPartner) {
        return param.partner_urgent_price !== null
          ? Number(param.partner_urgent_price)
          : param.partner_price !== null
            ? Number(param.partner_price)
            : Number(param.price);
      } else {
        return Number(param.urgent_price);
      }
    } else {
      if (isPartner) {
        return param.partner_price !== null
          ? Number(param.partner_price)
          : Number(param.price);
      } else {
        return Number(param.price);
      }
    }
  };
  return (
    <>
      {!(noTitle ?? false) && (
        <h2 className="text-[19px] font-bold text-typography-gray lg:text-[22px]">
          اطلاعات پارامتر
        </h2>
      )}
      <Card
        color={"white"}
        className={`${noTitle ?? false ? "" : "py-3 lg:p-[24px]"} text-typography-main `}
      >
        <div className="flex flex-wrap gap-[12px]">
          {parameterList.length ? (
            parameterList.map((parameter, index) => (
              <LabelCard key={index}>
                <span className="font-bold">پارامتر {index + 1}</span>
                {`: ${parameter.name} `}(
                {/* {isUrgent
                  ? Number(parameter.urgent_price).toLocaleString()
                  : isPartner
                    ? parameter.partner_price === null
                      ? Number(parameter.price).toLocaleString()
                      : Number(parameter.partner_price).toLocaleString()
                    : Number(parameter.price).toLocaleString()} */}
                {getParamPrice(parameter).toLocaleString()}
                <span className="mr-1 text-[12px] font-[400]">ریال</span>)
              </LabelCard>
            ))
          ) : (
            <Card color={"info"} className="w-full">
              <p className="p-[16px] text-center text-[14px]">موردی یافت نشد</p>
            </Card>
          )}
        </div>
      </Card>
    </>
  );
};

export default ParameterInformation;
