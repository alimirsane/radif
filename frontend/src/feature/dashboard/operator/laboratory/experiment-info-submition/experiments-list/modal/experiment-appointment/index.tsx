import * as yup from "yup";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { IcCheck, IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import { Button } from "@kit/button";

import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import faLocale from "@fullcalendar/core/locales/fa";

const SetAppointment = () => {
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // const router = useRouter();
  // const clientQuery = useQueryClient();
  // get experiment Id form modal
  // const experimentId = useModalHandler((state) => state.modalData);
  // const initialValues = useMemo(() => {
  //   return {
  //     date: "",
  //     start_time: "",
  //     end_time: "",
  //     duration: "",
  //   };
  // }, []);

  // const validationSchema = useMemo(() => {
  //   return yup.object({
  //     date: validation.requiredInput,
  //     start_time: validation.requiredInput,
  //     end_time: validation.requiredInput,
  //     duration: validation.requiredInput,
  //   });
  // }, []);

  // ******* full calendar *******
  // Define events state with EventInput[]
  const [events, setEvents] = useState([]);
  // Reference to calendar
  const calendarRef = useRef<FullCalendar | null>(null);
  // Selectable cell
  const [isSelectable, setIsSelectable] = useState(true);

  // Add new event
  const handleDateSelect = (selectInfo: any) => {
    const title = "";
    const newEvent = {
      id: String(events.length + 1),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents as any);
    selectInfo.view.calendar.unselect();
  };

  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] min-h-[95vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[90vw] xl:w-[80vw]"
    >
      <span className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">نوبت دهی</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <div className="flex flex-col items-center justify-between pb-12 md:flex-row">
        <p>
          برای ایجاد یا ویرایش نوبت‌ها، پس از انجام تغییرات دکمه ثبت تغییرات را
          کلیک کنید.
        </p>
        <Button
          variant="solid"
          color="primary"
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
      <div className="">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={faLocale}
          direction="rtl"
          selectable={isSelectable}
          editable={true}
          selectMirror={true}
          events={events}
          select={handleDateSelect}
          contentHeight="auto"
          height="auto"
          slotMinTime="06:00:00"
          slotMaxTime="18:00:00"
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "امروز",
            month: "ماه",
            week: "هفته",
            day: "روز",
            list: "لیست",
          }}
          firstDay={6}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
          dateClick={(info) => {
            const calendarApi = calendarRef.current?.getApi();
            if (calendarApi?.view.type === "dayGridMonth") {
              calendarApi.changeView("timeGridWeek", info.date);
            }
          }}
          viewDidMount={(info) => {
            setIsSelectable(info.view.type !== "dayGridMonth");
          }}
        />
      </div>
      {/* <FormHandler
        validationSchema={validationSchema}
        initialValues={initialValues}
        handleSubmit={(values, utils) => {
          console.log("values", values);
        }}
      >
        {(formik) => (
          <div className="grid grid-cols-1 gap-6 p-2 text-right md:grid-cols-6">
            <div className="col-span-6 md:col-span-1">
              <PersianCalendar
                name={"date"}
                formik={formik}
                autoComplete={"date"}
                placeholder="تاریخ موردنظر را انتخاب کنید"
                label={"تاریخ"}
                calendarOptions={{
                  minDate: Date.now(),
                }}
              />
            </div>
            <div className="col-span-6 md:col-span-1">
              <Input
                name={"start_time"}
                formik={formik}
                autoComplete={"start_time"}
                placeholder="ساعت شروع را وارد کنید"
                label={"ساعت شروع"}
                style={{
                  direction: formik.values["start_time"] ? "ltr" : "rtl",
                }}
              />
            </div>
            <div className="col-span-6 md:col-span-1">
              <Input
                name={"end_time"}
                formik={formik}
                autoComplete={"end_time"}
                placeholder="ساعت پایان را وارد کنید"
                label={"ساعت پایان"}
                style={{
                  direction: formik.values["end_time"] ? "ltr" : "rtl",
                }}
              />
            </div>
            <div className={`relative col-span-6 items-center md:col-span-1`}>
              <Input
                name={"duration"}
                formik={formik}
                autoComplete={"duration"}
                placeholder="مدت زمان نوبت را وارد کنید"
                label={"مدت زمان نوبت (دقیقه)"}
                type="number"
                className="pl-[30px]"
              />
              <span className="absolute left-3 top-[45%] translate-y-1 text-[14px] text-typography-gray">
                دقیقه
              </span>
            </div>
            <div className="col-span-6 mt-5 flex items-center md:col-span-1">
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
      </FormHandler> */}
    </Card>
  );
};
export default SetAppointment;
