import { Fab } from "@kit/fab";
import Image from "next/image";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";

const PreviewLabImage = () => {
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const imagePreview = useModalHandler((state) => state.modalData);

  return (
    <Card
      color={"white"}
      className="max-h-[90vh] w-[90vw] p-6 md:min-h-[95vh] md:w-[80vw] xl:w-[60vw]"
      // className="flex max-h-[100vh] min-h-[95vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[80vw] xl:w-[60vw]"
    >
      <span className="flex flex-row items-center justify-between md:mb-8">
        <h6 className="text-[20px] font-[700]">عکس آزمایشگاه</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <div className="flex items-center md:h-[80vh]">
        <div className="relative h-[70vh] max-h-[80vh] w-full">
          <Image
            src={imagePreview}
            alt="Laboratory image preview"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
    </Card>
  );
};

export default PreviewLabImage;
