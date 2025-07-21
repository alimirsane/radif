import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { apiGrantRecord } from "@api/service/grant-record";
import { apiGrantRequest } from "@api/service/grant-request";
import { useModalHandler } from "@utils/modal-handler/config";
import { useRouter } from "next/router";

const RevokeGrant = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // close modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get grant request details from modal
  const grantRequest = useModalHandler((state) => state.modalData);
  // revoke grant request api
  const { mutateAsync } = useMutation(
    apiGrantRequest(true, {
      success: "بازپس گیری درخواست گرنت موفقیت آمیز بود",
      fail: "بازپس گیری درخواست گرنت انجام نشد",
      waiting: "در حال انتظار",
    }).revokeGrant(grantRequest.id),
  );
  // revoke grant request
  const revokeGrantRequest = () => {
    mutateAsync({})
      .then((res) => {
        hideModal();
        // refetch grant requests list
        clientQuery.invalidateQueries({
          queryKey: [apiGrantRequest().url],
        });
        clientQuery.invalidateQueries({
          queryKey: [apiGrantRecord().url],
        });
        router.query.action = "revoked";
        router.push(router);
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[40vw] lg:w-[30vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">بازپس گیری درخواست گرنت</h6>
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
        آیا از بازپس گیری درخواست گرنت &quot;
        {grantRequest.sender_obj.first_name} {grantRequest.sender_obj.last_name}
        &quot; اطمینان دارید؟
      </Card>
      <div className="flex justify-center gap-[12px] pb-1">
        <Button className="w-[100px]" variant="outline" onClick={hideModal}>
          خیر
        </Button>
        <Button className="w-[100px]" onClick={revokeGrantRequest}>
          بله
        </Button>
      </div>
    </Card>
  );
};

export default RevokeGrant;
