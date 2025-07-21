import { Card } from "@kit/card";
import { useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiDevice } from "@api/service/device";
import { useRouter } from "next/router";

const DeviceDelete = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const device = useModalHandler((state) => state.modalData);
  // device delete api
  const { mutateAsync: deletedDevice } = useMutation(
    apiDevice(true, {
      success: "حذف دستگاه موفقیت آمیز بود",
      fail: "حذف دستگاه انجام نشد",
      waiting: "در حال انتظار",
    }).delete(device.id),
  );
  // delete device
  const deletedDeviceHandler = () => {
    deletedDevice(device.id)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiDevice().url],
        });
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[40vw] lg:w-[30vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">حذف دستگاه</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <Card
        color={"info"}
        className="mb-8 mt-7 px-4 py-7 text-center text-[14px]"
      >
        آیا از حذف دستگاه &quot;{device.name}&quot; اطمینان دارید؟
      </Card>
      <div className="flex justify-center gap-[12px] pb-1">
        <Button className="w-[100px] " variant="outline" onClick={hideModal}>
          خیر
        </Button>
        <Button className="w-[100px] " onClick={deletedDeviceHandler}>
          بله
        </Button>
      </div>
    </Card>
  );
};

export default DeviceDelete;
