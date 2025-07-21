import { useCurrentRequestHandler } from "@hook/current-request-handler";
import { apiRequest } from "@api/service/request";
import { useQuery } from "@tanstack/react-query";
import { apiFormResponse } from "@api/service/form-response";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { ParameterType } from "@api/service/parameter/type";

// interface CartSampleProps {
//   numberOfSample: number;
// }

const CartSamples = () =>
  // props: CartSampleProps
  {
    // const { numberOfSample } = props;
    const router = useRouter();
    const requestId = useCurrentRequestHandler((state) => state.requestId);
    const isPartner = useCurrentRequestHandler((state) => state.isPartner);
    const { data: currentRequest } = useQuery({
      ...apiFormResponse().getAll({ request: requestId }),
      enabled: requestId !== undefined,
    });
    const { data: requestData, refetch } = useQuery({
      ...apiRequest().getById(requestId?.toString()),
    });
    useEffect(() => {
      refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
      if (router.query.samples === "list") {
        refetch();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.samples]);
    const getParamPrice = (param: ParameterType) => {
      if (requestData?.data?.is_urgent) {
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
      <div className="mt-[20px] flex w-full flex-col items-center gap-[12px] overflow-x-auto rounded-[8px] border-[1px] border-common-black/10 bg-common-white p-[16px] md:flex-row md:justify-center md:gap-[40px]">
        {(requestData?.data?.experiment_obj?.test_unit_type === "sample" ||
          requestData?.data?.experiment_obj?.test_unit_type === "نمونه") && (
          <>
            <div className="flex flex-row items-center gap-2 md:flex-col md:gap-0">
              <span className="text-nowrap pb-1 text-[14px]">
                تعداد نمونه‌ها
              </span>
              <span className="text-nowrap text-center text-[16px] font-bold">
                {/* {currentRequest?.data.length ?? 0} */}
                {/* {currentRequest?.data.reduce((accumulator, item) => {
              const responseCount = item?.response_count ?? 0;
              return accumulator + (responseCount === 0 ? 1 : responseCount);
            }, 0)} */}
                {requestData?.data?.is_completed
                  ? currentRequest?.data.length ?? 0
                  : currentRequest?.data.reduce((accumulator, item) => {
                      const responseCount = item?.response_count ?? 0;
                      return (
                        accumulator + (responseCount === 0 ? 1 : responseCount)
                      );
                    }, 0)}
              </span>
            </div>
            <div className="h-[1px] w-full bg-common-black/15 md:h-[40px] md:w-[1px]" />
          </>
        )}
        <div className="flex flex-row items-center gap-2 md:flex-col md:gap-0">
          <span className="text-nowrap pb-1 text-[14px]">
            هزینه هر{" "}
            {
              unitsList.find(
                (unit) =>
                  unit.value ===
                    requestData?.data?.experiment_obj?.test_unit_type ||
                  unit.name ===
                    requestData?.data?.experiment_obj?.test_unit_type,
              )?.name
            }
          </span>
          <span className="text-nowrap text-center text-[16px] font-bold">
            {requestData?.data?.parameter_obj
              ?.reduce(
                (acc, param) =>
                  // requestData?.data?.is_urgent
                  //   ? acc + parseInt(param.urgent_price ?? "")
                  //   : acc +
                  //     (isPartner
                  //       ? param.partner_price === null
                  //         ? parseInt(param.price)
                  //         : parseInt(param.partner_price)
                  //       : parseInt(param.price)),
                  acc + getParamPrice(param),
                0,
              )
              .toLocaleString()}{" "}
            ریال
          </span>
        </div>
        <div className="h-[1px] w-full bg-common-black/15 md:h-[40px] md:w-[1px]" />
        <div className="flex flex-row items-center gap-2 md:flex-col md:gap-0">
          <span className="text-nowrap pb-1 text-[14px]">هزینه آزمون</span>
          <span className="text-nowrap text-center text-[16px] font-bold">
            {parseInt(requestData?.data?.price ?? "0").toLocaleString()} ریال
            {/* {currentRequest?.data?.[0]?.request_obj?.price
              ? (
                  parseInt(currentRequest?.data?.[0]?.request_obj?.price) *
                  currentRequest?.data.length
                ).toLocaleString()
              : 0}{" "}
            ریال */}
          </span>
        </div>
        {requestData?.data.experiment_obj?.need_turn && (
          <>
            <div className="h-[1px] w-full bg-common-black/15 md:h-[40px] md:w-[1px]" />
            <div className="flex flex-row items-center gap-2 md:flex-col md:gap-0">
              <span className="text-nowrap pb-1 text-[14px]">
                هزینه پیش پرداخت
              </span>
              <span className="text-nowrap text-center text-[16px] font-bold">
                {parseInt(
                  requestData?.data.experiment_obj?.prepayment_amount ?? "0",
                ).toLocaleString()}{" "}
                ریال
              </span>
            </div>
          </>
        )}
      </div>
    );
  };

export default CartSamples;
