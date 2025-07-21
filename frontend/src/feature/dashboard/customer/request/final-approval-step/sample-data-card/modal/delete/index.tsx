import { Card } from "@kit/card";
import { useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { apiFormResponse } from "@api/service/form-response";
import { apiRequest } from "@api/service/request";

const SampleDelete = () => {
  const router = useRouter();
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const sample = useModalHandler((state) => state.modalData);
  const { mutateAsync } = useMutation(
    apiFormResponse(true, {
      success: "حذف نمونه موفقیت آمیز بود",
      fail: "حذف نمونه انجام نشد",
      waiting: "در حال انتظار",
    }).delete(sample.id.toString()),
  );

  const queryClient = useQueryClient();

  const deletedSampleHandler = () => {
    mutateAsync(sample.id.toString())
      .then((res) => {
        hideModal();
        queryClient.invalidateQueries({
          queryKey: [apiFormResponse().url],
        });
        queryClient.invalidateQueries({
          queryKey: [apiRequest().url],
        });
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[40vw] lg:w-[30vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">حذف نمونه</h6>
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
        آیا از حذف نمونه &quot;{sample.form_number}&quot; اطمینان دارید؟
      </Card>
      <div className="flex justify-center gap-[12px] pb-1">
        <Button className="w-[100px] " variant="outline" onClick={hideModal}>
          خیر
        </Button>
        <Button className="w-[100px] " onClick={deletedSampleHandler}>
          بله
        </Button>
      </div>
    </Card>
  );
};

export default SampleDelete;
