import { useQuery } from "@tanstack/react-query";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { DateHandler } from "@utils/date-handler";
import { IcClose } from "@feature/kits/common/icons";
import { apiGrantRecord } from "@api/service/grant-record";
import { useModalHandler } from "@utils/modal-handler/config";
import { useRouter } from "next/router";
import { useEffect } from "react";

const DisplayGrantsList = () => {
  const router = useRouter();
  // close modal
  const hideModal = useModalHandler((state) => state.hideModal);

  // get grant records data
  const {
    data: grantRecords,
    isLoading: grantRecordsLoading,
    refetch,
  } = useQuery(apiGrantRecord().getAll());

  useEffect(() => {
    if (router.query.action === "revoked") {
      refetch();
      delete router.query.action;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] w-full flex-col overflow-y-auto px-8 py-4 md:max-h-[90vh] md:w-[65vw] md:pb-10 md:pt-8"
    >
      <div className="mb-4 flex flex-row items-center justify-between md:mb-7">
        <h6 className="text-[20px] font-[700]">لیست اعتبارهای دریافتی</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <Card
        color={"info"}
        className="mb-3 flex w-full flex-col justify-center gap-3 px-5 py-7 text-[16px] font-semibold md:mb-5 md:flex-row md:gap-[80px]"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <h6>مجموع اعتبار دریافتی</h6>
          <span className="font-bold text-info-dark">
            {Number(
              grantRecords?.data?.reduce(
                (sum, grant) => sum + Number(grant.amount),
                0,
              ),
            ).toLocaleString()}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>
        <div className="h-[1px] w-full bg-common-black/15 md:h-[50px] md:w-[1px]" />

        <div className="flex flex-col items-center justify-center gap-2">
          <h6>مجموع اعتبار قابل اعطا</h6>
          <span className="font-bold text-info-dark">
            {Number(
              grantRecords?.data?.reduce(
                (sum, grant) => sum + Number(grant.remaining_grant),
                0,
              ),
            ).toLocaleString()}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>
      </Card>
      <div className="overflow-y-auto">
        {!grantRecords?.data.length && (
          <Card color={"paper"} className="w-full">
            <p className="p-[16px] text-center text-[14px]">
              گرنتی برای شما ثبت نشده است.
            </p>
          </Card>
        )}
        {!!grantRecords?.data.length && (
          <>
            <Card
              className="hidden w-full flex-row justify-between gap-6 bg-background-paper-dark px-[40px] py-7 
        font-bold lg:flex lg:gap-2"
            >
              <span className="w-full lg:w-[25%]">نام گرنت</span>
              <span className="w-full lg:w-[25%]">تاریخ انقضا</span>
              <span className="w-full lg:w-[25%]">مبلغ گرنت اولیه</span>
              <span className="w-full lg:w-[25%]">مبلغ باقیمانده</span>
            </Card>
            {grantRecords?.data?.map((item, index) => (
              <Card
                key={index}
                color={index % 2 === 0 ? "paper" : "white"}
                variant={index % 2 === 0 ? "flat" : "outline"}
                className="mt-3 flex w-full flex-wrap items-center justify-between gap-3 px-6 py-5
          lg:flex-nowrap lg:gap-2 lg:px-[40px]"
              >
                <span className="w-full lg:w-[25%]">
                  <span className="font-bold lg:hidden">نام گرنت:</span>{" "}
                  {item.title}
                </span>
                <span className="w-full lg:w-[25%]">
                  <span className="font-bold lg:hidden">تاریخ انقضا:</span>{" "}
                  {DateHandler.formatDate(item.expiration_date, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
                <span className="w-full items-center lg:w-[25%]">
                  <span className="font-bold lg:hidden">مبلغ گرنت اولیه:</span>{" "}
                  {Number(item.amount).toLocaleString()}
                  <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
                </span>
                <span className="w-full items-center lg:w-[25%]">
                  <span className="font-bold lg:hidden">مبلغ باقیمانده:</span>{" "}
                  {Number(item.remaining_grant).toLocaleString()}
                  <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
                </span>
              </Card>
            ))}
          </>
        )}
        {/* {grantRecords?.data.length !== 0 &&
          grantRecords?.data.map((item, index) => (
            <Card
              key={index}
              color="white"
              variant="outline"
              className={`flex w-full cursor-pointer flex-col gap-4 px-4 pb-5 pt-4 md:flex-row md:items-center md:pb-4`}
            >
              <div className="flex w-full flex-col gap-[18px] md:w-[50%]">
                <span className="flex-grow overflow-hidden text-[15px] font-bold">
                  {item.title}
                </span>
                <div className="flex w-full flex-row flex-wrap justify-start overflow-hidden text-[14px]">
                  تاریخ انقضا:
                  <span className="mr-1 font-[500]">
                    {DateHandler.formatDate(item.expiration_date, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:w-[50%]">
                <div className="flex w-full flex-row flex-wrap justify-end overflow-hidden px-4 text-[15px]">
                  <span className="font-bold text-typography-gray">
                    {Number(item.amount).toLocaleString()}
                    <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
                  </span>
                </div>
                <div className="flex w-full flex-row items-center rounded-[8px] bg-background-paper-dark bg-opacity-70 px-4 py-2">
                  <div className="flex w-full flex-row flex-wrap items-center justify-between">
                    <h6 className="text-[14px] font-[400]">مبلغ باقیمانده</h6>
                    <span className={`text-[16px] font-[600]`}>
                      {Number(item.remaining_grant).toLocaleString()}
                      <span className="mr-1 text-[13px] font-[400]">
                        (ریال)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))} */}
      </div>
    </Card>
  );
};

export default DisplayGrantsList;
