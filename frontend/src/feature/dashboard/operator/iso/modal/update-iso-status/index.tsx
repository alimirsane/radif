import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiIso } from "@api/iso";

const UpdateIsoStatus = () => {
  const clientQuery = useQueryClient();
  // modal handler
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const modalData = useModalHandler((state) => state.modalData);

  const { mutateAsync } = useMutation(
    apiIso(true, {
      success: "تغییر وضعیت استاندارد موفقیت آمیز بود",
      fail: "تغییر وضعیت استاندارد انجام نشد",
      waiting: "در حال انجام",
    }).updateIsoStatus(),
  );
  const toggleIso = () => {
    const data = {
      is_visible_iso: !modalData.isoStatus,
    };
    mutateAsync(data)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiIso().url],
        });
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[45vw] lg:w-[35vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">تغییر وضعیت ایزو</h6>
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
        آیا از
        <span
          className={`font-semibold ${modalData.isoStatus ? "text-error" : "text-success"}`}
        >
          {" "}
          &quot;{modalData.isoStatus ? "غیرفعال" : "فعال"}&quot;{" "}
        </span>
        کردن ایزو ۱۷۰۲۵ برای آزمایشگاه‌ها اطمینان دارید؟
      </Card>
      <div className="flex justify-center gap-[12px] pb-1">
        <Button className="w-[100px] " variant="outline" onClick={hideModal}>
          خیر
        </Button>
        <Button className="w-[100px] " onClick={toggleIso}>
          بله
        </Button>
      </div>
    </Card>
  );
};

export default UpdateIsoStatus;
