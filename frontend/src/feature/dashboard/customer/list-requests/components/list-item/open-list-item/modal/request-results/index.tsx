import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose, IcDownload } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import { RequestType } from "@api/service/request/type";
import { Button } from "@kit/button";

const RequestResult = () => {
  const hideModal = useModalHandler((state) => state.hideModal);
  const requests = useModalHandler((state) => state.modalData);

  const downloadFile = (fileUrl: string | undefined) => {
    const link = document.createElement("a");
    link.href = fileUrl ? fileUrl : "";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card
      color={"white"}
      className="2xl:w-[30vw] w-[80vw] p-6 sm:w-[55vw] xl:w-[40vw]"
    >
      <span className="mb-6 flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">نتایج درخواست</h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <div className="flex flex-col gap-4">
        {requests
          ?.filter(
            (child: RequestType) =>
              child?.latest_status_obj?.step_obj?.name !== "رد شده",
          )
          ?.map((request: RequestType, index: number) => (
            <Card key={index} variant="outline" className="p-4">
              <div className="flex flex-col items-center justify-between pb-4 md:flex-row">
                <h6 className="text-[16px] font-bold">
                  آزمون:
                  <span className="pr-2 text-[15px] font-medium">
                    {request?.experiment_obj?.name}
                  </span>
                </h6>
                {!request.result_objs?.[0]?.file?.includes(
                  "noDataDefaultfile",
                ) && (
                  <Button
                    endIcon={
                      <SvgIcon
                        strokeColor={"white"}
                        className={"[&_svg]:h-[14px] [&_svg]:w-[14px]"}
                      >
                        <IcDownload />
                      </SvgIcon>
                    }
                    onClick={() =>
                      downloadFile(
                        request.result_objs !== undefined
                          ? request.result_objs?.[0].file
                          : "",
                      )
                    }
                  >
                    دریافت فایل نتیجه
                  </Button>
                )}
              </div>
              <Card color="paper" className="px-2 py-3">
                <h6 className="text-[15px] font-medium">
                  توضیحات نتیجه:
                  <span className="pr-2 text-[14px] font-normal">
                    {request?.result_objs?.[0]?.description}
                  </span>
                </h6>
              </Card>
            </Card>
          ))}
      </div>
    </Card>
  );
};

export default RequestResult;
