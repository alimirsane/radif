import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";

const LabsnetGrantReport = () => {
  const hideModal = useModalHandler((state) => state.hideModal);

  // get request data from modal
  const labsnet_result = useModalHandler((state) => state.modalData);
  return (
    <Card
      color={"white"}
      className="2xl:w-[20vw] w-[80vw] px-8 pb-9 pt-6 sm:w-[50vw] xl:w-[30vw]"
    >
      <span className="mb-8 flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">گزارش لبزنت</h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      {labsnet_result ? (
        <p className="text-[14px]">{labsnet_result}</p>
      ) : (
        <Card
          color={"info"}
          className="rounded-[8px] p-[22px] text-center text-[14px]"
        >
          گزارشی یافت نشد.
        </Card>
      )}
    </Card>
  );
};

export default LabsnetGrantReport;
