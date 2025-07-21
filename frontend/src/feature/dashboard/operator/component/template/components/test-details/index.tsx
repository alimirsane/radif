import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { useEffect, useMemo, useRef, useState } from "react";

import { iranSans } from "@data/font";
import RequestCost from "../request-cost";
import ChildDetails from "./child-details";
import { apiUser } from "@api/service/user";
import ParentActions from "../parent-actions";
import { RequestPrint } from "../print-request";
import { InvoicePrint } from "../print-invoice";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@api/service/request";
import CustomerProfile from "../customer-profile";
import { ColorTypes } from "@kit/common/color-type";
import FinancialInformation from "../financial-information";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { useCurrentRequestHandler } from "@hook/current-request-handler";
import { CertificatePrint } from "@feature/dashboard/common/experiment-certificate";
import { Status } from "@kit/status";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";

const TestDetails = () => {
  const router = useRouter();
  const request_id = router.query.request_id ?? "";
  const [printType, setPrintType] = useState("");
  const [printTitle, setPrintTitle] = useState("");
  const [readyToPrint, setReadyToPrint] = useState(false); // new state
  // selected child request id
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  // current child request id
  const { childRequestId, setChildRequestId } = useCurrentRequestHandler();
  // request data
  const { data: request } = useQuery(
    apiRequest().getById(request_id.toString()),
  );
  // certificate data
  const { data: certificateData, refetch: refetchCertificateData } = useQuery(
    apiRequest().getCertificateById(
      request?.data?.child_requests
        ? request?.data?.child_requests[selectedChildIndex]?.id?.toString()
        : "",
    ),
  );
  useEffect(() => {
    if (router.query.certificate === "updated") {
      refetchCertificateData();
      delete router.query.certificate;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  // reset selected child
  useEffect(() => {
    setSelectedChildIndex(0);
  }, [router.query.request_id]);

  // useEffect(() => {
  //   if (!printType) {
  //     return;
  //   }
  //   window.scrollTo(0, 0);
  //   window.print();
  //   setPrintType("");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [printType]);
  // Trigger print with delay for content to render
  // useEffect(() => {
  //   if (printType) {
  //     const originalTitle = document.title;
  //     document.title = printTitle; // Set document title for the print

  //     window.scrollTo(0, 0);
  //     window.print();

  //     setTimeout(() => {
  //       setPrintType(""); // Reset print type
  //       document.title = originalTitle; // Reset original title after print
  //     }, 300); // Adjust delay to ensure rendering completion
  //   }
  // }, [printType, printTitle]);
  // Initiate print with type and title
  // const initiatePrint = (type: string, title: string) => {
  //   setPrintTitle(title);
  //   setPrintType(type);
  // };

  // ** use library for printing **
  const printRef = useRef<HTMLDivElement>(null);
  // print content
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: printTitle,
    onAfterPrint: () => {
      setPrintType("");
      setReadyToPrint(false);
    },
  });
  // Set readyToPrint to true when printType is set
  useEffect(() => {
    if (printType) {
      setReadyToPrint(true);
    }
  }, [printType]);
  // Trigger printing when readyToPrint is true
  useEffect(() => {
    if (readyToPrint) {
      handlePrint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToPrint]);
  // render component based on printType
  const renderedComponent = useMemo(() => {
    switch (printType) {
      case "request":
        return <RequestPrint request={request?.data} />;
      case "financialInvoice":
        return <InvoicePrint request={request?.data} invoiceType="مالی" />;
      case "customerInvoice":
        return <InvoicePrint request={request?.data} invoiceType="مشتری" />;
      case "certificate":
        return (
          <CertificatePrint
            request={
              request?.data?.child_requests &&
              request?.data?.child_requests[selectedChildIndex]
            }
            certifiateData={certificateData?.data}
          />
        );
      default:
        return <></>;
    }
  }, [printType, request, selectedChildIndex, certificateData]);

  // Get user info to check roles and filter requests
  const { data: user } = useQuery({
    ...apiUser().me(),
  });
  // Check if user has the 'ادمین' role
  const hasAdminRole = useMemo(() => {
    return user?.data?.role_obj?.some((role) => role.role_key === "admin");
  }, [user?.data]);
  // Check if user has the 'مدیریت' role
  const hasManagerRole = useMemo(() => {
    return user?.data?.role_obj?.some((role) => role.role_key === "manager");
  }, [user?.data]);
  // Check if user has the 'مدیر فنی' role
  const hasTechnicalRole = useMemo(() => {
    return user?.data?.role_obj?.some((role) => role.role_key === "technical");
  }, [user?.data]);
  // Check if user has the 'اپراتور' role
  const hasOperatorRole = useMemo(() => {
    return user?.data?.role_obj?.some((role) => role.role_key === "operator");
  }, [user?.data]);
  // Check if user has the 'پذیرش' role
  const hasReceptionRole = useMemo(() => {
    return user?.data?.role_obj?.some((role) => role.role_key === "reception");
  }, [user?.data]);

  // Check if user is only operator and technical -> so requests with 'در انتظار پرداخت' and 'در انتظار پذیرش' status muse be hide
  const isOnlyOperatorOrTechnical = useMemo(() => {
    return (
      (hasTechnicalRole || hasOperatorRole) &&
      !hasAdminRole &&
      !hasManagerRole &&
      !hasReceptionRole
    );
    // it means: !(hasAdminRole || hasManagerRole || hasReceptionRole)
  }, [
    hasTechnicalRole,
    hasOperatorRole,
    hasAdminRole,
    hasManagerRole,
    hasReceptionRole,
  ]);

  // Check if user is only operator
  const isOnlyOperator = useMemo(() => {
    return (
      hasOperatorRole &&
      !hasTechnicalRole &&
      !hasAdminRole &&
      !hasManagerRole &&
      !hasReceptionRole
    );
    // it means: !(hasAdminRole || hasManagerRole || hasReceptionRole || hasTechnicalRole)
  }, [
    hasTechnicalRole,
    hasOperatorRole,
    hasAdminRole,
    hasManagerRole,
    hasReceptionRole,
  ]);

  // Check if user is only reception -> so requests with 'در انتظار پرداخت' and 'در انتظار پذیرش' status muse be show
  const isOnlyReception = useMemo(() => {
    return (
      hasReceptionRole &&
      !hasAdminRole &&
      !hasManagerRole &&
      !hasTechnicalRole &&
      !hasOperatorRole
    );
    // it means: !(hasAdminRole || hasManagerRole || hasTechnicalRole || hasOperatorRole)
  }, [
    hasTechnicalRole,
    hasOperatorRole,
    hasAdminRole,
    hasManagerRole,
    hasReceptionRole,
  ]);

  return (
    <>
      {readyToPrint ? (
        <div ref={printRef} className={iranSans.className}>
          {renderedComponent}
        </div>
      ) : (
        <div id="print-container">
          <ParentActions
            request={request?.data}
            requestId={request?.data.id}
            isOnlyOperatorOrTechnical={isOnlyOperatorOrTechnical ?? false}
            requestPrintOnClick={
              () => {
                setPrintType("request");
                setPrintTitle(
                  request?.data.request_number?.toString() ?? "درخواست",
                );
              }
              // initiatePrint(
              //   "request",
              //   request?.data.request_number?.toString() ?? "درخواست",
              // )
            }
            financialInvoicePrintOnClick={
              () => {
                setPrintType("financialInvoice");
                setPrintTitle(
                  request?.data.request_number
                    ? `${request?.data.request_number}-${
                        request?.data?.latest_status_obj?.step_obj?.name ===
                          "در انتظار اپراتور" ||
                        request?.data?.latest_status_obj?.step_obj?.name ===
                          "در ‌انتظار پذیرش" ||
                        request?.data?.latest_status_obj?.step_obj?.name ===
                          "در انتظار پرداخت"
                          ? "پیش-فاکتور"
                          : "فاکتور-مالی"
                      }`
                    : `${
                        request?.data?.latest_status_obj?.step_obj?.name ===
                          "در انتظار اپراتور" ||
                        request?.data?.latest_status_obj?.step_obj?.name ===
                          "در ‌انتظار پذیرش" ||
                        request?.data?.latest_status_obj?.step_obj?.name ===
                          "در انتظار پرداخت"
                          ? "پیش-فاکتور"
                          : "فاکتور-مالی"
                      }`,
                );
              }
              // initiatePrint(
              //   "transaction",
              //   request?.data.request_number
              //     ? `${request?.data.request_number}-فاکتور`
              //     : "فاکتور",
              // )
            }
            customerInvoicePrintOnClick={() => {
              setPrintType("customerInvoice");
              setPrintTitle(
                request?.data.request_number
                  ? `${request?.data.request_number}-فاکتور-مشتری`
                  : "فاکتور-مشتری",
              );
            }}
          />
          <CustomerProfile
            customerData={request?.data?.owner_obj as CurrentUserType}
          />
          <RequestCost
            labsnet_discount={request?.data?.labsnet_discount}
            labsnet={request?.data?.labsnet}
            labsnet_code1={request?.data?.labsnet_code1 ?? ""}
            labsnet_code2={request?.data?.labsnet_code2 ?? ""}
            price={request?.data?.price}
            price_sample_returned={request?.data?.price_sample_returned}
            price_wod={request?.data?.price_wod}
            grant_request1={request?.data?.grant_request1}
            grant_request2={request?.data?.grant_request2}
            grant_request1_obj={request?.data?.grant_request1_obj}
            grant_request2_obj={request?.data?.grant_request2_obj}
            grant_request_discount={request?.data?.grant_request_discount}
            labsnet_result={request?.data?.labsnet_result}
            order_obj={request?.data?.order_obj}
            labsnet_status={request?.data?.labsnet_status}
            labsnet1_obj={request?.data?.labsnet1_obj}
            labsnet2_obj={request?.data?.labsnet2_obj}
            child_requests={request?.data?.child_requests}
            request_number={request?.data?.request_number}
          />
          {/* {request?.data?.status_objs &&
              request?.data?.status_objs[request?.data?.status_objs.length - 1]
                .step_obj.name !== "در انتظار اپراتور" && ( */}
          <FinancialInformation
            price={
              request?.data?.order_obj?.[request?.data?.order_obj?.length - 1]
                ?.remaining_amount
            }
            paymentData={request?.data?.order_obj?.[0]?.payment_record}
            is_returned={request?.data?.is_returned ?? false}
            payerId={request?.data?.owner}
            orderId={request?.data?.order_obj?.[0]?.id}
            requestStatus={request?.data?.latest_status_obj?.step_obj.name}
            isOnlyOperator={isOnlyOperator ?? false}
          />
          {/* )} */}
          <div>
            <span id="ChildrenTitle">
              <h3 className="back-gray flex flex-row items-center gap-2 pb-[8px] pt-[24px] text-[18px] font-bold text-typography-gray">
                آزمون‌های درخواست
                <span className="text-[14px] font-medium md:hidden">
                  ({request?.data?.child_requests?.length} آزمون)
                </span>
              </h3>
              <div className="mb-6 flex flex-row overflow-x-auto border-b-2 border-b-background-paper">
                {request?.data?.child_requests?.map((child, index) => (
                  <span
                    key={index}
                    onClick={() => {
                      setSelectedChildIndex(index);
                      setChildRequestId(child.id);
                    }}
                    className={`flex cursor-pointer flex-row items-center whitespace-nowrap rounded-t-[8px] ${
                      !!child?.status_objs?.length
                        ? selectedChildIndex === index
                          ? `bg-${
                              child?.latest_status_obj?.step_obj
                                ?.step_color as ColorTypes
                            } bg-opacity-90 text-common-white`
                          : `bg-${
                              child?.latest_status_obj?.step_obj
                                ?.step_color as ColorTypes
                            } text-${
                              child?.latest_status_obj?.step_obj
                                ?.step_color as ColorTypes
                            } bg-opacity-10`
                        : ""
                    } px-5 py-2 text-[14px]`}
                  >
                    {`${index + 1}.  ${child.experiment_obj?.name}`}
                    {!!child?.latest_status_obj &&
                      child?.latest_status_obj?.step_obj.name === "رد شده" && (
                        <span
                          className={`mr-2 flex flex-row items-center gap-1 rounded-2xl px-4 py-1 text-[12px] font-medium ${
                            selectedChildIndex === index
                              ? "bg-common-white text-error"
                              : "bg-error text-common-white"
                          }`}
                        >
                          <SvgIcon
                            strokeColor={
                              selectedChildIndex === index ? "error" : "white"
                            }
                            className={"[&_svg]:h-[10px] [&_svg]:w-[10px]"}
                          >
                            <IcClose />
                          </SvgIcon>
                          {child?.latest_status_obj?.step_obj.name}
                        </span>
                      )}
                  </span>
                ))}
              </div>
            </span>
            <ChildDetails
              request={
                request?.data?.child_requests &&
                request?.data?.child_requests[selectedChildIndex]
              }
              certificateData={certificateData?.data?.certificate_obj}
              parentRequestNumber={request?.data?.request_number}
              onClick={() => {
                setPrintType("certificate");
                setPrintTitle(
                  request?.data.request_number
                    ? `${request?.data?.child_requests?.[selectedChildIndex]?.request_number}-گواهینامه`
                    : "گواهینامه",
                );
                // initiatePrint(
                //   "certificate",
                //   request?.data.request_number
                //     ? `${request?.data?.child_requests?.[selectedChildIndex]?.request_number}-گواهینامه`
                //     : "گواهینامه",
                // );
              }}
              isOnlyOperatorOrTechnical={isOnlyOperatorOrTechnical ?? false}
              isOnlyOperator={isOnlyOperator ?? false}
              isOnlyReception={isOnlyReception ?? false}
              parentStatus={
                request?.data?.latest_status_obj?.step_obj?.name ?? ""
              }
              parentRemainingAmount={Number(
                request?.data?.order_obj?.[request?.data?.order_obj?.length - 1]
                  ?.remaining_amount,
              )}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TestDetails;
