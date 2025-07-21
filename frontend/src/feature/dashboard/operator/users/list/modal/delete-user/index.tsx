import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { useModalHandler } from "@utils/modal-handler/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { apiUser } from "@api/service/user";
import { useReloadUsers } from "../../get-info-user";

const DeleteUser = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  const { setReloadUsers } = useReloadUsers();
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const user = useModalHandler((state) => state.modalData);
  const isCustomer = useMemo(() => {
    return router.asPath.includes("customer");
  }, [router]);

  const labelCustomerUser = useMemo(() => {
    return isCustomer ? "مشتری" : "همکار";
  }, [isCustomer]);
  // delete user api
  const { mutateAsync } = useMutation(
    apiUser(true, {
      success: `حذف ${labelCustomerUser} موفقیت آمیز بود`,
      fail: `حذف ${labelCustomerUser} انجام نشد`,
      waiting: "در حال انتظار",
    }).delete(user.id),
  );
  // delete user
  const deletedHandler = () => {
    mutateAsync(user.id)
      .then((res) => {
        // refetch data
        // clientQuery.invalidateQueries({
        //   queryKey: [apiUser().url],
        // });
        setReloadUsers(true);
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[45vw] lg:w-[35vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">حذف {labelCustomerUser}</h6>
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
        آیا از حذف {labelCustomerUser} &quot;{user.first_name} {user.last_name}
        &quot; اطمینان دارید؟
      </Card>
      <div className="flex justify-center gap-[12px] pb-1">
        <Button className="w-[100px] " variant="outline" onClick={hideModal}>
          خیر
        </Button>
        <Button className="w-[100px] " onClick={deletedHandler}>
          بله
        </Button>
      </div>
    </Card>
  );
};

export default DeleteUser;
