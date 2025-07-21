import { Card } from "@kit/card";
import { useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { Status } from "@kit/status";
import { ColorTypes } from "@kit/common/color-type";
import { RequestStatus } from "@api/service/request/type/request-status";
import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { DateHandler } from "@utils/date-handler";

const RequestHistory = () => {
  const hideModal = useModalHandler((state) => state.hideModal);
  const modalData = useModalHandler((state) => state.modalData);
  // const { data: users } = useQuery(apiUser().getAll());
  // const getExpertName = (expertId: number) => {
  //   return `${
  //     (
  //       users?.data.find(
  //         (user) => (user as CurrentUserType).id === expertId,
  //       ) as CurrentUserType
  //     )?.first_name
  //   } ${
  //     (
  //       users?.data.find(
  //         (user) => (user as CurrentUserType).id === expertId,
  //       ) as CurrentUserType
  //     )?.last_name
  //   }`;
  // };
  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case "در انتظار اپراتور":
        return `در انتظار بررسی و تایید اپراتور می‌باشد.`;
      case "در ‌انتظار پذیرش":
        return `در انتظار بررسی و تایید پذیرش می‌باشد.`;
      case "در انتظار پرداخت":
        return `در انتظار پرداخت مشتری می‌باشد.`;
      case "در ‌انتظار نمونه":
        return `در انتظار تحویل نمونه به پذیرش می‌باشد.`;
      case "در حال انجام":
        return `در انتظار انجام و اعلام نتایج توسط کارشناس آزمایشگاه می‌باشد.`;
      case "تکمیل شده":
        return `توسط ${
          modalData.request[modalData.request.length - 2].action_by_name
        } تایید و تکمیل شده است.`;
      case "رد شده":
        return `توسط ${
          modalData.request[modalData.request.length - 2].action_by_name
        } رد شده است.`;
      default:
        return ``;
    }
  };
  return (
    <Card
      color={"white"}
      className="2xl:w-[40vw] max-h-[95vh] w-[95vw] overflow-y-auto px-4 py-6 md:w-[75vw] md:px-8 xl:w-[55vw]"
    >
      <span className="mb-7 flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">تاریخچه درخواست</h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>

      {modalData?.request
        ?.toReversed()
        ?.map((step: RequestStatus, index: number) => (
          <Card
            key={index}
            className={`
            my-3 rounded-[12px] border-[1px] border-r-[10px] px-[16px] py-[16px]
            ${`border-${step.step_obj.step_color}`}
        `}
          >
            <div className="flex flex-col items-center gap-1 md:flex-row md:gap-4">
              <span className="w-full md:w-[20%]">
                <Status color={step.step_obj.step_color as ColorTypes}>
                  {step.step_obj.name}
                </Status>
              </span>
              {index === 0 ? (
                <div
                  className={`w-full text-[14px] ${step.step_obj.name === "تکمیل شده" || step.step_obj.name === "رد شده" ? "md:w-[72%]" : "md:w-[83%]"}`}
                >
                  {`درخواست آزمون ${modalData.experiment.name} ${getStatusText(step.step_obj.name)}`}
                </div>
              ) : (
                <>
                  <div className="w-full text-[14px] md:w-[26%]">
                    <span className="ml-1 font-medium text-typography-gray">
                      وضعیت:
                    </span>
                    {step.complete ? (step.accept ? "تایید" : "رد") : "نامشخص"}
                  </div>
                  <div className="w-full text-[14px] md:w-[46%]">
                    <span className="ml-1 font-medium text-typography-gray">
                      توسط:
                    </span>
                    {step.action_by_name ?? "---"}
                  </div>
                </>
              )}
              {(index === 0 && step.step_obj.name === "تکمیل شده") ||
              (index === 0 && step.step_obj.name === "رد شده") ||
              index !== 0 ? (
                <div className="flex w-full justify-end text-[13px] text-typography-gray md:w-[8%]">
                  {DateHandler.formatDate(step.updated_at, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>
              ) : (
                <></>
              )}
            </div>

            {step.step_obj.name === "رد شده" && (
              <div className="flex flex-row justify-end">
                <span className="w-full px-1 pt-1 text-[14px] md:w-[80%]">
                  <span className="ml-1 font-medium text-typography-gray">
                    علت رد درخواست:
                  </span>
                  {modalData.request[modalData.request.length - 2].description}
                </span>
              </div>
            )}
          </Card>
        ))}
    </Card>
  );
};

export default RequestHistory;
