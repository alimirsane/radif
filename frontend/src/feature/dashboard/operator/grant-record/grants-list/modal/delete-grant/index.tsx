import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { useModalHandler } from "@utils/modal-handler/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { apiGrantRecord } from "@api/service/grant-record";

const DeleteGrant = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const grant = useModalHandler((state) => state.modalData);
  // delete grant api
  const { mutateAsync } = useMutation(
    apiGrantRecord(true, {
      success: "حذف گرنت موفقیت آمیز بود",
      fail: "حذف گرنت انجام نشد",
      waiting: "در حال انتظار",
    }).delete(grant.id),
  );
  // delete grant
  const deleteGrantHandler = () => {
    mutateAsync(grant.id)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiGrantRecord().url],
        });
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[40vw] lg:w-[30vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">حذف گرنت</h6>
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
        آیا از حذف گرنت &quot;{grant.title}&quot; اطمینان دارید؟
      </Card>
      <div className="flex justify-center gap-[12px] pb-1">
        <Button className="w-[100px]" variant="outline" onClick={hideModal}>
          خیر
        </Button>
        <Button className="w-[100px]" onClick={deleteGrantHandler}>
          بله
        </Button>
      </div>
    </Card>
  );
};

export default DeleteGrant;
