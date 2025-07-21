import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { Fab } from "@kit/fab";
import Tooltip from "@kit/tooltip";
import { SvgIcon } from "@kit/svg-icon";
import Badge from "@feature/kits/badge";
import { apiRequest } from "@api/service/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IcDelete, IcEdit } from "@feature/kits/common/icons";
import { RequestType, RequestTypeForm } from "@api/service/request/type";
import { useCurrentRequestHandler } from "@hook/current-request-handler";
import { Card } from "@kit/card";
import { DateHandler } from "@utils/date-handler";
import { apiAppointment } from "@api/service/appointment";

const ExperimentInfo = ({ child }: { child: RequestType }) => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // request Id in state management
  const setRequestId = useCurrentRequestHandler((state) => state.setRequestId);
  // child request id for delete
  const [selectedChild, setSelectedChild] = useState(-1);
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

  const { mutateAsync } = useMutation(
    apiAppointment(false).deleteAppointment(
      child?.appointments_obj?.[0]?.id ?? -1,
    ),
  );

  const cancelAppointmentHandler = () => {
    mutateAsync(child?.appointments_obj?.[0]?.id ?? -1)
      .then((res) => {
        // refetchParentRequest();
        clientQuery.invalidateQueries({
          queryKey: [apiRequest().url],
        });
      })
      .catch((err) => {
        // refetchParentRequest();
        clientQuery.invalidateQueries({
          queryKey: [apiRequest().url],
        });
      });
  };
  // complete request api
  const { mutateAsync: deleteRequest } = useMutation(
    apiRequest(true, {
      success: "حذف درخواست موفقیت آمیز بود",
      fail: "حذف درخواست انجام نشد",
      waiting: "در حال انتظار",
    }).completeRequest(selectedChild),
  );
  // delete request
  const deleteChildRequest = () => {
    const data = {
      has_parent_request: false,
      is_completed: false,
      parent_request: null,
    };
    deleteRequest(data)
      .then((res) => {
        cancelAppointmentHandler();
      })
      .catch((err) => {});
  };
  // edit request
  const editChildRequest = (childId: number, is_completed: boolean) => {
    setRequestId(childId);
    router.query.step = is_completed ? "5" : "3";
    router.push(router);
  };
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
      <div className="flex flex-row items-center md:justify-between">
        <span className="flex flex-row gap-2">
          <h6 className="font-semibold">
            آزمون{" "}
            {child?.experiment_obj?.name
              ? child?.experiment_obj?.name +
                " (" +
                child?.experiment_obj?.name_en +
                ")"
              : "---"}
          </h6>
          <span className="flex flex-row gap-2">
            {child?.is_urgent && (
              <Badge color="error" className={"bg-opacity-80"}>
                فوری
              </Badge>
            )}
          </span>
        </span>
        <div className="hidden lg:block">
          <span className="flex flex-row gap-2">
            <Fab
              variant="outline"
              className="p-[6px]"
              color="error"
              onClick={() => {
                setSelectedChild(child.id ?? -1);
                deleteChildRequest();
              }}
            >
              <Tooltip message="حذف">
                <SvgIcon
                  fillColor={"error"}
                  className={"[&>svg]:h-[18px] [&>svg]:w-[18px]"}
                >
                  <IcDelete />
                </SvgIcon>
              </Tooltip>
            </Fab>
            <Fab
              variant="outline"
              className="p-[6px]"
              onClick={() =>
                editChildRequest(child?.id ?? -1, child?.is_completed ?? false)
              }
            >
              <Tooltip message="ویرایش">
                <SvgIcon
                  strokeColor={"primary"}
                  className={"[&>svg]:h-[18px] [&>svg]:w-[18px]"}
                >
                  <IcEdit />
                </SvgIcon>
              </Tooltip>
            </Fab>
          </span>
        </div>
      </div>
      {/* <div className="flex flex-row items-center justify-between pb-2 pt-3">
        <span className="text-[14px] font-semibold text-typography-secondary">
          {child?.request_number}
        </span>
      </div> */}
      <div className="flex flex-col flex-wrap gap-3 pt-5 md:flex-row lg:gap-x-8 lg:gap-y-5">
        <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
          <h6 className="text-[16px] font-[500]">نام آزمایشگاه:</h6>
          <span className="text-wrap pr-1 text-[14px]">
            {child?.experiment_obj?.laboratory_obj?.name ?? "---"}
          </span>
        </div>
        <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
          <h6 className="text-[16px] font-[500]">نام دانشکده:</h6>
          <span className="text-wrap pr-1 text-[14px]">
            {child?.experiment_obj?.laboratory_obj?.department_obj?.name ??
              "---"}
          </span>
        </div>
        <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
          <h6 className="text-[16px] font-[500]">تعداد نمونه:</h6>
          <span className="text-wrap pr-1 text-[14px]">
            {getSamplesFlattenedForms(child?.forms)?.length}
          </span>
        </div>

        <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
          <h6 className="text-[16px] font-[500]">تعداد پارامتر:</h6>
          <span className="text-wrap pr-1 text-[14px]">
            {child?.parameter?.length}
          </span>
        </div>
        <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
          <h6 className="text-[16px] font-[500]">هزینه آزمون:</h6>
          <span className="text-wrap pr-1 text-[14px]">
            {Number(child?.price).toLocaleString()} ریال
          </span>
        </div>
        {child?.experiment_obj?.need_turn && (
          <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
            <h6 className="text-[16px] font-[500]">نوبت:</h6>
            {child?.appointments_obj?.length === 0 ? (
              <span className="pr-1 text-[14px]">نوبتی رزرو نشده است.</span>
            ) : (
              <>
                {child?.appointments_obj?.map((item, index) => (
                  <span key={index} className="text-wrap pr-1 text-[14px]">
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
                      className={`mr-2 rounded-full px-3 py-[2px] ${item.status}-${item?.extra_fields?.queue_status} text-[12px]`}
                    >
                      {
                        appointmentStatus[
                          `${item.status}-${item?.extra_fields?.queue_status}` as keyof typeof appointmentStatus
                        ]
                      }
                    </span>
                  </span>
                ))}
              </>
            )}
          </div>
        )}
        <div className="w-full lg:hidden">
          <span className="flex flex-row justify-end gap-2">
            <Fab
              variant="outline"
              className="p-[6px]"
              color="error"
              onClick={() => {
                setSelectedChild(child.id ?? -1);
                deleteChildRequest();
              }}
            >
              <Tooltip message="حذف">
                <SvgIcon
                  fillColor={"error"}
                  className={"[&>svg]:h-[18px] [&>svg]:w-[18px]"}
                >
                  <IcDelete />
                </SvgIcon>
              </Tooltip>
            </Fab>
            <Fab
              variant="outline"
              className="p-[6px]"
              onClick={() =>
                editChildRequest(child?.id ?? -1, child?.is_completed ?? false)
              }
            >
              <Tooltip message="ویرایش">
                <SvgIcon
                  strokeColor={"primary"}
                  className={"[&>svg]:h-[18px] [&>svg]:w-[18px]"}
                >
                  <IcEdit />
                </SvgIcon>
              </Tooltip>
            </Fab>
          </span>
        </div>
      </div>
      {!child?.is_completed && (
        <Card
          color="error"
          className="mb-1 mt-5 w-full rounded-[8px] bg-opacity-5 p-[22px] text-center text-[14px] font-semibold text-error"
        >
          درخواست آزمون {child?.experiment_obj?.name} تکمیل نشده است. لطفا نسبت
          به حذف یا ویرایش این درخواست اقدام نمایید.
        </Card>
      )}
    </>
  );
};

export default ExperimentInfo;
