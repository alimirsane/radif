import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import StudentList from "./student-list";
import { Card } from "@kit/card";
import { apiGrantRequest } from "@api/service/grant-request";
import { useRouter } from "next/router";
import { Downloder } from "@feature/dashboard/common/download-file";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import {
  IcArrowLeft,
  IcInfo,
  IcPersonFillUp,
  IcStarsList,
} from "@feature/kits/common/icons";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { apiGrantRecord } from "@api/service/grant-record";
import { GrantStatusType } from "@api/service/grant-request/type/grant-status-type";
import { apiUser } from "@api/service/user";
import Tooltip from "@kit/tooltip";

const Grant = () => {
  const router = useRouter();
  const openModal = useModalHandler((state) => state.openModal);
  // get grant request data
  const [displayLoadingOverlay, setDisplayLoadingOverlay] = useState(true); // get current user data
  const { data: user } = useQuery({
    ...apiUser().me(),
  });

  // get grant requests data
  const {
    data: grantRequests,
    isLoading: grantRequestsLoading,
    refetch: refetchGrantRequests,
  } = useQuery(
    apiGrantRequest().getAll({
      ...router.query,
      end_date: router.query.end_date,
      start_date: router.query.start_date,
      useLoadingOverlay: displayLoadingOverlay,
    }),
  );
  // get grant records data
  const {
    data: grantRecords,
    isLoading: grantRecordsLoading,
    refetch: refetchGrantRecords,
  } = useQuery(apiGrantRecord().getAll());

  useEffect(() => {
    if (router.query.action === "revoked") {
      refetchGrantRecords();
      delete router.query.action;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  // get file URL for downloading
  const { data: fileUrl, refetch } = useQuery({
    ...apiGrantRequest().getFileUrl({
      ...router.query,
      end_date: router.query.end_date,
      start_date: router.query.start_date,
      export_excel: true,
    }),
    enabled: false,
  });

  const getFileUrl = async () => {
    // trigger the query to fetch the file URL
    const { data: file } = await refetch();
    // download the file if the URL is available
    if (file?.data.file_url) {
      const link = document.createElement("a");
      link.href = file?.data.file_url;
      link.download = "grants-requests-list.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // fetch data every 60 seconds
  useEffect(() => {
    setDisplayLoadingOverlay(false);
    const interval = setInterval(async () => {
      try {
        await refetchGrantRequests();
      } catch (err) {
        console.error(err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [refetchGrantRequests]);

  return (
    <>
      <div className="grid gap-4 pt-5 md:grid-cols-3 md:gap-6">
        <Card color={"info"} className="flex w-full flex-col gap-3 p-5">
          <Tooltip message="مجموع اعتبار دریافتی، کل مبلغی است که از طرف دانشگاه صنعتی شریف به شما اعطا شده است.">
            <h6 className="flex cursor-pointer flex-row items-center font-medium">
              مجموع اعتبار دریافتی
              <SvgIcon
                fillColor={"info"}
                className={"[&_svg]:h-[15px] [&_svg]:w-[15px]"}
              >
                <IcInfo />
              </SvgIcon>
            </h6>
          </Tooltip>
          <span className="text-[18px] font-bold text-info-dark">
            {grantRecords?.data
              ? Number(
                  grantRecords?.data?.reduce(
                    (sum, grant) => sum + Number(grant.amount),
                    0,
                  ),
                ).toLocaleString()
              : "-"}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
          <span
            className="mt-2 flex w-full cursor-pointer flex-row items-center justify-end gap-1 text-end text-[13px] text-info hover:text-info-dark"
            onClick={() => openModal(ModalKeys.GRANTS_LIST)}
          >
            مشاهده اعتبارهای دریافتی
            <SvgIcon
              fillColor={"info"}
              className={
                "hover:text-info-dark [&_svg]:h-[12px] [&_svg]:w-[12px]"
              }
            >
              <IcArrowLeft />
            </SvgIcon>
          </span>
        </Card>
        <Card color={"success"} className="flex w-full flex-col gap-3 p-5">
          <Tooltip message="مجموع اعتبار قابل اعطا، کل مبلغی است که شما می‌توانید به دانشجویانی که درخواست گرنت داده‌اند اعطا کنید.">
            <h6 className="flex cursor-pointer flex-row items-center font-medium">
              مجموع اعتبار قابل اعطا
              <SvgIcon
                fillColor={"success"}
                className={"[&_svg]:h-[15px] [&_svg]:w-[15px]"}
              >
                <IcInfo />
              </SvgIcon>
            </h6>
          </Tooltip>
          <span className="text-[18px] font-bold text-success-dark">
            {grantRecords?.data
              ? Number(
                  grantRecords?.data?.reduce(
                    (sum, grant) => sum + Number(grant.remaining_grant),
                    0,
                  ),
                ).toLocaleString()
              : "-"}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </Card>
        <Card color={"secondary"} className="flex w-full flex-col gap-3 p-5">
          <Tooltip message="گرنت‌های من، کل مبلغی است که شما می‌توانید برای درخواست‌های خود استفاده نمایید.">
            <h6 className="flex cursor-pointer flex-row items-center font-medium">
              گرنت‌های من
              <SvgIcon
                fillColor={"primary"}
                className={"[&_svg]:h-[15px] [&_svg]:w-[15px]"}
              >
                <IcInfo />
              </SvgIcon>
            </h6>
          </Tooltip>
          <span className="text-[18px] font-bold text-primary-dark">
            {grantRequests?.data
              ? Number(
                  grantRequests?.data
                    ?.filter(
                      (grant) =>
                        grant.status === GrantStatusType.APPROVED &&
                        grant.receiver === user?.data?.id &&
                        grant.sender === user?.data?.id,
                    )
                    ?.reduce(
                      (sum, grant) => sum + Number(grant.remaining_amount),
                      0,
                    ),
                ).toLocaleString()
              : "-"}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
          <span
            className="mt-2 flex w-full cursor-pointer flex-row items-center justify-end gap-1 text-end text-[13px] text-primary hover:text-primary-dark"
            onClick={() => openModal(ModalKeys.GRANT_SELF_ASSIGNMENT)}
          >
            تخصیص به خود
            <SvgIcon
              fillColor={"primary"}
              className={
                "hover:text-primary-dark [&_svg]:h-[12px] [&_svg]:w-[12px]"
              }
            >
              <IcArrowLeft />
            </SvgIcon>
          </span>
        </Card>
      </div>
      <Card
        className={"my-6 px-4 pb-10 pt-7 text-typography-main sm:px-10"}
        color={"white"}
        variant="outline"
      >
        <div className="flex flex-col">
          <h2 className="text-[18px] font-semibold">اعطای گرنت به دانشجو</h2>
          <span className="flex flex-col items-center justify-between md:flex-row">
            <p className="py-2 text-[14px]">
              لیست دانشجوهایی که درخواست گرنت داده‌اند را می‌توانید در این بخش
              مشاهده نمایید و با توجه به درخواست آن‌ها میزان گرنت را تعیین کنید.
            </p>
            {/* <span className="flex flex-row gap-4">
            <Button
              variant="outline"
              startIcon={
                <SvgIcon
                  fillColor={"primary"}
                  className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
                >
                  <IcStarsList />
                </SvgIcon>
              }
              className="whitespace-nowrap"
              onClick={() => openModal(ModalKeys.GRANTS_LIST)}
            >
              مشاهده اعتبارهای دریافتی
            </Button>
            <Button
              startIcon={
                <SvgIcon
                  fillColor={"white"}
                  className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
                >
                  <IcPersonFillUp />
                </SvgIcon>
              }
              className="whitespace-nowrap"
              onClick={() => openModal(ModalKeys.GRANT_SELF_ASSIGNMENT)}
            >
              تخصیص به خود
            </Button>
          </span> */}
          </span>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 py-5 lg:flex-row lg:items-end">
          <span className="w-full lg:w-[70%]">
            <Downloder
              title="دانلود لیست گرنت‌ها"
              onDownload={getFileUrl}
              onReset={() => {}}
            />
          </span>
        </div>
        {/* <Card
        color={"info"}
        className="mb-7 mt-2 flex w-full flex-col justify-center gap-5 px-5 py-5 text-[16px] font-semibold md:flex-row md:gap-[60px]"
      >
        <div className="flex flex-col items-center justify-center">
          <Tooltip message="مجموع اعتبار دریافتی، کل مبلغی است که از طرف دانشگاه صنعتی شریف به شما اعطا شده است.">
            <h6 className="flex cursor-pointer flex-row items-center pb-1">
              مجموع اعتبار دریافتی
              <SvgIcon
                fillColor={"black"}
                className={"opacity-50 [&_svg]:h-[15px] [&_svg]:w-[15px]"}
              >
                <IcInfo />
              </SvgIcon>
            </h6>
          </Tooltip>
          <span className="font-bold text-info-dark">
            {grantRecords?.data
              ? Number(
                  grantRecords?.data?.reduce(
                    (sum, grant) => sum + Number(grant.amount),
                    0,
                  ),
                ).toLocaleString()
              : "-"}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>
        <div className="h-[1px] w-full bg-common-black/15 md:h-[50px] md:w-[1px]" />
        <div className="flex flex-col items-center justify-center gap-1">
          <Tooltip message="مجموع اعتبار قابل اعطا، کل مبلغی است که شما می‌توانید به دانشجویانی که درخواست گرنت داده‌اند اعطا کنید.">
            <h6 className="flex cursor-pointer flex-row items-center pb-1">
              مجموع اعتبار قابل اعطا
              <SvgIcon
                fillColor={"black"}
                className={"opacity-50 [&_svg]:h-[15px] [&_svg]:w-[15px]"}
              >
                <IcInfo />
              </SvgIcon>
            </h6>
            <span className="font-bold text-info-dark">
              {grantRecords?.data
                ? Number(
                    grantRecords?.data?.reduce(
                      (sum, grant) => sum + Number(grant?.remaining_grant),
                      0,
                    ),
                  ).toLocaleString()
                : "-"}
              <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
            </span>
          </Tooltip>
        </div>
        <div className="h-[1px] w-full bg-common-black/15 md:h-[50px] md:w-[1px]" />
        <div className="flex flex-col items-center justify-center gap-1">
          <Tooltip message="گرنت‌های من، کل مبلغی است که شما می‌توانید برای درخواست‌های خود استفاده نمایید.">
            <h6 className="flex cursor-pointer flex-row items-center pb-1">
              گرنت‌های من
              <SvgIcon
                fillColor={"black"}
                className={"opacity-50 [&_svg]:h-[15px] [&_svg]:w-[15px]"}
              >
                <IcInfo />
              </SvgIcon>
            </h6>
            <span className="font-bold text-info-dark">
              {grantRequests?.data
                ? Number(
                    grantRequests?.data
                      ?.filter(
                        (grant) =>
                          grant.status === GrantStatusType.APPROVED &&
                          grant.receiver === user?.data?.id &&
                          grant.sender === user?.data?.id,
                      )
                      ?.reduce(
                        (sum, grant) => sum + Number(grant.remaining_amount),
                        0,
                      ),
                  ).toLocaleString()
                : "-"}
              <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
            </span>
          </Tooltip>
        </div>
      </Card> */}
        <div>
          <StudentList grantRequests={grantRequests?.data ?? []} />
        </div>
      </Card>
    </>
  );
};

export default Grant;
