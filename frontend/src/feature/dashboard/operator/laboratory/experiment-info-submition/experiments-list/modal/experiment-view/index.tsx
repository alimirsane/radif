import { useRouter } from "next/router";

import { IcClose } from "@feature/kits/common/icons";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { Input } from "@kit/input";
import { TextArea } from "@kit/text-area";
import { useMemo, useState } from "react";

const ViewExperiment = () => {
  const router = useRouter();
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get experiment details form modal
  const experiment = useModalHandler((state) => state.modalData);

  const getStatus = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "فعال";
      case "inactive":
        return "غیر فعال";
      case "hidden":
        return "پنهان";
    }
  };
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "زمان (دقیقه)" },
      { value: "hour", name: "زمان (ساعت)" },
    ];
  }, []);
  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] min-h-[95vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[80vw] xl:w-[60vw]"
    >
      <span className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">جزئیات آزمون</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>

      <div className="grid grid-cols-1 gap-8 pb-2 text-right md:grid-cols-4">
        <div className="col-span-4 md:col-span-2">
          <Input
            value={experiment.name}
            disabled
            className="bg-background-paper"
            label={"نام آزمون"}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={experiment.name_en}
            disabled
            className="bg-background-paper"
            label={"نام انگلیسی آزمون"}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={experiment.lab_name}
            disabled
            className="bg-background-paper"
            label={"نام آزمایشگاه"}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={experiment.device_obj?.name ?? "---"}
            disabled
            className="bg-background-paper"
            label={"نام دستگاه"}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={experiment.labsnet_experiment_id ?? "---"}
            disabled
            className="bg-background-paper"
            label={"شناسه آزمون شبکه راهبردی"}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={experiment.labsnet_test_type_id ?? "---"}
            disabled
            className="bg-background-paper"
            label={"شناسه نوع آزمون شبکه راهبردی"}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={experiment.control_code ?? "---"}
            disabled
            className="bg-background-paper"
            label={"کد کنترلی آزمون"}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={
              unitsList.find((unit) => unit.value === experiment.test_unit_type)
                ?.name ?? experiment.test_unit_type
            }
            disabled
            className="bg-background-paper"
            label={"نوع واحد آزمون"}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={experiment.form_obj.title ?? "---"}
            disabled
            className="bg-background-paper"
            label={"فرم آزمون"}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={experiment.work_scope}
            disabled
            className="bg-background-paper"
            label={"گستره کاری"}
          />
        </div>
        <div className={`col-span-4 md:col-span-2`}>
          <Input
            value={`${experiment.estimated_result_time} روز کاری`}
            label={"زمان انتظار انجام آزمون"}
            disabled
            className="bg-background-paper"
          />
        </div>

        <div className={`col-span-4 md:col-span-2`}>
          <Input
            value={`${experiment.estimated_urgent_result_time ?? "-"} روز کاری`}
            label={"زمان انتظار انجام آزمون فوری"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={getStatus(experiment.status)}
            label={"وضعیت"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4">
          <TextArea
            value={experiment.description ?? "---"}
            disabled
            className="bg-background-paper"
            label={"شرح آزمون (نکات ضروری جهت نمایش به مشتری)"}
          />
        </div>
        <div className="col-span-4">
          {/* <div className="pb-2">
            <label className="text-[13px] font-bold">
              قوانین و شرایط آزمون
            </label>
          </div>
          <div
            className="rounded-[8px] border border-typography-secondary border-opacity-15 bg-background-paper p-[10px]"
            dangerouslySetInnerHTML={{
              __html: experiment.rules,
            }}
          /> */}
          <TextArea
            value={experiment.rules ?? "---"}
            disabled
            className="bg-background-paper"
            rows={6}
            label={"قوانین و شرایط آزمون"}
          />
        </div>
        <div className="col-span-4">
          <input
            type="checkbox"
            checked={experiment.need_turn}
            name="needTurn"
            className={`accent-black h-3 w-3`}
          ></input>
          <label htmlFor="needTurn" className={`pr-2 text-[14px] font-medium`}>
            آزمون دارای نوبت دهی می‌باشد.
          </label>
        </div>
        {experiment.need_turn && (
          <>
            <div className={`col-span-4 md:col-span-2`}>
              <Input
                label={"پیش پرداخت ثبت نوبت"}
                value={`${Number(experiment.prepayment_amount).toLocaleString() ?? "-"} ریال`}
                disabled
                className="bg-background-paper"
              />
            </div>
            <div className={`col-span-4 md:col-span-2`}>
              <Input
                label={"محدودیت اخذ نوبت برای هر کاربر"}
                value={`${experiment.appointment_limit_hours ?? "-"} ساعت`}
                disabled
                className="bg-background-paper"
              />
            </div>
            <div className="col-span-4">
              {/* <TextArea
                label={"توضیحات نوبت‌ دهی"}
                value={experiment.description_appointment ?? "---"}
                disabled
                className="bg-background-paper"
              /> */}
              <div className="pb-2">
                <label className="text-[13px] font-bold">
                  توضیحات نوبت دهی
                </label>
              </div>
              <div
                className="rounded-[8px] border border-typography-secondary border-opacity-15 bg-background-paper p-[10px]"
                dangerouslySetInnerHTML={{
                  __html: experiment.description_appointment.length
                    ? experiment.description_appointment
                    : "---",
                }}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
export default ViewExperiment;
