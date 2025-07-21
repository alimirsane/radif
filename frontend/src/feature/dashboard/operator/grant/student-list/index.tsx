import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { GrantRequestType } from "@api/service/grant-request/type";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { GrantStatusType } from "@api/service/grant-request/type/grant-status-type";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { DateHandler } from "@utils/date-handler";

const StudentList = ({
  grantRequests,
}: {
  grantRequests: GrantRequestType[];
}) => {
  const openModal = useModalHandler((state) => state.openModal);

  const handleOpenModal =
    (modal: ModalKeys, request: GrantRequestType) => () => {
      openModal(modal, request);
    };
  const getStatusText = (status: string) => {
    switch (status) {
      case GrantStatusType.APPROVED:
        return (
          <span className="rounded-full bg-success bg-opacity-10 px-3 py-2 text-[13px] font-semibold text-success-dark">
            تایید شده
          </span>
        );
      case GrantStatusType.CANCELED:
        return (
          <span className="rounded-full bg-error bg-opacity-10 px-3 py-2 text-[13px] font-semibold text-error-dark">
            رد شده
          </span>
        );
      case GrantStatusType.SEEN:
        return (
          <span className="rounded-full bg-info bg-opacity-10 px-3 py-2 text-[13px] font-semibold text-info-dark">
            در حال بررسی
          </span>
        );

      case GrantStatusType.SENT:
        return (
          <span className="rounded-full bg-warning bg-opacity-10 px-3 py-2 text-[13px] font-semibold text-warning">
            در انتظار بررسی
          </span>
        );
    }
  };
  return (
    <div>
      {!grantRequests.length && (
        <Card color="info" className="w-full p-7 text-center text-[14px]">
          <p>شما هنوز هیچ درخواست گرنتی دریافت نکرده‌اید.</p>
        </Card>
      )}
      {!!grantRequests.length && (
        <>
          <Card
            className="flex w-full flex-nowrap justify-between gap-6 overflow-x-auto whitespace-nowrap bg-background-paper-dark px-4 py-7 
        font-bold md:px-9 lg:gap-2 lg:whitespace-normal"
          >
            <span className="w-full lg:w-[15%]">نام دانشجو</span>
            <span className="w-full lg:w-[13%]">اعتبار درخواستی</span>
            <span className="w-full lg:w-[13%]">اعتبار اعطا شده</span>
            <span className="w-full lg:w-[13%]">اعتبار باقیمانده</span>
            <span className="w-full lg:w-[13%]">تاریخ درخواست</span>
            <span className="w-full lg:w-[13%]">وضعیت</span>
            <span className="w-full lg:w-[20%]">اقدامات</span>
          </Card>
          {grantRequests?.toReversed().map((request, index) => (
            <Card
              key={index}
              color={index % 2 === 0 ? "paper" : "white"}
              variant={index % 2 === 0 ? "flat" : "outline"}
              className="mt-[16px] flex w-full flex-nowrap items-center justify-between gap-6 overflow-x-auto whitespace-nowrap
          px-4 py-5 md:px-9 lg:gap-2 lg:whitespace-normal"
            >
              <span className="w-full lg:w-[15%]">{`${request.sender_obj.first_name} ${request.sender_obj.last_name}`}</span>
              <span className="w-full lg:w-[13%]">
                {request.requested_amount.toLocaleString()}
                <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
              </span>
              <span className="w-full lg:w-[13%]">
                {request.status === GrantStatusType.APPROVED ||
                request.status === GrantStatusType.CANCELED ? (
                  <>
                    {request.approved_amount.toLocaleString()}
                    <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
                  </>
                ) : (
                  "---"
                )}
              </span>
              <span className="w-full lg:w-[13%]">
                {request.status === GrantStatusType.APPROVED ||
                request.status === GrantStatusType.CANCELED ? (
                  <>
                    {request?.remaining_amount?.toLocaleString()}
                    <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
                  </>
                ) : (
                  "---"
                )}
              </span>
              {/* <span className="w-full lg:w-[18%]">
                {request.approved_amount.toLocaleString()}
                {request.approved_amount !== 0 && (
                  <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
                )}
              </span> */}
              <span className="w-full lg:w-[13%]">
                {request.datetime
                  ? DateHandler.formatDate(request.datetime, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "---"}
              </span>
              <span className="w-full lg:w-[13%]">
                {getStatusText(request.status)}
              </span>
              <span className="flex w-full flex-row gap-3 lg:w-[20%]">
                {(request.status === GrantStatusType.SEEN ||
                  request.status === GrantStatusType.SENT) && (
                  <>
                    <AccessLevel
                      module={"grantrequest"}
                      permission={["update"]}
                    >
                      <Button
                        variant={"outline"}
                        onClick={handleOpenModal(
                          ModalKeys.CANCEL_GRANT_REQUEST,
                          request,
                        )}
                      >
                        لغو درخواست
                      </Button>
                    </AccessLevel>
                    <AccessLevel
                      module={"grantrequest"}
                      permission={["update"]}
                    >
                      <Button
                        color={"primary"}
                        onClick={handleOpenModal(ModalKeys.GRANTED, request)}
                      >
                        اعطای گرنت
                      </Button>
                    </AccessLevel>
                  </>
                )}
                {request.status === GrantStatusType.APPROVED &&
                  request?.remaining_amount !== 0 && (
                    <AccessLevel
                      module={"grantrequest"}
                      permission={["update"]}
                    >
                      <Button
                        variant={"outline"}
                        className="px-5"
                        onClick={handleOpenModal(
                          ModalKeys.REVOKE_GRANT_REQUEST,
                          request,
                        )}
                      >
                        بازپس گیری
                      </Button>
                    </AccessLevel>
                  )}
              </span>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default StudentList;
