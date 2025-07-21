import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { useModalHandler } from "@utils/modal-handler/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { apiForm } from "@api/service/form";

const DeleteForm = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const form = useModalHandler((state) => state.modalData);
  // delete form api
  const { mutateAsync } = useMutation(
    apiForm(true, {
      success: "حذف فرم موفقیت آمیز بود",
      fail: "حذف فرم انجام نشد",
      waiting: "در حال انتظار",
    }).delete(form.id),
  );
  // delete form
  const deleteFormHandler = () => {
    mutateAsync(form.id)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiForm().url],
        });
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[40vw] lg:w-[30vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">حذف فرم</h6>
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
        آیا از حذف فرم &quot;{form.title}&quot; اطمینان دارید؟
      </Card>
      <div className="flex justify-center gap-[12px] pb-1">
        <Button className="w-[100px] " variant="outline" onClick={hideModal}>
          خیر
        </Button>
        <Button className="w-[100px] " onClick={deleteFormHandler}>
          بله
        </Button>
      </div>
    </Card>
  );
};

export default DeleteForm;
