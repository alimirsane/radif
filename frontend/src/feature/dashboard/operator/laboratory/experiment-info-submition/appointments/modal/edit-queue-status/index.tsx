import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import * as yup from "yup";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { DateHandler } from "@utils/date-handler";
import { IcCheck, IcChevronDown, IcClose } from "@feature/kits/common/icons";
import { apiAppointment } from "@api/service/appointment";
import { useModalHandler } from "@utils/modal-handler/config";
import { format } from "date-fns";
import { data } from "@feature/dashboard/operator/component/template/components/test-details/data";
import { FormHandler } from "@utils/form-handler";
import { Input } from "@kit/input";
import { validation } from "@utils/form-handler/validation";
import { QueueStatusType, QueueType } from "@api/service/appointment/type";
import { Select } from "@kit/select";

const QueueStatusEdit = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const modalData = useModalHandler((state) => state.modalData);
  // check if queue has reserved appointment
  const [hasReservedAppointment, setHasReservedAppointment] =
    useState<boolean>(false);
  // check if queue is new or not
  const [isOldQueue, setIsOldQueue] = useState<boolean>(false);
  // selected queue
  const [selectedQueue, setSelectedQueue] = useState<QueueType>({
    id: 0,
    date: "",
    start_time: "",
    end_time: "",
    break_start: "",
    break_end: "",
    status: QueueStatusType.ACTIVE,
    experiment: 0,
    time_unit: 0,
    appointments: [],
  });
  // get queues
  const {
    data: queuesList,
    isLoading: queuesLoading,
    refetch,
  } = useQuery({
    ...apiAppointment().getAllQueues({
      start_date: modalData?.dateRange?.start,
      end_date: modalData?.dateRange?.end,
      experiment_id: Number((router.query.name as string)?.split("$")?.[0]),
    }),
    // enabled: false,
  });
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData]);
  // find queue id
  useEffect(() => {
    if (!queuesList?.data?.length) return;
    const queueId = queuesList?.data?.find(
      (queue) =>
        queue.date === format(modalData.date, "yyyy-MM-dd") &&
        queue.experiment ===
          Number((router.query.name as string)?.split("$")?.[0]),
    );
    if (queueId) {
      setSelectedQueue(queueId);
      setIsOldQueue(true);
      if (queueId?.appointments?.some((turn) => turn.status === "reserved"))
        setHasReservedAppointment(true);
    }
  }, [queuesList, modalData, router]);
  // queue status list
  const statusList = useMemo(() => {
    return hasReservedAppointment
      ? [
          { value: QueueStatusType.ACTIVE, name: "فعال" },
          { value: QueueStatusType.SUSPENDED, name: "تعلیق شده" },
        ]
      : [
          { value: QueueStatusType.ACTIVE, name: "فعال" },
          { value: QueueStatusType.INACTIVE, name: "غیرفعال" },
        ];
  }, [hasReservedAppointment]);
  // form
  const initialValues = useMemo(() => {
    return {
      status: selectedQueue.status,
    };
  }, [selectedQueue]);
  const validationSchema = useMemo(() => {
    return yup.object({
      status: validation.requiredInput,
    });
  }, []);
  // queue update api
  const { mutateAsync: editQueue } = useMutation(
    apiAppointment(true, {
      success: "ویرایش نوبت‌ها موفقیت آمیز بود",
      fail: "ویرایش نوبت‌ها انجام نشد",
      waiting: "در حال انتظار",
    }).updateQueueStatus(selectedQueue?.id),
  );
  // submit button
  const submitHandler = (values: any) => {
    const data = {
      date: selectedQueue.date,
      start_time: selectedQueue.start_time,
      end_time: selectedQueue.end_time,
      time_unit: selectedQueue.time_unit,
      experiment: Number((router.query.name as string)?.split("$")?.[0]),
      status: values.status,
    };
    editQueue(data)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiAppointment().url],
        });
        router.query.action = "update";
        router.push(router);
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card
      color={"white"}
      className="w-[90vw] p-6 sm:w-[80vw] md:w-[60vw] lg:w-[35vw]"
    >
      <span className="mb-5 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">
          تغییر وضعیت نوبت‌های{" "}
          {DateHandler.formatDate(
            format(new Date(modalData.date), "yyyy-MM-dd"),
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            },
          )}
        </h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      {!isOldQueue ? (
        <Card color={"info"} className="px-4 py-7 text-center text-[14px]">
          <p className="pb-3 text-[15px] font-medium">
            شما مجاز به تغییر وضعیت نوبت‌های این روز نمی‌باشید.
          </p>
          روز &quot;
          {DateHandler.formatDate(
            format(new Date(modalData.date), "yyyy-MM-dd"),
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            },
          )}
          &quot; فاقد نوبت است.
        </Card>
      ) : format(new Date(modalData.date), "yyyy-MM-dd") < today ? (
        <Card
          color={"info"}
          className=" mt-7 px-4 py-7 text-center text-[14px]"
        >
          <p className="pb-3 text-[15px] font-medium">
            شما مجاز به تغییر وضعیت نوبت‌های این روز نمی‌باشید.
          </p>
          زمان نوبت‌های &quot;
          {DateHandler.formatDate(
            format(new Date(modalData.date), "yyyy-MM-dd"),
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            },
          )}
          &quot; گذشته است.
        </Card>
      ) : (
        <FormHandler
          validationSchema={validationSchema}
          initialValues={initialValues}
          handleSubmit={(values, utils) => {
            submitHandler(values);
          }}
        >
          {(formik) => (
            <div className="grid grid-cols-2 gap-2 pb-4 pt-5">
              <Select
                options={statusList}
                name={"status"}
                formik={formik}
                autoComplete={"status"}
                label="وضعیت نوبت‌های این روز"
                placeholder="وضعیت"
                holder={(activeItem) => (
                  <Card
                    variant={"outline"}
                    className={
                      "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
                    }
                  >
                    <span
                      className={
                        activeItem
                          ? "text-typography-main"
                          : "text-[13px] text-typography-secondary"
                      }
                    >
                      {activeItem?.name}
                    </span>

                    <SvgIcon className={"[&>svg]:h-[11px] [&>svg]:w-[12px]"}>
                      <IcChevronDown />
                    </SvgIcon>
                  </Card>
                )}
              >
                {(item, activeItem) => (
                  <Button
                    className={"w-full"}
                    variant={
                      item?.value === activeItem?.value ? "solid" : "text"
                    }
                    color={"primary"}
                  >
                    {item?.name}
                  </Button>
                )}
              </Select>
              <div className="col-span-2 flex justify-end">
                <Button
                  type="submit"
                  variant="solid"
                  color="primary"
                  className="w-full sm:w-auto"
                  disabled={!formik.isValid}
                  startIcon={
                    <SvgIcon
                      strokeColor="white"
                      className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
                    >
                      <IcCheck />
                    </SvgIcon>
                  }
                >
                  ثبت وضعیت
                </Button>
              </div>
            </div>
          )}
        </FormHandler>
      )}
    </Card>
  );
};

export default QueueStatusEdit;
