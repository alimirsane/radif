import { useModalHandler } from "../../../utils/modal-handler/config";
import { Button } from "@kit/button";
import { Card } from "@kit/card";

export const ModalLayout = () => {
  const hideModal = useModalHandler((state) => state.hideModal);
  return (
    <Card color={"paper"} className={"h-full p-5"}>
      <Button onClick={hideModal}>بستن</Button>
      <p>این یک نمونه مودال است</p>
    </Card>
  );
};
