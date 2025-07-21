import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { SvgIcon } from "@kit/svg-icon";
import { TextArea } from "@kit/text-area";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";

const DeviceDetail = () => {
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get device details form modal
  const device = useModalHandler((state) => state.modalData);
  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[40vw] lg:w-[30vw]">
      <span className="mb-7 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">جزئیات دستگاه</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <div className="flex flex-col gap-6 pb-4">
        <Input
          value={device?.name}
          label={"نام دستگاه"}
          disabled
          className="bg-background-paper"
        />
        <Input
          value={device?.model}
          label={"مدل"}
          disabled
          className="bg-background-paper"
        />
        <TextArea
          label={"کاربرد"}
          value={device?.application ?? "---"}
          disabled
          className="bg-background-paper"
        />
        <TextArea
          value={device?.description ?? "---"}
          label={"شرح خدمات"}
          disabled
          className="bg-background-paper"
        />
      </div>
    </Card>
  );
};
export default DeviceDetail;
