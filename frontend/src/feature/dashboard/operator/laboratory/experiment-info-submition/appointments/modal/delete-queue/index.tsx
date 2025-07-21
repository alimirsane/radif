import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { DateHandler } from "@utils/date-handler";
import { IcClose } from "@feature/kits/common/icons";
import { apiAppointment } from "@api/service/appointment";
import { useModalHandler } from "@utils/modal-handler/config";
import { format } from "date-fns";
import { QueueStatusType, QueueType } from "@api/service/appointment/type";

const QueueDelete = () => {
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
  // queue delete api
  const { mutateAsync } = useMutation(
    apiAppointment(true, {
      success: "حذف نوبت‌ها موفقیت آمیز بود",
      fail: "حذف نوبت‌ها انجام نشد",
      waiting: "در حال انتظار",
    }).deleteQueue(selectedQueue?.id),
  );
  // delete queue
  const deleteHandler = () => {
    mutateAsync(selectedQueue)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiAppointment().url],
        });
        router.query.action = "delete";
        router.push(router);
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[45vw] lg:w-[35vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">حذف نوبت‌ها</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      {!isOldQueue ? (
        <Card color={"info"} className="mt-7 px-4 py-7 text-center text-[14px]">
          روز &quot;
          {DateHandler.formatDate(
            format(new Date(modalData.date), "yyyy-MM-dd"),
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            },
          )}
          &quot; فاقد نوبت می‌باشد.
        </Card>
      ) : format(new Date(modalData.date), "yyyy-MM-dd") < today ? (
        <Card
          color={"info"}
          className=" mt-7 px-4 py-7 text-center text-[14px]"
        >
          <p className="pb-3 text-[15px] font-medium">
            شما مجاز به حذف نوبت‌های این روز نمی‌باشید.
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
      ) : hasReservedAppointment ? (
        <Card color={"info"} className="mt-7 px-4 py-7 text-center text-[14px]">
          <p className="pb-3 text-[15px] font-medium">
            شما مجاز به حذف نوبت‌های این روز نمی‌باشید.
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
          &quot; دارای نوبت رزرو شده است.
        </Card>
      ) : (
        <>
          <Card
            color={"info"}
            className="mb-8 mt-7 px-4 py-7 text-center text-[14px]"
          >
            آیا از حذف نوبت های روز &quot;
            {DateHandler.formatDate(
              format(new Date(modalData.date), "yyyy-MM-dd"),
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              },
            )}
            &quot; اطمینان دارید؟
          </Card>
          <div className="flex justify-center gap-[12px] pb-1">
            <Button
              className="w-[100px] "
              variant="outline"
              onClick={hideModal}
            >
              خیر
            </Button>
            <Button className="w-[100px] " onClick={deleteHandler}>
              بله
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default QueueDelete;
