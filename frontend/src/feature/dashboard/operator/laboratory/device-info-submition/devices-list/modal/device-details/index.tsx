import { useRouter } from "next/router";

import { IcClose } from "@feature/kits/common/icons";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { Input } from "@kit/input";
import { useMemo } from "react";
import { DateHandler } from "@utils/date-handler";
import { TextArea } from "@kit/text-area";

const DeviceDetails = () => {
  const router = useRouter();
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get lab details form modal
  const device = useModalHandler((state) => state.modalData);
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
  const deviceStatesList = useMemo(() => {
    return [
      { value: "operational", name: "سالم" },
      { value: "under_repair", name: "در حال تعمیر" },
      { value: "commissioning", name: "در حال راه‌اندازی" },
      { value: "calibration", name: "در حال کالیبراسیون" },
      { value: "awaiting_budget", name: "در انتظار بودجه برای تعمیر" },
      { value: "decommissioned", name: "به طور کامل از کار افتاده" },
    ];
  }, []);
  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] min-h-[95vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[80vw] xl:w-[60vw]"
    >
      <span className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">جزئیات دستگاه</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <div className="grid grid-cols-1 gap-8 pb-2 text-right md:grid-cols-4">
        <div className="col-span-4 md:col-span-2">
          <Input
            value={device.name}
            label={"نام دستگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={device.lab_name ?? ""}
            label={"نام آزمایشگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>

        <div className={`col-span-4 md:col-span-2`}>
          <Input
            value={device.labsnet_device_id ?? "---"}
            disabled
            className="bg-background-paper"
            label={"شناسه نوع دستگاه در شبکه راهبردی"}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={device.labsnet_model_id ?? "---"}
            disabled
            className="bg-background-paper"
            label={"شناسه مدل دستگاه در شبکه راهبردی"}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={device.manufacturer ?? "---"}
            label={"شرکت سازنده(برند)"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={device.manufacturer_representation ?? "---"}
            label={"نمایندگی شرکت سازنده"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={device.model ?? "---"}
            label={"مدل(Model)"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={device.country_of_manufacture ?? "---"}
            label={"کشور سازنده"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={device.serial_number ?? "---"}
            label={"کد استاندارد دستگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={device.control_code ?? "---"}
            label={"کد کنترلی دستگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        {/* <div className="col-span-4 md:col-span-2">
          <Input
            value={"---"}
            label={"نام مسئول"}
            disabled
            className="bg-background-paper"
          />
        </div> */}
        <div className="col-span-4 md:col-span-2">
          <Input
            value={
              device.commissioning_date
                ? DateHandler.formatDate(device.commissioning_date, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "---"
            }
            label={"تاریخ راه‌اندازی دستگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={
              device.extra_status
                ? deviceStatesList.find(
                    (type) => device.extra_status === type.value,
                  )?.name
                : "---"
            }
            label={"وضعیت عملکرد دستگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={device.accuracy ?? "---"}
            label={"دقت دستگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={getStatus(device.status)}
            label={"وضعیت"}
            disabled
            className="bg-background-paper"
          />
        </div>
        {/* <div className="col-span-4 md:col-span-2">
          <Input
            value={
              device.purchase_date ?DateHandler.formatDate(device.purchase_date, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }) : "---"
            }
            label={"تاریخ خریداری دستگاه"}
            disabled
            className="bg-background-paper"
          />
        </div> */}
        <div className="col-span-4">
          <TextArea
            value={device.application.length ? device.application : "---"}
            label={"کاربرد"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4">
          <TextArea
            value={device.description.length ? device.description : "---"}
            label={"شرح خدمات"}
            disabled
            className="bg-background-paper"
          />
        </div>
      </div>
    </Card>
  );
};
export default DeviceDetails;
