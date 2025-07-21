import { useRouter } from "next/router";

import { IcClose, IcImage } from "@feature/kits/common/icons";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { Input } from "@kit/input";
import { useMemo, useState } from "react";
import { TextArea } from "@kit/text-area";

const LaboratoryDetails = () => {
  const router = useRouter();
  // handle modal
  const openModal = useModalHandler((state) => state.openModal);
  const hideModal = useModalHandler((state) => state.hideModal);
  const labTypesList = useMemo(() => {
    return [
      { value: "4", name: "مقیم" },
      { value: "2", name: "همکار" },
      { value: "3", name: "مستقل" },
    ];
  }, []);
  // get lab details form modal
  const lab = useModalHandler((state) => state.modalData);
  // iso
  const [isoApproval, setIsoApproval] = useState<boolean | undefined>(
    lab.has_iso_17025,
  );
  // translate status
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
  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] min-h-[95vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[80vw] xl:w-[60vw]"
    >
      <span className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">جزئیات آزمایشگاه</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <div className="grid grid-cols-1 gap-8 pb-2 text-right md:grid-cols-4">
        <div className="col-span-4 md:col-span-2">
          <Input
            value={lab.name}
            label={"نام آزمایشگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={lab.name_en}
            label={"نام انگلیسی آزمایشگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={lab.department_obj.name}
            label={"دانشکده"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={
              labTypesList.find(
                (type) => lab.lab_type.toString() === type.value,
              )?.name
            }
            label={"نوع آزمایشگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 flex flex-row gap-2 md:col-span-2">
          <div className="w-2/3">
            <Input
              label={"تلفن ۱"}
              value={lab.telephone1 ?? "---"}
              disabled
              className="bg-background-paper"
            />
          </div>
          <div className="w-1/3">
            <Input
              label={"داخلی تلفن ۱"}
              value={lab.add_telephone1 ?? "-"}
              disabled
              className="bg-background-paper"
            />
          </div>
        </div>
        <div className="col-span-4 flex flex-row gap-2 md:col-span-2">
          <div className="w-2/3">
            <Input
              label={"تلفن ۲"}
              value={lab.telephone2 ?? "---"}
              disabled
              className="bg-background-paper"
            />
          </div>
          <div className="w-1/3">
            <Input
              label={"داخلی تلفن ۲"}
              value={lab.add_telephone2 ?? "-"}
              disabled
              className="bg-background-paper"
            />
          </div>
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            label={"ایمیل"}
            value={lab.email ?? "---"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            label={"شماره همراه"}
            value={lab.phone_number ?? "---"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={
              lab.technical_manager_obj?.first_name +
              " " +
              lab.technical_manager_obj?.last_name
            }
            label={"مدیر فنی"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={
              lab.operators_obj && lab.operators_obj.length > 0
                ? lab.operators_obj
                    .map(
                      (operator: any) =>
                        operator.first_name + " " + operator.last_name,
                    )
                    .join("، ")
                : lab.operator_obj
                  ? lab.operator_obj.first_name +
                    " " +
                    lab.operator_obj.last_name
                  : "---"
            }
            label={"اپراتور"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={lab.control_code ?? "---"}
            label={"کد کنترلی آزمایشگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={lab.economic_number ?? "---"}
            label={"شماره اقتصادی آزمایشگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={lab.national_id ?? "---"}
            label={"شناسه ملی آزمایشگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={lab.fax ?? "---"}
            label={"دورنگار آزمایشگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={lab.postal_code ?? "---"}
            label={"کدپستی آزمایشگاه"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Input
            value={getStatus(lab.status)}
            label={"وضعیت"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4">
          <Input
            value={lab.address ?? "---"}
            label={"آدرس"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4">
          <Input
            value={lab.response_hours ?? "---"}
            label={"ساعت پاسخگویی"}
            disabled
            className="bg-background-paper"
          />
        </div>
        <div className="col-span-4">
          <div className="pb-2">
            <label className="text-[13px] font-bold">شرح آزمایشگاه</label>
          </div>
          <div
            className="rounded-[8px] border border-typography-secondary border-opacity-15 bg-background-paper p-[10px]"
            dangerouslySetInnerHTML={{
              __html: lab.description,
            }}
          />
          {/* <TextArea
            value={lab.description.length ? lab.description : "---"}
            label={"شرح آزمایشگاه"}
            disabled
            className="bg-background-paper"
          /> */}
        </div>
        <div className="col-span-4 md:col-span-2">
          <input
            type="checkbox"
            checked={isoApproval}
            name="isoApproval"
            className={`accent-black h-3 w-3`}
          ></input>
          <label
            htmlFor="sharifEmailApproval"
            className={`pr-2 text-[14px] font-medium`}
          >
            آزمایشگاه دارای ایزو 17025 می‌باشد.
          </label>
        </div>
        <div className="col-span-4 flex justify-end md:col-span-2">
          <span
            className="mt-1 flex cursor-pointer flex-row gap-1 text-[13px] text-info"
            onClick={() => openModal(ModalKeys.PREVIEW_LAB_IMAGE, lab.image)}
          >
            <SvgIcon
              fillColor="info"
              className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
            >
              <IcImage />
            </SvgIcon>
            مشاهده عکس آزمایشگاه
          </span>
        </div>
      </div>
    </Card>
  );
};
export default LaboratoryDetails;
