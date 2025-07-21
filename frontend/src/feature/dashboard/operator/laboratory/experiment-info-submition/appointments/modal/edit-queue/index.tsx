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

const QueueEdit = () => {
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
  // lists
  const hoursList = useMemo(() => {
    return [
      { value: "06", name: "06" },
      { value: "07", name: "07" },
      { value: "08", name: "08" },
      { value: "09", name: "09" },
      { value: "10", name: "10" },
      { value: "11", name: "11" },
      { value: "12", name: "12" },
      { value: "13", name: "13" },
      { value: "14", name: "14" },
      { value: "15", name: "15" },
      { value: "16", name: "16" },
      { value: "17", name: "17" },
      { value: "18", name: "18" },
      { value: "19", name: "19" },
      { value: "20", name: "20" },
    ];
  }, []);
  const minutesList = useMemo(() => {
    return [
      { value: "00", name: "00" },
      { value: "05", name: "05" },
      { value: "10", name: "10" },
      { value: "15", name: "15" },
      { value: "20", name: "20" },
      { value: "25", name: "25" },
      { value: "30", name: "30" },
      { value: "35", name: "35" },
      { value: "40", name: "40" },
      { value: "45", name: "45" },
      { value: "50", name: "50" },
      { value: "55", name: "55" },
    ];
  }, []);
  const timeUnitsList = useMemo(() => {
    return [
      { value: "30", name: "30" },
      { value: "60", name: "60" },
      { value: "90", name: "90" },
      { value: "120", name: "120" },
      { value: "180", name: "180" },
      { value: "240", name: "240" },
    ];
  }, []);
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
  // form
  const initialValues = useMemo(() => {
    return {
      start_time_h: isOldQueue
        ? selectedQueue?.start_time?.split(":")?.[0]
        : "",
      start_time_m: isOldQueue
        ? selectedQueue?.start_time?.split(":")?.[1]
        : "",
      end_time_h: isOldQueue ? selectedQueue?.end_time?.split(":")?.[0] : "",
      end_time_m: isOldQueue ? selectedQueue?.end_time?.split(":")?.[1] : "",
      break_start_h: isOldQueue
        ? selectedQueue?.break_start?.split(":")?.[0]
        : "",
      break_start_m: isOldQueue
        ? selectedQueue?.break_start?.split(":")?.[1]
        : "",
      break_end_h: isOldQueue ? selectedQueue?.break_end?.split(":")?.[0] : "",
      break_end_m: isOldQueue ? selectedQueue?.break_end?.split(":")?.[1] : "",
      time_unit: isOldQueue ? selectedQueue?.time_unit?.toString() : "",
    };
  }, [isOldQueue, selectedQueue]);
  const validationSchema = useMemo(() => {
    return yup.object({
      start_time_h: validation.requiredInput,
      start_time_m: validation.requiredInput,
      end_time_h: validation.requiredInput,
      end_time_m: validation.requiredInput,
      time_unit: validation.requiredInput,
    });
  }, []);
  // queue create api
  const { mutateAsync: addQueue } = useMutation(
    apiAppointment(true, {
      success: "ثبت نوبت‌ها موفقیت آمیز بود",
      fail: "ثبت نوبت‌ها انجام نشد",
      waiting: "در حال انتظار",
    }).createQueue(),
  );
  // queue update api
  const { mutateAsync: editQueue } = useMutation(
    apiAppointment(true, {
      success: "ویرایش نوبت‌ها موفقیت آمیز بود",
      fail: "ویرایش نوبت‌ها انجام نشد",
      waiting: "در حال انتظار",
    }).updateQueue(selectedQueue?.id),
  );
  // submit button
  const submitHandler = (values: any) => {
    const data = {
      date: format(new Date(modalData.date), "yyyy-MM-dd"),
      start_time: `${values.start_time_h}:${values.start_time_m ?? "00"}`,
      end_time: `${values.end_time_h}:${values.end_time_m ?? "00"}`,
      time_unit: values.time_unit,
      status: selectedQueue?.status,
      // status: QueueStatusType.ACTIVE,
      experiment: Number((router.query.name as string)?.split("$")?.[0]),
      ...(values.break_start_h && {
        break_start: `${values.break_start_h}:${!!values.break_start_m.length ? values.break_start_m : "00"}`,
      }),
      ...(values.break_end_h && {
        break_end: `${values.break_end_h}:${!!values.break_end_m.length ? values.break_end_m : "00"}`,
      }),
    };
    if (!isOldQueue) {
      addQueue(data)
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
    } else {
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
    }
  };

  return (
    <Card
      color={"white"}
      className="w-[90vw] p-6 sm:w-[85vw] md:w-[70vw] lg:w-[40vw]"
    >
      <span className="mb-5 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">
          {isOldQueue ? "ویرایش" : "ثبت"} نوبت‌های{" "}
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
      {hasReservedAppointment ? (
        <Card color={"info"} className="px-4 py-7 text-center text-[14px]">
          <p className="pb-3 text-[15px] font-medium">
            شما مجاز به ویرایش نوبت‌های این روز نمی‌باشید.
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
      ) : format(new Date(modalData.date), "yyyy-MM-dd") < today ? (
        <Card
          color={"info"}
          className=" mt-7 px-4 py-7 text-center text-[14px]"
        >
          <p className="pb-3 text-[15px] font-medium">
            شما مجاز به ویرایش نوبت‌های این روز نمی‌باشید.
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
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 pr-4 pt-5">
              <div className="grid grid-cols-2">
                <p className="col-span-2 text-[13px] font-bold">
                  زمان شروع نوبت دهی*
                </p>
                <span className="flex flex-grow flex-row items-center">
                  <span className="w-full">
                    <Select
                      options={minutesList}
                      name={"start_time_m"}
                      formik={formik}
                      autoComplete={"start_time_m"}
                      placeholder="دقیقه"
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
                            {activeItem?.name ?? "دقیقه"}
                          </span>

                          <SvgIcon
                            className={"[&>svg]:h-[11px] [&>svg]:w-[12px]"}
                          >
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
                  </span>
                  <span className="px-2 pt-1 text-[16px] font-bold">:</span>
                </span>
                <span className="flex flex-grow flex-row items-center">
                  <span className="w-full">
                    <Select
                      options={hoursList}
                      name={"start_time_h"}
                      formik={formik}
                      autoComplete={"start_time_h"}
                      placeholder="ساعت"
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
                            {activeItem?.name ?? "ساعت"}
                          </span>

                          <SvgIcon
                            className={"[&>svg]:h-[11px] [&>svg]:w-[12px]"}
                          >
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
                  </span>

                  <span className="px-2 text-[16px] font-bold"></span>
                </span>
              </div>
              <div className="grid grid-cols-2">
                <p className="col-span-2 text-[13px] font-bold">
                  زمان پایان نوبت دهی*
                </p>
                <span className="flex flex-grow flex-row items-center">
                  <span className="w-full">
                    <Select
                      options={minutesList}
                      name={"end_time_m"}
                      formik={formik}
                      autoComplete={"start_time_m"}
                      placeholder="دقیقه"
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
                            {activeItem?.name ?? "دقیقه"}
                          </span>

                          <SvgIcon
                            className={"[&>svg]:h-[11px] [&>svg]:w-[12px]"}
                          >
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
                  </span>
                  <span className="px-2 pt-1 text-[16px] font-bold">:</span>
                </span>
                <span className="flex flex-grow flex-row items-center">
                  <span className="w-full">
                    <Select
                      options={hoursList}
                      name={"end_time_h"}
                      formik={formik}
                      autoComplete={"start_time_h"}
                      placeholder="ساعت"
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
                            {activeItem?.name ?? "ساعت"}
                          </span>

                          <SvgIcon
                            className={"[&>svg]:h-[11px] [&>svg]:w-[12px]"}
                          >
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
                  </span>

                  <span className="px-2 text-[16px] font-bold"></span>
                </span>
              </div>
              <div className="grid grid-cols-2">
                <p className="col-span-2 text-[13px] font-bold">
                  زمان شروع بازه غیرفعال
                </p>
                <span className="flex flex-grow flex-row items-center">
                  <span className="w-full">
                    <Select
                      options={minutesList}
                      name={"break_start_m"}
                      formik={formik}
                      autoComplete={"break_start_m"}
                      placeholder="دقیقه"
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
                            {activeItem?.name ?? "دقیقه"}
                          </span>

                          <SvgIcon
                            className={"[&>svg]:h-[11px] [&>svg]:w-[12px]"}
                          >
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
                  </span>
                  <span className="px-2 pt-1 text-[16px] font-bold">:</span>
                </span>
                <span className="flex flex-grow flex-row items-center">
                  <span className="w-full">
                    <Select
                      options={hoursList}
                      name={"break_start_h"}
                      formik={formik}
                      autoComplete={"break_start_h"}
                      placeholder="ساعت"
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
                            {activeItem?.name ?? "ساعت"}
                          </span>

                          <SvgIcon
                            className={"[&>svg]:h-[11px] [&>svg]:w-[12px]"}
                          >
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
                  </span>

                  <span className="px-2 text-[16px] font-bold"></span>
                </span>
              </div>
              <div className="grid grid-cols-2">
                <p className="col-span-2 text-[13px] font-bold">
                  زمان پایان بازه غیرفعال
                </p>
                <span className="flex flex-grow flex-row items-center">
                  <span className="w-full">
                    <Select
                      options={minutesList}
                      name={"break_end_m"}
                      formik={formik}
                      autoComplete={"break_end_m"}
                      placeholder="دقیقه"
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
                            {activeItem?.name ?? "دقیقه"}
                          </span>

                          <SvgIcon
                            className={"[&>svg]:h-[11px] [&>svg]:w-[12px]"}
                          >
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
                  </span>
                  <span className="px-2 pt-1 text-[16px] font-bold">:</span>
                </span>
                <span className="flex flex-grow flex-row items-center">
                  <span className="w-full">
                    <Select
                      options={hoursList}
                      name={"break_end_h"}
                      formik={formik}
                      autoComplete={"break_end_h"}
                      placeholder="ساعت"
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
                            {activeItem?.name ?? "ساعت"}
                          </span>

                          <SvgIcon
                            className={"[&>svg]:h-[11px] [&>svg]:w-[12px]"}
                          >
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
                  </span>

                  <span className="px-2 text-[16px] font-bold"></span>
                </span>
              </div>
              <div className={`pl-4`}>
                <Select
                  options={timeUnitsList}
                  name={"time_unit"}
                  formik={formik}
                  autoComplete={"time_unit"}
                  label={"مدت زمان هر نوبت (دقیقه)"}
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
                        {activeItem?.name ?? "مدت زمان هر نوبت را انتخاب کنید"}
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
                {/* <Input
                name={"time_unit"}
                formik={formik}
                autoComplete={"time_unit"}
                placeholder="مدت زمان هر نوبت را وارد کنید"
                label={"مدت زمان هر نوبت (دقیقه)"}
                type="number"
                className="pl-[30px]"
              />
              <span className="absolute left-6 top-[45%] translate-y-1 text-[14px] text-typography-gray">
                دقیقه
              </span> */}
              </div>
              <div className="col-span-2 flex justify-end pb-4 pl-4">
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
                  ثبت تغییرات
                </Button>
              </div>
            </div>
          )}
        </FormHandler>
      )}
    </Card>
  );
};

export default QueueEdit;
