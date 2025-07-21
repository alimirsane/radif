import React from "react";
import RequestCost from "../request-cost";
import PrintSample from "../print-sample";
import CustomerProfile from "../customer-profile";
import RequestParameters from "../request-parameters";
import TestSpecifications from "../test-specifications";
import DiscountInformation from "../discount_information";
import FinancialInformation from "../financial-information";
import { RequestType } from "@api/service/request/type";
import { CurrentUserType } from "@api/service/user/type/current-user";
import RequestAppointments from "../request-appointment";

export const RequestPrint = (props: { request: RequestType | undefined }) => {
  const { request } = props;
  return (
    <>
      {request?.child_requests
        ?.filter(
          (child) => child?.latest_status_obj?.step_obj?.name !== "رد شده",
        )
        ?.map((child, index) => (
          <div
            key={index}
            className="no-padding page-break hidden w-full text-[9px]"
            id="print-request"
          >
            <div id="print-container" className="mt-3">
              <CustomerProfile
                customerData={request?.owner_obj as CurrentUserType}
              />
              <RequestCost
                labsnet_discount={request?.labsnet_discount}
                price={request?.price}
                price_sample_returned={request?.price_sample_returned}
                price_wod={request?.price_wod}
                grant_request_discount={request?.grant_request_discount}
                order_obj={request?.order_obj}
              />
              {/* {
              request?.latest_status_obj.step_obj
                .name !== "در انتظار اپراتور" && ( */}
              <FinancialInformation
                price={
                  request?.order_obj?.[request?.order_obj?.length - 1]
                    ?.remaining_amount
                }
                paymentData={request?.order_obj?.[0]?.payment_record}
                is_returned={request?.is_returned ?? false}
                payerId={request?.owner}
                orderId={request?.order_obj?.[0]?.id}
                requestStatus={request?.latest_status_obj?.step_obj.name}
              />
              {/* )} */}
              <TestSpecifications
                // request_number={child?.request_number}
                request_number={request?.request_number}
                experiment_obj={child?.experiment_obj}
                delivery_date={child?.delivery_date}
                is_urgent={child?.is_urgent}
                is_sample_returned={child?.is_sample_returned ?? false}
                price={child?.price}
                latest_status_obj={child?.latest_status_obj}
                is_cancelled={child?.is_cancelled}
              />
              <DiscountInformation
                discount={child?.discount}
                // discount_description={request?.data?.discount_description}
                // is_sample_returned={request?.data?.is_sample_returned ?? false}
                price={child?.price}
                price_sample_returned={child?.price_sample_returned}
                price_wod={child?.price_wod}
                discount_history_objs={child?.discount_history_objs}
                test_duration={child?.test_duration}
                test_unit_type={child?.experiment_obj?.test_unit_type}
              />
              {child?.experiment_obj?.need_turn && (
                <RequestAppointments
                  appointments_obj={child?.appointments_obj ?? []}
                />
              )}
              <RequestParameters request_paramaters={child?.parameter_obj} />
              <div className="page-break-inside">
                <PrintSample
                  samples={child?.forms}
                  requestId={child?.request_number?.toString()}
                  is_sample_returned={request?.is_sample_returned ?? false}
                  status={child?.latest_status_obj?.step_obj.name ?? ""}
                />
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
