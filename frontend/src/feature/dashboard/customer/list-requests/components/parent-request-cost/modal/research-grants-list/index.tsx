import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { DateHandler } from "@utils/date-handler";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";

const ResearchGrantsList = () => {
  const hideModal = useModalHandler((state) => state.hideModal);

  // get data from modal
  const request = useModalHandler((state) => state.modalData);
  return (
    <Card
      color={"white"}
      className="2xl:w-[20vw] w-[90vw] px-8 pb-9 pt-6 sm:w-[50vw] xl:w-[35vw]"
    >
      <span className="mb-6 flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">گرنت‌های پژوهشی درخواستی</h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      {request?.grant_request1 || request?.grant_request2 ? (
        <div className="flex flex-col gap-6">
          {request?.grant_request1 && (
            <Card
              color="white"
              variant="outline"
              className={`flex w-full cursor-pointer flex-col gap-4 px-4 pb-5 pt-3 md:flex-row md:items-center md:pb-4`}
            >
              <div className="flex w-full flex-col gap-[18px] md:w-[50%]">
                <span className="flex flex-row items-center gap-2">
                  <span className="flex-grow overflow-hidden text-[15px] font-bold">
                    {`${request?.grant_record1?.receiver_obj.first_name} ${request?.grant_record1?.receiver_obj.last_name}`}
                  </span>
                </span>
                <div className="flex w-full flex-row flex-wrap justify-start gap-1 overflow-hidden text-[14px]">
                  تاریخ انقضا:
                  <span className="font-[500]">
                    {DateHandler.formatDate(
                      request?.grant_record1?.expiration_date,
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      },
                    )}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 md:w-[50%]">
                <div className="flex w-full flex-row flex-wrap justify-end overflow-hidden px-4 pb-1 text-[15px]">
                  {/* مبلغ گرنت: */}
                  <span className="font-bold text-typography-secondary">
                    {Number(
                      request?.grant_record1?.approved_amount,
                    ).toLocaleString()}
                    <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
                  </span>
                </div>
                <div className="flex w-full flex-row items-center rounded-[8px] bg-background-paper bg-opacity-80 px-4 py-2">
                  <div className="flex w-full flex-row flex-wrap items-center justify-between">
                    <h6 className="text-[14px] font-[400]">مبلغ باقیمانده</h6>
                    <span className={`text-[16px] font-[600]`}>
                      {Number(
                        request?.grant_record1?.remaining_amount,
                      ).toLocaleString()}
                      <span className="mr-1 text-[13px] font-[400]">
                        (ریال)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
          {request?.grant_request2 && (
            <Card
              color="white"
              variant="outline"
              className={`flex w-full cursor-pointer flex-col gap-4 px-4 pb-5 pt-3 md:flex-row md:items-center md:pb-4`}
            >
              <div className="flex w-full flex-col gap-[18px] md:w-[50%]">
                <span className="flex flex-row items-center gap-2">
                  <span className="flex-grow overflow-hidden text-[15px] font-bold">
                    {`${request?.grant_record2?.receiver_obj.first_name} ${request?.grant_record2?.receiver_obj.last_name}`}
                  </span>
                </span>
                <div className="flex w-full flex-row flex-wrap justify-start gap-1 overflow-hidden text-[14px]">
                  تاریخ انقضا:
                  <span className="font-[500]">
                    {DateHandler.formatDate(
                      request?.grant_record2?.expiration_date,
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      },
                    )}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 md:w-[50%]">
                <div className="flex w-full flex-row flex-wrap justify-end overflow-hidden px-4 pb-1 text-[15px]">
                  {/* مبلغ گرنت: */}
                  <span className="font-bold text-typography-secondary">
                    {Number(
                      request?.grant_record2?.approved_amount,
                    ).toLocaleString()}
                    <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
                  </span>
                </div>
                <div className="flex w-full flex-row items-center rounded-[8px] bg-background-paper bg-opacity-80 px-4 py-2">
                  <div className="flex w-full flex-row flex-wrap items-center justify-between">
                    <h6 className="text-[14px] font-[400]">مبلغ باقیمانده</h6>
                    <span className={`text-[16px] font-[600]`}>
                      {Number(
                        request?.grant_record2?.remaining_amount,
                      ).toLocaleString()}
                      <span className="mr-1 text-[13px] font-[400]">
                        (ریال)
                      </span>
                    </span>
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
          درخواست استفاده از گرنت پژوهشی ثبت نشده است.
        </Card>
      )}
    </Card>
  );
};

export default ResearchGrantsList;
