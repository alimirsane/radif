import React, { useCallback, useMemo } from "react";

import { Card } from "@kit/card";
import { usePayOrder } from "@hook/pay-order";
import { RequestType, RequestTypeForm } from "@api/service/request/type";
import Badge from "@feature/kits/badge";
import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import Tooltip from "@kit/tooltip";
import { SvgIcon } from "@kit/svg-icon";
import { IcEye } from "@feature/kits/common/icons";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { ParameterType } from "@api/service/parameter/type";

const Costs = ({ request }: { request: RequestType | undefined }) => {
  const price = usePayOrder((state) => state.price);
  const openModal = useModalHandler((state) => state.openModal);
  // get user info
  const { data: user } = useQuery({
    ...apiUser().me(),
  });
  const isPartner = useMemo(() => {
    return user?.data?.is_partner;
  }, [user]);
  // calculate count of samples and copies
  const getSamplesFlattenedForms = useCallback((forms: any) => {
    // Recursive function to flatten forms
    const flattenForm = (
      form: RequestTypeForm,
    ): Pick<RequestTypeForm, "id" | "form_number">[] => {
      // Flatten the current form and its children
      const currentForm = {
        id: form.id,
        form_number: form.form_number,
      };
      const childrenForms = form.children?.flatMap(flattenForm) || [];
      // Return the current form along with all its flattened children
      return [currentForm, ...childrenForms];
    };
    // Flatten all the forms in the samples array
    return forms.flatMap(flattenForm) || [];
  }, []);
  const getParamPrice = (param: ParameterType, child: RequestType) => {
    if (child?.is_urgent) {
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
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "دقیقه" },
      { value: "hour", name: "ساعت" },
    ];
  }, []);
  return (
    <Card
      variant={"outline"}
      className={
        "mt-[16px] h-full px-[26px] pb-[18px] pt-[30px] text-typography-main md:mt-0"
      }
    >
      <div className="flex flex-col pb-[12px] text-[16px]">
        <span className="flex flex-row items-center justify-center gap-2 rounded-[8px] bg-background-paper py-[12px]">
          <h6 className="flex flex-row gap-2 text-[15px] font-bold">
            <span>کد درخواست: </span>
            {request?.request_number}
          </h6>
        </span>
      </div>
      <div className="hidden border-b-[1px] border-common-black/10 lg:block">
        <div className="flex w-full flex-row justify-between gap-5 overflow-x-auto whitespace-nowrap pb-3 text-center text-[15px] font-bold text-common-gray lg:gap-0">
          <span className="w-full border-common-black/10 lg:w-[18%] lg:border-l-[1px]">
            آزمون
          </span>
          <span className="w-full border-common-black/10 lg:w-[18%] lg:border-l-[1px]">
            پارامتر
          </span>
          <span className="w-full border-common-black/10 lg:w-[18%] lg:border-l-[1px]">
            هزینه هر واحد
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
          <span className="w-full border-common-black/10 lg:w-[10%] lg:border-l-[1px]">
            زمان/نمونه
          </span>
          <span className="w-full border-common-black/10 lg:w-[18%] lg:border-l-[1px]">
            تخفیف آزمون
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
          <span className="w-full lg:w-[18%]">
            هزینه نهایی آزمون
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>
      </div>
      {/* filter canceled requests */}
      {request?.child_requests
        ?.filter(
          (child) => child?.latest_status_obj?.step_obj?.name !== "رد شده",
        )
        ?.map((child, index) => (
          <div key={index} className={`flex flex-col`}>
            {child?.parameter_obj?.map((param, subindex) => (
              <div
                key={subindex}
                className={`flex w-full justify-between border-b-[1px] border-common-black/10 py-[12px]`}
              >
                <div
                  key={index}
                  className="whitespace-wrap flex w-full flex-col flex-nowrap items-center justify-between gap-2 overflow-x-auto text-center text-[15px] lg:flex-row lg:gap-0 lg:text-[14px]"
                >
                  <span className="flex w-full flex-row items-center gap-1 border-common-black/10 lg:w-[18%] lg:justify-center lg:border-l-[1px]">
                    <span className="ml-1 font-medium text-common-gray lg:hidden">
                      آزمون:
                    </span>
                    {child?.experiment_obj?.name}

                    {child?.is_urgent && <Badge color="error">فوری</Badge>}
                  </span>
                  <span className="flex w-full justify-start border-common-black/10 lg:w-[18%] lg:justify-center lg:border-l-[1px]">
                    <span className="ml-1 font-medium text-common-gray lg:hidden">
                      پارامتر:
                    </span>
                    {param.name}
                    {/* {`${param.name} (${param.name_en})`} */}
                  </span>
                  <span className="flex w-full justify-start border-common-black/10 lg:w-[18%] lg:justify-center lg:border-l-[1px]">
                    <span className="ml-1 font-medium text-common-gray lg:hidden">
                      هزینه هر واحد:
                    </span>
                    {
                      // Number(
                      //   child?.is_urgent
                      //     ? param.urgent_price
                      //     : isPartner
                      //       ? param.partner_price === null
                      //         ? param.price
                      //         : param.partner_price
                      //       : param.price,
                      // )
                      getParamPrice(param, child).toLocaleString()
                    }
                    <span className="mr-1 font-medium lg:hidden">ریال</span>
                  </span>
                  {(child?.experiment_obj?.test_unit_type === "نمونه" ||
                    child?.experiment_obj?.test_unit_type === "sample") && (
                    <span className="flex w-full justify-start border-common-black/10 lg:w-[10%] lg:justify-center lg:border-l-[1px]">
                      <span className="ml-1 font-medium text-common-gray lg:hidden">
                        تعداد نمونه:
                      </span>
                      {getSamplesFlattenedForms(child?.forms)?.length}
                    </span>
                  )}
                  {child?.experiment_obj?.test_unit_type !== "نمونه" &&
                    child?.experiment_obj?.test_unit_type !== "sample" && (
                      <span className="flex w-full justify-start border-common-black/10 lg:w-[10%] lg:justify-center lg:border-l-[1px]">
                        <span className="ml-1 font-medium text-common-gray lg:hidden">
                          زمان انجام:
                        </span>
                        {child?.test_duration}{" "}
                        {
                          unitsList.find(
                            (unit) =>
                              unit.value ===
                                child?.experiment_obj?.test_unit_type ||
                              unit.name ===
                                child?.experiment_obj?.test_unit_type,
                          )?.name
                        }
                      </span>
                    )}
                  <span className="flex w-full justify-start border-common-black/10 lg:w-[18%] lg:justify-center lg:border-l-[1px]">
                    <span className="ml-1 font-medium text-common-gray lg:hidden">
                      تخفیف آزمون:
                    </span>
                    {(
                      Number(child?.price_wod) *
                      (child?.discount ? child?.discount / 100 : 0)
                    ).toLocaleString()}
                  </span>
                  <span className="flex w-full justify-start lg:w-[18%] lg:justify-center">
                    <span className="ml-1 font-medium text-common-gray lg:hidden">
                      هزینه نهایی آزمون:
                    </span>
                    {
                      //   Number(
                      //   child?.is_urgent
                      //     ? param.urgent_price
                      //     : isPartner
                      //       ? param.partner_price === null
                      //         ? param.price
                      //         : param.partner_price
                      //       : param.price,
                      // )
                      (
                        (getParamPrice(param, child) *
                          getSamplesFlattenedForms(child?.forms)?.length *
                          (100 - Number(child?.discount ?? 0))) /
                        100
                      ).toLocaleString()
                    }
                    <span className="mr-1 font-medium lg:hidden">ریال</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      <div className="flex flex-col justify-between border-t-[3px] border-common-black/10 text-center text-[15px] font-bold">
        <div className="flex w-full flex-row py-3">
          <span className="hidden w-[64%] border-l-[1px] border-common-black/10 lg:block"></span>
          <span className="w-full border-l-[1px] border-common-black/10 text-common-gray lg:w-[18%]">
            مجموع هزینه‌ آزمون‌ها
          </span>
          <span className="w-full lg:w-[18%]">
            {Number(request?.price_wod).toLocaleString()}
          </span>
        </div>
        {/* <div className="flex w-full flex-row border-t-[1px] border-common-black/10 py-3 lg:gap-5">
          <span className="hidden w-1/5 lg:block"></span>
          <span className="hidden w-1/5 lg:block"></span>
          <span className="hidden w-1/5 border-l-[1px] border-common-black/10 lg:block"></span>
          <span className="w-full border-l-[1px] border-common-black/10 text-common-gray lg:w-1/5">
            {request?.discount} درصد تخفیف
          </span>
          <span className="w-full lg:w-1/5">
            {(
              Number(request?.price_wod) *
              (request?.discount ? request?.discount / 100 : 0)
            ).toLocaleString()}
          </span>
        </div> */}
        <div className="flex w-full flex-row border-t-[1px] border-common-black/10 py-3">
          <span className="hidden w-[64%] border-l-[1px] border-common-black/10 lg:block"></span>
          <span className="w-full border-l-[1px] border-common-black/10 text-common-gray  lg:w-[18%]">
            هزینه ارسال
          </span>
          <span className="w-full lg:w-[18%]">
            {Number(request?.price_sample_returned).toLocaleString()}
          </span>
        </div>
        <div className="flex w-full flex-row border-t-[1px] border-common-black/10 py-3">
          <span className="hidden w-[64%] border-l-[1px] border-common-black/10 lg:block"></span>
          <span className="flex w-full flex-row justify-center gap-1 border-l-[1px] border-common-black/10 text-common-gray lg:w-[18%]">
            کل گرنت لبزنت
            <Tooltip message="مشاهده گرنت‌ها">
              <SvgIcon
                onClick={() => {
                  openModal(ModalKeys.LABSNET_GRANTS_LIST, {
                    labsnet: request?.labsnet,
                    labsnet_code1: request?.labsnet_code1,
                    labsnet_code2: request?.labsnet_code2,
                  });
                }}
                strokeColor={"black"}
                className={
                  "mb-1 cursor-pointer opacity-50 [&_svg]:h-[17px] [&_svg]:w-[17px]"
                }
              >
                <IcEye />
              </SvgIcon>
            </Tooltip>
          </span>
          <span className="w-full lg:w-[18%]">
            {Number(request?.labsnet_discount).toLocaleString()}
          </span>
        </div>
        <div className="flex w-full flex-row border-t-[1px] border-common-black/10 py-3">
          <span className="hidden w-[64%] border-l-[1px] border-common-black/10 lg:block"></span>
          <span className="flex w-full flex-row justify-center gap-1 border-l-[1px] border-common-black/10 text-common-gray lg:w-[18%]">
            کل گرنت پژوهشی
            <Tooltip message="مشاهده گرنت‌ها">
              <SvgIcon
                onClick={() => {
                  openModal(ModalKeys.RESEARCH_GRANTS_LIST, {
                    grant_request1: request?.grant_request1,
                    grant_request2: request?.grant_request2,
                    grant_record1: request?.grant_request1_obj,
                    grant_record2: request?.grant_request2_obj,
                  });
                }}
                strokeColor={"black"}
                className={
                  "cursor-pointer opacity-50 [&_svg]:h-[17px] [&_svg]:w-[17px]"
                }
              >
                <IcEye />
              </SvgIcon>
            </Tooltip>
          </span>
          <span className="w-full lg:w-[18%]">
            {Number(request?.grant_request_discount).toLocaleString()}
          </span>
        </div>
        <div className="flex w-full flex-row border-t-[1px] border-common-black/10 pt-3">
          <span className="hidden w-[64%] border-l-[1px] border-common-black/10 lg:block"></span>
          <span className="w-full border-l-[1px] border-common-black/10 text-common-gray lg:w-[18%]">
            هزینه نهایی
          </span>
          <span className="w-full lg:w-[18%]">
            {Number(request?.price).toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default Costs;
