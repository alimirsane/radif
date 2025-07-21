import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { Button } from "@kit/button";
import { useRouter } from "next/router";
import { SvgIcon } from "@kit/svg-icon";
import { apiRequest } from "@api/service/request";
import { apiWorkflow } from "@api/service/workflow";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiNotification } from "@api/service/notifications";
import { useState } from "react";

const AcceptRequest = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // modal handler
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const modalData = useModalHandler((state) => state.modalData);
  // set isloading to handle request buttons
  const [isLoading, setIsLoading] = useState(false);
  // update request status api
  const { mutateAsync: updateRequestStatus } = useMutation(
    apiRequest(true, {
      success: "تایید درخواست موفقیت آمیز بود",
      fail: "تایید درخواست انجام نشد",
      waiting: "در حال انتظار",
    }).updateRequestStatus(modalData.requestId ?? -1),
  );

  // update request status
  const submitRequest = () => {
    setIsLoading(true);
    const data = {
      description: "مورد تایید است.",
      action: "next",
    };
    updateRequestStatus(data)
      .then((res) => {
        setIsLoading(false);
        hideModal();
        if (router.query.hasOwnProperty("request_status")) {
          delete router.query.request_status;
          // router.push(router);
        }
        // change router query
        delete router.query.request_id;
        router.push(router);
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiRequest().url],
        });
        clientQuery.invalidateQueries({
          queryKey: [apiWorkflow().url],
        });
        clientQuery.invalidateQueries({
          queryKey: [apiNotification().url],
        });
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[40vw] lg:w-[30vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">تایید درخواست</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      {isLoading ? (
        <Card color={"info"} className="mt-7 px-4 py-7 text-center text-[14px]">
          در حال تایید درخواست ...
        </Card>
      ) : (
        <>
          <Card
            color={"info"}
            className="mb-8 mt-7 px-4 py-7 text-center text-[14px]"
          >
            آیا از تایید درخواست آزمون &quot;{modalData.experimentName}&quot;
            اطمینان دارید؟
          </Card>
          <div className="flex justify-center gap-[12px] pb-1">
            <Button
              className="w-[100px] "
              variant="outline"
              onClick={hideModal}
            >
              خیر
            </Button>
            <Button className="w-[100px] " onClick={submitRequest}>
              بله
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default AcceptRequest;
