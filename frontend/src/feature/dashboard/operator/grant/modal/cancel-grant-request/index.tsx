import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { apiUser } from "@api/service/user";
import { IcClose } from "@feature/kits/common/icons";
import { apiGrantRequest } from "@api/service/grant-request";
import { useModalHandler } from "@utils/modal-handler/config";
import { GrantStatusType } from "@api/service/grant-request/type/grant-status-type";
import { routes } from "@data/routes";

const CancelGrant = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // close modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get grant request details from modal
  const grantRequest = useModalHandler((state) => state.modalData);
  // get current user data
  const { data: user } = useQuery({
    ...apiUser().me(),
  });
  // update grant request api
  const { mutateAsync } = useMutation(
    apiGrantRequest(true, {
      success: "لغو درخواست گرنت موفقیت آمیز بود",
      fail: "لغو درخواست گرنت انجام نشد",
      waiting: "در حال انتظار",
    }).update(grantRequest.id),
  );
  // POST: Cancel grant request
  const cancelGrantRequest = () => {
    const data = {
      requested_amount: grantRequest.requested_amount,
      approved_amount: grantRequest.approved_amount ?? 0,
      approved_datetime: grantRequest.approved_datetime,
      datetime: grantRequest.datetime,
      expiration_date: grantRequest.expiration_date,
      status: GrantStatusType.CANCELED,
      sender: grantRequest.sender,
      receiver: grantRequest.receiver,
    };
    mutateAsync(data)
      .then((res) => {
        hideModal();
        // refetch grant requests list
        clientQuery.invalidateQueries({
          queryKey: [apiGrantRequest().url],
        });
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[40vw] lg:w-[30vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">لغو درخواست گرنت</h6>
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
        آیا از لغو درخواست گرنت
        {router.route.includes(routes.operator())
          ? ` "${grantRequest.sender_obj.first_name} ${grantRequest.sender_obj.last_name}" `
          : " "}
        اطمینان دارید؟
      </Card>
      <div className="flex justify-center gap-[12px] pb-1">
        <Button className="w-[100px]" variant="outline" onClick={hideModal}>
          خیر
        </Button>
        <Button className="w-[100px]" onClick={cancelGrantRequest}>
          بله
        </Button>
      </div>
    </Card>
  );
};

export default CancelGrant;
