import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import {
  IcCheckCircle,
  IcClose,
  IcCloseCircle,
  IcQuestionCircle,
} from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import Badge from "@feature/kits/badge";
import { DateHandler } from "@utils/date-handler";
import { RequestType } from "@api/service/request/type";
import { routes } from "@data/routes";
import { useRouter } from "next/router";

const LabsnetGrantsList = () => {
  const router = useRouter();
  const hideModal = useModalHandler((state) => state.hideModal);

  // get request data from modal
  const request = useModalHandler((state) => state.modalData);

  const getLabsnetStatus = (status: number | undefined) => {
    switch (status) {
      case 1:
        return (
          <>
            <SvgIcon
              fillColor={"info"}
              className={"mt-[4px] [&_svg]:h-[14px] [&_svg]:w-[14px]"}
            >
              <IcQuestionCircle />
            </SvgIcon>
            <span>ثبت نشده</span>
          </>
        );
      case 2:
        return (
          <>
            <SvgIcon
              fillColor={"success"}
              className={"mt-[4px] [&_svg]:h-[14px] [&_svg]:w-[14px]"}
            >
              <IcCheckCircle />
            </SvgIcon>
            <span>ثبت موفق</span>
          </>
        );
      case 3:
        return (
          <>
            <SvgIcon
              fillColor={"error"}
              className={"mt-[4px] [&_svg]:h-[14px] [&_svg]:w-[14px]"}
            >
              <IcCloseCircle />
            </SvgIcon>
            <span>ثبت ناموفق</span>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      color={"white"}
      className="2xl:w-[20vw] max-h-[95vh] w-[90vw] overflow-y-auto px-8 pb-9 pt-6 sm:w-[50vw] xl:max-h-[95vh] xl:w-[35vw]"
    >
      <span className="mb-6 flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">گرنت‌ لبزنت</h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <h2 className="mb-2 text-[18px] font-[600] text-common-gray">
        گرنت‌های لبزنت درخواستی
      </h2>
      {request?.labsnet ? (
        // <div className="flex flex-col gap-6">
        //   <Input
        //     name="labsnetGrant1"
        //     value={
        //       request?.labsnet_code1?.length !== 0
        //         ? request?.labsnet_code1
        //         : "گرنتی ثبت نشده است"
        //     }
        //     label="گرنت اول"
        //     className="bg-background-paper"
        //     disabled
        //   />
        //   <Input
        //     name="labsnetGrant2"
        //     value={
        //       request?.labsnet_code2?.length !== 0
        //         ? request?.labsnet_code2
        //         : "گرنتی ثبت نشده است"
        //     }
        //     label="گرنت دوم"
        //     className="bg-background-paper"
        //     disabled
        //   />
        // </div>
        <div className="flex flex-col gap-6">
          {request?.labsnet1_obj &&
            Object.keys(request?.labsnet1_obj).length > 0 && (
              <Card
                color="white"
                variant="outline"
                className={`flex w-full cursor-pointer flex-col gap-4 px-4 py-5 md:items-center md:pb-4`}
              >
                <div className="flex w-full flex-row">
                  <span className="flex flex-row items-center gap-2">
                    <span className="flex flex-grow flex-row items-center gap-2 overflow-hidden text-[15px] font-bold">
                      {request?.labsnet1_obj?.title}
                    </span>
                  </span>
                </div>
                <div className="flex w-full flex-col md:flex-row">
                  <div className="flex w-full flex-col gap-[14px] md:w-[50%] md:pt-[2px]">
                    <span className="flex flex-row items-center gap-2">
                      <span className="flex flex-grow flex-row items-center gap-2 overflow-hidden text-[14px]">
                        میزان تخفیف:
                        <Badge
                          color="primary"
                          className="bg-opacity-15 px-3 pt-[6px] text-[13px] font-bold text-primary"
                        >
                          {request?.labsnet1_obj?.percent}%
                        </Badge>
                      </span>
                    </span>
                    <div className="flex w-full flex-row flex-wrap justify-start gap-1 overflow-hidden text-[14px]">
                      تاریخ انقضا:
                      <span className="font-[500]">
                        {DateHandler.formatDate(
                          request?.labsnet1_obj?.end_date,
                          {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="md:pt-auto flex flex-col gap-2 md:w-[50%]">
                    <div className="flex w-full flex-row flex-wrap gap-1 overflow-hidden pb-1 text-[15px] md:justify-end md:gap-0 md:px-4">
                      <span className="md:hidden">مبلغ گرنت: </span>
                      <span className="font-bold text-typography-secondary">
                        {request?.labsnet1_obj?.amount}
                        <span className="mr-1 text-[13px] font-[400]">
                          (ریال)
                        </span>
                      </span>
                    </div>
                    <div className="flex w-full flex-row items-center rounded-[8px] bg-background-paper bg-opacity-80 px-4 py-2">
                      <div className="flex w-full flex-row flex-wrap items-center justify-between">
                        <h6 className="text-[14px] font-[400]">
                          مبلغ باقیمانده
                        </h6>
                        <span className={`text-[16px] font-[600]`}>
                          {request?.labsnet1_obj?.remain}
                          <span className="mr-1 text-[13px] font-[400]">
                            (ریال)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          {request?.labsnet2_obj &&
            Object.keys(request?.labsnet2_obj).length > 0 && (
              <Card
                color="white"
                variant="outline"
                className={`flex w-full cursor-pointer flex-col gap-4 px-4 py-5 md:items-center md:pb-4`}
              >
                <div className="flex w-full flex-row">
                  <span className="flex flex-row items-center gap-2">
                    <span className="flex flex-grow flex-row items-center gap-2 overflow-hidden text-[15px] font-bold">
                      {request?.labsnet2_obj?.title}
                    </span>
                  </span>
                </div>
                <div className="flex w-full flex-col md:flex-row">
                  <div className="flex w-full flex-col gap-[14px] md:w-[50%] md:pt-[2px]">
                    <span className="flex flex-row items-center gap-2">
                      <span className="flex flex-grow flex-row items-center gap-2 overflow-hidden text-[14px]">
                        میزان تخفیف:
                        <Badge
                          color="primary"
                          className="bg-opacity-15 px-3 pt-[6px] text-[13px] font-bold text-primary"
                        >
                          {request?.labsnet2_obj?.percent}%
                        </Badge>
                      </span>
                    </span>
                    <div className="flex w-full flex-row flex-wrap justify-start gap-1 overflow-hidden text-[14px]">
                      تاریخ انقضا:
                      <span className="font-[500]">
                        {DateHandler.formatDate(
                          request?.labsnet1_obj?.end_date,
                          {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="md:pt-auto flex flex-col gap-2 md:w-[50%]">
                    <div className="flex w-full flex-row flex-wrap gap-1 overflow-hidden pb-1 text-[15px] md:justify-end md:gap-0 md:px-4">
                      <span className="md:hidden">مبلغ گرنت: </span>
                      <span className="font-bold text-typography-secondary">
                        {request?.labsnet2_obj?.amount}
                        <span className="mr-1 text-[13px] font-[400]">
                          (ریال)
                        </span>
                      </span>
                    </div>
                    <div className="flex w-full flex-row items-center rounded-[8px] bg-background-paper bg-opacity-80 px-4 py-2">
                      <div className="flex w-full flex-row flex-wrap items-center justify-between">
                        <h6 className="text-[14px] font-[400]">
                          مبلغ باقیمانده
                        </h6>
                        <span className={`text-[16px] font-[600]`}>
                          {request?.labsnet2_obj?.remain}
                          <span className="mr-1 text-[13px] font-[400]">
                            (ریال)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
        </div>
      ) : (
        <Card
          color={"info"}
          className="rounded-[8px] p-[22px] text-center text-[14px]"
        >
          درخواست استفاده از گرنت لبزنت ثبت نشده است.
        </Card>
      )}

      {router.pathname.includes(routes.operator()) && (
        <div className="mt-9 border-t border-paper-dark pt-6">
          <h2 className="mb-2 flex flex-row gap-1 text-[18px] font-[600] text-common-gray">
            جزئیات ثبت گرنت لبزنت درخواست
            <span>{request?.request_number}</span>
          </h2>
          <Card
            className="flex w-full flex-col px-4 pt-4"
            color="white"
            variant="outline"
          >
            <Card
              color="paper"
              className="flex flex-row gap-2 p-3 text-[16px] font-semibold"
            >
              <span className="w-full md:w-[50%]">نام آزمون</span>
              <span className="w-full md:w-[25%]">هزینه آزمون</span>
              <span className="w-full md:w-[25%]">وضعیت ثبت</span>
            </Card>
            {request?.child_requests?.map(
              (child: RequestType, index: number) => (
                <div
                  key={index}
                  className={`flex flex-row gap-2 ${index !== request?.child_requests?.length - 1 ? "border-b border-paper" : ""} border-opacity-20 px-3 py-4 text-[14px]`}
                >
                  <span className="w-full md:w-[50%]">
                    {child?.experiment_obj?.name}
                  </span>
                  <span className="w-full md:w-[25%]">
                    {Number(child?.price ?? 0)?.toLocaleString()}
                    <span className="mr-1 text-[12px]">(ریال)</span>
                  </span>
                  <span className="flex w-full flex-row gap-1 md:w-[25%]">
                    {getLabsnetStatus(child?.labsnet_status)}
                  </span>
                </div>
              ),
            )}
          </Card>
        </div>
      )}
    </Card>
  );
};

export default LabsnetGrantsList;
