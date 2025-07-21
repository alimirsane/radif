import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

import { Card } from "@kit/card";
import Tooltip from "@kit/tooltip";
import { Status } from "@kit/status";
import { SvgIcon } from "@kit/svg-icon";
import Badge from "@feature/kits/badge";
import { ListItemType } from "../../types";
import { DateHandler } from "@utils/date-handler";
import { ColorTypes } from "@kit/common/color-type";
import { RequestTypeForm } from "@api/service/request/type";
import {
  IcCertificate,
  IcCloseCircle,
  IcEye,
  IcPrint,
} from "@feature/kits/common/icons";
import { ParameterType } from "@api/service/parameter/type";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@api/service/request";
import { useReactToPrint } from "react-to-print";
import { CertificatePrint } from "@feature/dashboard/common/experiment-certificate";
import { iranSans } from "@data/font";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

const ChildItem = (
  props: ListItemType & {
    cancelRequest: MouseEventHandler<HTMLDivElement> | undefined;
  },
) => {
  const { className, onClick, item, expandItem, cancelRequest } = props;
  const openModal = useModalHandler((state) => state.openModal);

  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "دقیقه" },
      { value: "hour", name: "ساعت" },
    ];
  }, []);
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
  const getParamPrice = (
    param: ParameterType,
    isUrgent: boolean,
    isPartner: boolean,
  ) => {
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

  const [printType, setPrintType] = useState("");
  const [printTitle, setPrintTitle] = useState("");
  const [readyToPrint, setReadyToPrint] = useState(false); // new state
  // certificate data
  const { data: certifiateData, refetch: refetchCertificateData } = useQuery({
    ...apiRequest().getCertificateById(item?.id?.toString() ?? ""),
    enabled: false,
  });
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
  const handleCertificatePrint = async () => {
    try {
      await refetchCertificateData();
      setPrintType("certificate");
    } catch (error) {
      console.error("خطا در دریافت داده‌های گواهینامه:", error);
    }
  };
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
      case "certificate":
        return (
          <CertificatePrint
            request={item}
            certifiateData={certifiateData?.data}
          />
        );
      default:
        return <></>;
    }
  }, [printType, item, certifiateData]);
  // appointments status
  const appointmentStatus = useMemo(() => {
    return {
      "reserved-active": "رزرو شده",
      "reserved-suspended": "رزرو تعلیق شده",
      "canceled-active": "کنسل شده",
      "canceled-suspended": "کنسلی تعلیق شده",
      "pending-active": "پیش پرداخت",
      "pending-suspended": "پیش پرداخت تعلیق شده",
    };
  }, []);

  return (
    <>
      {readyToPrint && (
        <div ref={printRef} className={iranSans.className}>
          {renderedComponent}
        </div>
      )}
      <Card
        variant={"outline"}
        color={"white"}
        className={twMerge(
          "p-[12px] text-[14px] text-typography-main transition-all duration-500 hover:shadow-md lg:border-0 lg:p-0 hover:lg:shadow-none",
          className,
        )}
      >
        <Card
          className={
            "flex w-full flex-col transition-all duration-500 hover:bg-opacity-60 lg:border-0 lg:bg-background-paper-light lg:px-[24px] lg:py-[24px] hover:lg:bg-background-paper-dark"
          }
        >
          <div className="flex flex-col justify-between lg:flex-row lg:items-center">
            <span className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
              <h6 className="font-bold">
                آزمون{" "}
                {item?.experiment_obj?.name
                  ? item.experiment_obj?.name +
                    " (" +
                    item?.experiment_obj?.name_en +
                    ")"
                  : "---"}
              </h6>
              <span className="flex w-full flex-row-reverse justify-between gap-2 lg:w-auto">
                <span>
                  {item?.is_urgent && (
                    <Badge color="error" className={"bg-opacity-80"}>
                      فوری
                    </Badge>
                  )}
                </span>
                <span className="lg:hidden">
                  <Status
                    color={
                      item.latest_status_obj?.step_obj.step_color as ColorTypes
                    }
                  >
                    {item.latest_status_obj?.step_obj.name !== "رد شده"
                      ? item.latest_status_obj?.step_obj.name
                      : `${item.latest_status_obj?.step_obj.name} ${item.is_cancelled ? "توسط کاربر" : ""}`}
                  </Status>
                </span>
                {/* {item?.is_sample_returned && (
                <Badge color="warning" className="bg-opacity-80">
                  عودت نمونه
                </Badge>
              )} */}
              </span>
            </span>

            <span className="hidden lg:block">
              {item?.has_prepayment ? (
                <Status className="mr-auto lg:mr-0" color="pending">
                  در انتظار پیش پرداخت
                </Status>
              ) : (
                <Status
                  className="mr-auto lg:mr-0"
                  color={
                    item.latest_status_obj?.step_obj.step_color as ColorTypes
                  }
                >
                  {item.latest_status_obj?.step_obj.name !== "رد شده"
                    ? item.latest_status_obj?.step_obj.name
                    : `${item.latest_status_obj?.step_obj.name} ${item.is_cancelled ? "توسط کاربر" : ""}`}
                </Status>
              )}
            </span>
          </div>
          <div className="flex w-full flex-col flex-wrap gap-3 pt-3 text-[14px] md:flex-row">
            <div className="flex w-full flex-row flex-wrap items-center whitespace-nowrap lg:w-[22%]">
              <h6 className="font-[500] text-typography-gray">
                هزینه هر{" "}
                {
                  unitsList.find(
                    (unit) =>
                      unit.value === item?.experiment_obj?.test_unit_type ||
                      unit.name === item?.experiment_obj?.test_unit_type,
                  )?.name
                }
                :
              </h6>
              <span className="text-wrap pr-1">
                {item?.parameter_obj
                  ?.reduce(
                    (acc, param) =>
                      acc +
                      getParamPrice(
                        param,
                        item.is_urgent ?? false,
                        item.owner_obj?.is_partner ?? false,
                      ),
                    0,
                  )
                  .toLocaleString()}{" "}
                ریال
              </span>
            </div>
            <div className="flex w-full flex-row flex-wrap items-center whitespace-nowrap lg:w-[22%]">
              <h6 className="font-[500] text-typography-gray">میزان تخفیف:</h6>
              <span className="text-wrap pr-1">
                {item.discount}
                {item.discount !== 0 && " درصد"}
              </span>
            </div>
            <div className="flex w-full flex-row flex-wrap items-center whitespace-nowrap lg:w-[22%]">
              <h6 className="font-[500] text-typography-gray">هزینه آزمون:</h6>
              <span className="text-wrap pr-1">
                {Number(item?.price).toLocaleString()} ریال
              </span>
              {item.is_returned && (
                <Badge
                  color="error"
                  className={"mr-2 bg-opacity-10 text-error"}
                >
                  استرداد شده
                </Badge>
              )}
            </div>
            {item?.experiment_obj?.need_turn && (
              <div className="flex w-full flex-row flex-wrap items-center whitespace-nowrap lg:w-[30%]">
                <h6 className="font-[500] text-typography-gray">نوبت:</h6>
                {item?.appointments_obj?.length === 0 ? (
                  <span className="pr-1">نوبتی رزرو نشده است.</span>
                ) : (
                  <>
                    {item?.appointments_obj?.length === 1 ? (
                      item?.appointments_obj?.map((item, index) => (
                        <span key={index} className="text-wrap pr-1">
                          {DateHandler.formatDate(item?.date, {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })}{" "}
                          (ساعت{" "}
                          {item?.end_time?.split(":")?.[0] +
                            ":" +
                            item?.end_time?.split(":")?.[1]}
                          {" - "}
                          {item?.start_time?.split(":")?.[0] +
                            ":" +
                            item?.start_time?.split(":")?.[1]}
                          )
                          <span
                            className={`mr-2 whitespace-nowrap rounded-full px-3 py-[2px] ${item.status}-${item?.extra_fields?.queue_status} text-[12px]`}
                          >
                            {
                              appointmentStatus[
                                `${item.status}-${item?.extra_fields?.queue_status}` as keyof typeof appointmentStatus
                              ]
                            }
                          </span>
                        </span>
                      ))
                    ) : (
                      <span
                        className="cursor-pointer px-1 text-[13px] italic text-info"
                        onClick={() => {
                          openModal(ModalKeys.CUSTOMER_APPOINTMENTS_INFO, {
                            appointments_obj: item?.appointments_obj,
                            experiment_name: item?.experiment_obj?.name,
                          });
                        }}
                      >
                        مشاهده نوبت‌ها
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex w-full flex-col flex-wrap gap-3 pt-3 text-[14px] md:flex-row">
            {item?.experiment_obj?.test_unit_type !== "sample" &&
              item?.experiment_obj?.test_unit_type !== "نمونه" && (
                <div className="flex w-full flex-row flex-wrap items-center whitespace-nowrap lg:w-[22%]">
                  <h6 className="font-[500] text-typography-gray">
                    مدت زمان انجام آزمون:
                  </h6>
                  <span className="text-wrap pr-1">
                    {item?.test_duration}{" "}
                    {
                      unitsList.find(
                        (unit) =>
                          unit.value === item?.experiment_obj?.test_unit_type ||
                          unit.name === item?.experiment_obj?.test_unit_type,
                      )?.name
                    }
                  </span>
                </div>
              )}

            {(item?.experiment_obj?.test_unit_type === "sample" ||
              item?.experiment_obj?.test_unit_type === "نمونه") && (
              <div className="flex w-full flex-row flex-wrap items-center whitespace-nowrap lg:w-[22%]">
                <h6 className="font-[500] text-typography-gray">
                  تعداد نمونه‌ها:
                </h6>
                <span className="text-wrap pr-1">
                  {getSamplesFlattenedForms(item?.forms)?.length} نمونه
                </span>
              </div>
            )}
            <div className="flex w-full flex-row flex-wrap items-center whitespace-nowrap lg:w-[22%]">
              <h6 className="font-[500] text-typography-gray">
                تاریخ دریافت نمونه:
              </h6>
              <span className="text-wrap pr-1">
                {item.delivery_date
                  ? DateHandler.formatDate(item.delivery_date, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "__"}
              </span>
            </div>
            <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
              <h6 className="font-[500] text-typography-gray">
                تاریخ پاسخ دهی:
              </h6>
              <span className="text-wrap pr-1">
                {`${
                  item.is_urgent
                    ? item.experiment_obj?.estimated_urgent_result_time || "_"
                    : item.experiment_obj?.estimated_result_time || "_"
                } روز کاری پس از دریافت نمونه`}
              </span>
            </div>

            <div className="mr-auto flex flex-row justify-end gap-2 lg:px-[2px]">
              <Tooltip message="نمایش جزئیات بیشتر">
                <SvgIcon
                  onClick={onClick}
                  strokeColor={"primary"}
                  className={"cursor-pointer [&_svg]:h-[28px] [&_svg]:w-[28px]"}
                >
                  <IcEye />
                </SvgIcon>
              </Tooltip>
              {item?.latest_status_obj?.step_obj.name === "تکمیل شده" && (
                <Tooltip message="گواهینامه آزمون">
                  <SvgIcon
                    onClick={() => {
                      // if (item?.latest_status_obj?.step_obj.name !== "تکمیل شده")
                      //   return;
                      // setPrintType("certificate");
                      setPrintTitle(
                        item?.request_number
                          ? `${item?.request_number}-گواهینامه`
                          : "گواهینامه",
                      );
                      handleCertificatePrint();
                    }}
                    fillColor={"primary"}
                    className={`${
                      item?.latest_status_obj?.step_obj.name !== "تکمیل شده"
                        ? "cursor-not-allowed opacity-45"
                        : "cursor-pointer"
                    }  ml-[2px] [&_svg]:h-[24px] [&_svg]:w-[24px]`}
                  >
                    <IcCertificate />
                  </SvgIcon>
                </Tooltip>
              )}
              <Tooltip message="لغو آزمون">
                {item.latest_status_obj?.step_obj.name ===
                "در انتظار اپراتور" ? (
                  <SvgIcon
                    onClick={cancelRequest}
                    fillColor={"primary"}
                    className={
                      "cursor-pointer [&_svg]:h-[22px] [&_svg]:w-[22px]"
                    }
                  >
                    <IcCloseCircle />
                  </SvgIcon>
                ) : (
                  <SvgIcon
                    fillColor={"primary"}
                    className={
                      "cursor-not-allowed opacity-55 [&_svg]:h-[22px] [&_svg]:w-[22px]"
                    }
                  >
                    <IcCloseCircle />
                  </SvgIcon>
                )}
              </Tooltip>
            </div>
          </div>
        </Card>
      </Card>
    </>
  );
};

export default ChildItem;
