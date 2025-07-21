import { useModalHandler } from "@utils/modal-handler/config";
import { IcClose } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { Card } from "@kit/card";
import { Fab } from "@kit/fab";

export const InactiveResource = () => {
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get test data
  const modalData = useModalHandler<
    | {
        laboratoryStatus?: string;
        experimentStatus?: string;
        deviceStatus?: string;
      }
    | undefined
  >((state) => state.modalData);

  return (
    <Card
      color={"paper"}
      className="flex max-h-[95vh] w-[95vw] flex-col px-7 pb-6 pt-4 md:max-h-[80vh] md:w-[40vw] md:pb-8 md:pt-6"
    >
      <div className="flex flex-row items-center justify-between md:mb-4">
        <h6 className="text-[22px] font-[700]">ثبت درخواست</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      {(modalData?.laboratoryStatus === "inactive" ||
        modalData?.experimentStatus === "inactive" ||
        modalData?.deviceStatus === "inactive") && (
        <Card
          color="info"
          className="mt-2 flex flex-col items-center justify-center gap-3 border border-background-paper-dark px-2 py-8 md:px-6"
        >
          <p>امکان ثبت درخواست برای این آزمون وجود ندارد.</p>

          <p className="px-1 text-[15px] text-error">
            {modalData?.laboratoryStatus === "inactive" &&
              "آزمایشگاه انتخاب شده غیرفعال می‌باشد."}
            {modalData?.experimentStatus === "inactive" &&
              "آزمون انتخاب شده غیرفعال می‌باشد."}
            {modalData?.deviceStatus === "inactive" &&
              "دستگاه مربوطه غیرفعال می‌باشد."}
          </p>
        </Card>
      )}
    </Card>
  );
};
