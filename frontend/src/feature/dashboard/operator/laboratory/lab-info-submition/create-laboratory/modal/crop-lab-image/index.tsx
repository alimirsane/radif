import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";
import getCroppedImg from "./cropping";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";

const CropLabImage = (props: {
  imagePreview?: string;
  onSave?: (image: string) => void;
  onCancel?: () => void;
}) => {
  const { imagePreview, onSave, onCancel } = props;
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const modalData = useModalHandler((state) => state.modalData);

  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState<any>(null);
  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCropArea(croppedAreaPixels);
    },
    [],
  );

  const saveCroppedImage = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(
        imagePreview ? imagePreview! : modalData.imagePreview!,
        cropArea,
      );
      setCroppedImage(croppedImageUrl);
      if (onSave && onCancel) {
        onSave(croppedImageUrl);
        onCancel();
      } else {
        modalData.onSave(croppedImageUrl);
        hideModal();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card
      color={"white"}
      className={
        imagePreview
          ? ""
          : "max-h-[90vh] w-[90vw] p-6 md:min-h-[95vh] md:w-[80vw] xl:w-[60vw]"
      }
    >
      {!imagePreview && (
        <>
          <span className="flex flex-row items-center justify-between md:mb-8">
            <h6 className="text-[20px] font-[700]">عکس آزمایشگاه</h6>
            <Fab
              className="bg-error-light bg-opacity-60 p-1"
              onClick={hideModal}
            >
              <SvgIcon fillColor={"black"}>
                <IcClose />
              </SvgIcon>
            </Fab>
          </span>
        </>
      )}
      <p className="px-3 pb-3 text-[14px] text-common-gray-dark">
        <span className="font-semibold text-common-black">توجه: </span>
        تصویر انتخابی با نسبت ۳:۲ نمایش داده می‌شود. برای نمایش بهتر، لطفاً
        تصویری متناسب با این نسبت انتخاب کنید.
      </p>
      <div className="flex flex-col items-center px-3 md:h-[80vh]">
        <div className="relative h-[80vh] max-h-[80vh] w-full">
          <Cropper
            image={imagePreview ? imagePreview! : modalData.imagePreview!}
            crop={crop}
            zoom={zoom}
            // aspect={1} // 1 * 1
            aspect={3 / 2} // 3 * 2
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex w-full flex-row justify-end gap-3 pt-7">
          <Button variant="outline" onClick={onCancel ?? hideModal}>
            لغو
          </Button>
          <Button onClick={saveCroppedImage} variant="solid" color="primary">
            ذخیره تغییرات
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CropLabImage;
