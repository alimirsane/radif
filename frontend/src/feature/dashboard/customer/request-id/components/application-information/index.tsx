import { Card } from "@kit/card";
import { Status } from "@kit/status";
import Badge from "@feature/kits/badge";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@api/service/request";
import { DateHandler } from "@utils/date-handler";
import { ColorTypes } from "@kit/common/color-type";
import Content from "@feature/dashboard/customer/list-requests/components/list-item/content";
import { useMemo } from "react";

const ApplicationInformation = () => {
  const router = useRouter();
  // get request data
  const { data: request, isLoading: requestLoading } = useQuery(
    apiRequest().getById(router?.query.id ? router?.query.id.toString() : ""),
  );
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "زمان (دقیقه)" },
      { value: "hour", name: "زمان (ساعت)" },
    ];
  }, []);
  return (
    <div className="lg:mt-[32px]">
      <h2 className="text-[19px] font-bold text-typography-gray lg:text-[22px]">
        اطلاعات درخواست
      </h2>
      <Card color={"white"} className="py-3 text-typography-main lg:p-[24px] ">
        <div className="w-full lg:flex lg:flex-row-reverse lg:justify-end lg:gap-[16px]">
          <div className="mt-[16px] grid grid-cols-1 gap-[16px] sm:grid-cols-3 lg:mt-0 lg:w-[60%]">
            <Card color={"paper"} className={"p-[16px]"}>
              <p className="mb-[6px] text-[16px] font-bold">نوع واحد آزمون</p>
              <p className="text-[14px]">
                {unitsList.find(
                  (unit) =>
                    unit.value === request?.data.experiment_obj?.test_unit_type,
                )?.name ?? request?.data.experiment_obj?.test_unit_type}
              </p>
            </Card>
            <Card color={"paper"} className={"p-[16px]"}>
              <p className="mb-[6px] text-[16px] font-bold">شماره درخواست</p>
              <p className="text-[14px]">
                {request?.data.request_number?.split("-")?.[0]}-
                {request?.data.request_number?.split("-")?.[1]}
              </p>
            </Card>
            <div className="row-start-1 flex flex-row items-start justify-start gap-[16px] lg:row-auto lg:items-center lg:justify-end">
              {/* <Status color={"paper"}>در انتظار اپراتور</Status> */}
              {/* {getStatus(request?.data.status)} */}
              {request?.data?.has_prepayment ? (
                <Status className="mr-auto lg:mr-0" color="pending">
                  در انتظار پیش پرداخت
                </Status>
              ) : (
                <Status
                  color={
                    request?.data?.latest_status_obj?.step_obj
                      .step_color as ColorTypes
                  }
                >
                  {/* {
                request?.data?.latest_status_obj?.step_obj?.name
              } */}
                  {request?.data?.latest_status_obj?.step_obj?.name !== "رد شده"
                    ? request?.data?.latest_status_obj?.step_obj?.name
                    : `${
                        request?.data?.latest_status_obj?.step_obj?.name
                      } ${request?.data?.is_cancelled ? "توسط کاربر" : ""}`}
                </Status>
              )}
            </div>
          </div>

          <Card
            color={"paper"}
            className={"mt-[16px] p-[16px] lg:mt-0 lg:w-[40%]"}
          >
            <p className="mb-[6px] flex items-center justify-between">
              <span className="text-[16px] font-bold">آزمون</span>
              {request?.data.is_urgent && <Badge color="error">فوری</Badge>}
            </p>
            <p className=" text-[14px]">
              {request?.data.experiment_obj?.name +
                " (" +
                request?.data.experiment_obj?.name_en +
                ")"}
            </p>
          </Card>
        </div>

        <div className="my-[16px] w-full lg:flex lg:flex-row-reverse lg:justify-end lg:gap-[16px]">
          <div className="mt-[16px] grid grid-cols-1 gap-[16px] sm:grid-cols-3 lg:mt-0 lg:w-[60%]">
            <Card color={"paper"} className={"p-[16px]"}>
              <p className="mb-[6px] text-[16px] font-bold">
                تاریخ ثبت درخواست
              </p>
              <p className="text-[14px]">
                {request?.data.created_at
                  ? DateHandler.formatDate(request?.data.created_at, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "---"}
              </p>
            </Card>
            <Card color={"paper"} className={"p-[16px]"}>
              <p className="mb-[6px] text-[16px] font-bold">
                تاریخ دریافت نمونه
              </p>
              <p className="text-[14px]">
                {request?.data.delivery_date
                  ? DateHandler.formatDate(request?.data.delivery_date, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "__"}
              </p>
            </Card>
            <Card color={"paper"} className={"p-[16px]"}>
              <p className="mb-[6px] text-[16px] font-bold">تاریخ پاسخ دهی</p>
              <p className="text-[14px]">
                {`${
                  request?.data.is_urgent
                    ? request?.data.experiment_obj
                        ?.estimated_urgent_result_time || "_"
                    : request?.data.experiment_obj?.estimated_result_time || "_"
                } روز کاری پس از دریافت نمونه`}
              </p>
            </Card>
          </div>

          <Card
            color={"paper"}
            className={"mt-[16px] p-[16px] lg:mt-0 lg:w-[40%]"}
          >
            <p className="mb-[6px] text-[16px] font-bold">آزمایشگاه</p>
            <p className="text-[14px]">
              {request?.data.experiment_obj?.laboratory_obj?.name +
                " (" +
                request?.data.experiment_obj?.laboratory_obj?.name_en +
                ")"}
            </p>
          </Card>
        </div>

        {/* <Card color={"paper"} className={"my-[16px] p-[16px]"}>
          <p className="mb-[6px] text-[16px] font-bold">آزمایشگاه</p>
          <p className="text-[14px]">
            {request?.data.experiment_obj?.laboratory_obj?.name +
              " (" +
              request?.data.experiment_obj?.laboratory_obj?.name_en +
              ")"}
          </p>
        </Card> */}

        {/* <Card
          color={"white"}
          variant={"outline"}
          className={"mt-[16px] p-[20px] text-center"}
        >
          {getStatusText(request?.data.status)}
        </Card> */}
        <div className="text-center">
          <Content
            status={request?.data?.latest_status_obj?.step_obj?.name}
            price={request?.data.price}
            requestId={request?.data.id}
            item={request?.data}
          />
        </div>
      </Card>
    </div>
  );
};

export default ApplicationInformation;
