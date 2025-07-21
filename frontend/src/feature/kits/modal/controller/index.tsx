import {
  ModalKeys,
  useModalHandler,
} from "../../../../utils/modal-handler/config";
import { Button } from "@kit/button";

export const ModalControllerLayout = () => {
  const openModal = useModalHandler((state) => state.openModal);

  const handleOpenModal = (modalKey: ModalKeys) => () => {
    openModal(modalKey);
  };

  return (
    <>
      <Button onClick={handleOpenModal(ModalKeys.SAMPLE)}>مودال ساده</Button>
      <Button onClick={handleOpenModal(ModalKeys.SAMPLE_FULL_SCREEN_MD)}>
        مودال فول اسکرین در ریسپانسیو
      </Button>
      <Button onClick={handleOpenModal(ModalKeys.SAMPLE_DISMISS_OUTSIDE)}>
        مودال بستن با کلیک بیرون
      </Button>
    </>
  );
};
