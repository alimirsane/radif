import React, { useMemo, useState } from "react";
import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import { Card } from "@kit/card";
import Chart from "@kit/chart";
import { useChartData } from "../../../../feature/dashboard/operator/report/data";
import { Button } from "@kit/button";
import { IcDownload } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { useQuery } from "@tanstack/react-query";
import { apiReports } from "@api/service/reports";

const Index = () => {
  const {
    // financialData,
    // labData,
    // topLaboratoriesWithRequestCounts,
    // pieChartData,
    dataset,
    isFetching,
    labsOverviewIsFetching,
    usersData,
    requestStatus,
    labsOverViewData,
    researchGrantData,
  } = useChartData();

  // Ensure requestStatus and dataset are defined and have valid values
  const validRequestStatus =
    requestStatus
      ?.filter(
        (status) => status?.label && status?.data && status?.backgroundColor,
      )
      .map((status) => ({
        label: status.label || "",
        data: status.data || [],
        backgroundColor: status.backgroundColor || "white",
      })) || [];

  const options = {
    responsive: true,
    legend: {
      display: false,
    },
  };
  const optionsWithAspectRatio = {
    responsive: true,
    legend: {
      display: false,
    },
    aspectRatio: 2,
  };
  const dualAxisOptions = {
    responsive: true,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left", // For large values
        ticks: {
          beginAtZero: true,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right", // For smaller values
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
    legend: {
      display: false,
    },
  };
  const { data: reports, isLoading: reportsLoading } = useQuery(
    apiReports().getFileUrl(),
  );
  // selected report type
  const [selectedReportTypeIndex, setSelectedReportTypeIndex] = useState(1);
  // report types
  const reportTypes = useMemo(() => {
    return [
      { id: 1, title: "شمای کلی آزمایشگاه‌ها", value: "labsOverView" },
      { id: 2, title: "مشتریان", value: "usersData" },
      { id: 3, title: "گزارش جامع", value: "totalReport" },
      { id: 4, title: "گرنت پژوهشی", value: "researchGrant" },
      { id: 5, title: "وضعیت درخواست‌ها", value: "requestsStatus" },
    ];
  }, []);
  return (
    <Container>
      <Header
        title="گزارش‌های مدیریتی"
        description="در این بخش می‌توانید با انتخاب نوع گزارش، اطلاعات مربوط به آن را مشاهده کنید."
      />
      <Card variant="outline" className="my-[30px] p-5 md:p-9">
        <div className="mb-6 flex flex-row gap-[1px] overflow-x-auto border-b-[3px] border-b-primary border-opacity-40 md:grid md:grid-cols-5">
          {reportTypes?.map((item, index) => (
            <span
              key={index}
              onClick={() => {
                setSelectedReportTypeIndex(item.id);
              }}
              className={`flex cursor-pointer flex-row items-center justify-center whitespace-nowrap rounded-t-[8px] border border-b-0 border-primary border-opacity-10 bg-primary p-3 text-[15px] font-medium ${
                selectedReportTypeIndex === item.id
                  ? `bg-opacity-90 text-common-white`
                  : `bg-opacity-10 text-primary`
              }`}
            >
              {item.title}
            </span>
          ))}
        </div>
        {/* 1: Labs overview */}
        {selectedReportTypeIndex === 1 &&
          (labsOverviewIsFetching ? (
            <p className="pt-2 text-[14px]">در حال بررسی اطلاعات...</p>
          ) : (
            <div className="grid w-full gap-x-7 gap-y-4 pt-3 md:grid-cols-4 md:px-5">
              {labsOverViewData.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 rounded-[8px] border border-opacity-25 p-[15px] ${
                    index < 4 ? ` border-success` : ` border-error`
                  }`}
                >
                  <div
                    className={`flex h-[46px] w-[46px] items-center justify-center rounded-[6px] bg-opacity-10 p-1 text-[18px] font-bold
                ${
                  index < 4 ? `bg-success text-success` : `bg-error text-error`
                }`}
                  >
                    {item.count}
                  </div>
                  <p className="text-black text-[15px] font-medium">
                    تعداد {item.label}
                  </p>
                </div>
              ))}
            </div>
          ))}

        {/* 2: Users data */}
        {selectedReportTypeIndex === 2 && (
          <div className="grid w-full gap-4 pt-3 md:grid-cols-4 md:gap-7 md:px-5">
            {usersData.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 rounded-[8px] border border-opacity-25 p-[15px] ${
                  index < 2 ? ` border-success` : ` border-info`
                }`}
              >
                <div
                  className={`flex h-[46px] w-[46px] items-center justify-center rounded-[6px] bg-opacity-10 p-1 text-[18px] font-bold
                ${index < 2 ? `bg-success text-success` : `bg-info text-info`}`}
                >
                  {item.count}
                </div>
                <p className="text-black text-[15px] font-medium">
                  تعداد {item.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 3: Total report */}
        {selectedReportTypeIndex === 3 &&
          (reportsLoading ? (
            <p className="pt-2 text-[14px]">در حال بررسی اطلاعات...</p>
          ) : (
            <div className="grid w-full gap-x-4 gap-y-7 pt-3 md:grid-cols-4 md:px-5">
              <div
                className={`flex items-center gap-3 rounded-[8px] border border-info border-opacity-25 p-[15px]`}
              >
                <div
                  className={`flex h-[46px] w-[46px] items-center justify-center rounded-[6px] bg-info bg-opacity-10 p-1 text-[18px]
                font-bold text-info`}
                >
                  <SvgIcon
                    strokeColor="info"
                    className={"[&_svg]:h-[18px] [&_svg]:w-[18px]"}
                  >
                    <IcDownload />
                  </SvgIcon>
                </div>
                <p className="text-[15px] font-medium text-info">
                  <a href={(reports?.data as any)?.data?.url} download>
                    دریافت فایل گزارش جامع
                  </a>
                </p>
              </div>
            </div>
          ))}

        {/* 4: Research grant */}
        {selectedReportTypeIndex === 4 && !!researchGrantData.length && (
          <div className="pt-3 md:px-6">
            <Chart
              title="اطلاعات گرنت پژوهشی"
              type="bar"
              labels={["ریال"]}
              data_obj={researchGrantData}
              options={options}
            />
          </div>
        )}

        {/* 5: Requests status */}
        {selectedReportTypeIndex === 5 && !!validRequestStatus.length && (
          <div className="pt-3 md:px-6">
            <Chart
              title="تعداد درخواست‌ها برحسب وضعیت"
              type="bar"
              labels={["وضعیت درخواست"]}
              data_obj={validRequestStatus}
              options={options}
            />
          </div>
        )}
      </Card>
      {/* <Card variant="outline" className="my-[30px] p-3 md:p-[32px]">
        <div className="grid w-full gap-8 px-4 pb-8 pt-3 md:grid-cols-4">
          {headerData.map((item, index) => (
            <div
              key={index}
              className={`flex w-full items-center gap-3 rounded-[8px] border border-primary-light p-[14px]`}
            >
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[6px] bg-primary bg-opacity-10 p-1 text-[18px] font-bold text-primary">
                {item.count}
              </div>
              <p className="text-black text-[15px] font-bold">
                تعداد {item.label}
              </p>
            </div>
          ))}
        </div>
        {!reportsLoading && (
          <div className="grid grid-cols-1 gap-8 px-4 pb-8 lg:grid-cols-2">
            <div className="flex flex-col text-[14px]">
              <p className="mb-[8px] font-medium text-typography-main">
                گزارش جامع
              </p>
              <Card
                color={"paper"}
                variant={"outline"}
                className="bg-opacity-80 px-[32px] py-[24px]"
              >
                <span className="flex cursor-pointer flex-row gap-1 font-medium text-info">
                  <a href={(reports?.data as any)?.data?.url} download>
                    دریافت فایل گزارش جامع
                  </a>
                  <SvgIcon
                    fillColor="info"
                    className={"[&_svg]:h-[15px] [&_svg]:w-[15px]"}
                  >
                    <IcDownload />
                  </SvgIcon>
                </span>
              </Card>
            </div>
          </div>
        )}
        {isFetching ? (
          <p className="text-[14px]">اطلاعات در حال بررسی می‌باشد.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 px-4 pb-3 lg:grid-cols-2">
            {!!validRequestStatus.length && (
              <Chart
                title="تعداد درخواست‌ها برحسب وضعیت"
                type="bar"
                labels={["وضعیت درخواست"]}
                data_obj={validRequestStatus}
                options={options}
              />
            )}
            {!!financialData.length && (
              <Chart
                title="اطلاعات مالی (برحسب ریال)"
                type="bar"
                labels={["پرداخت‌ها"]}
                data_obj={financialData}
                options={options}
              />
            )}
            {
              // !!labData.length && !!topLaboratoriesWithRequestCounts.length &&
              <Chart
                title="فعال‌ترین آزمایشگاه‌ها"
                type="bar"
                labels={topLaboratoriesWithRequestCounts.map(
                  (data) => "آزمایشگاه " + data.name,
                )}
                data_obj={labData}
                options={dualAxisOptions}
              />
            }
            {!!pieChartData.length && (
              <Chart
                title="شمای کلی مراکز"
                labels={[
                  "تعداد آزمایشگاه‌ها",
                  "تعداد دستگاه‌ها",
                  "تعداد آزمون‌ها",
                ]}
                type="pie"
                data_obj={pieChartData}
                options={optionsWithAspectRatio}
              />
            )}
             <Chart
              title="پرکاربرد ترین آزمایشگاه در یک ماه اخیر"
              type="bar"
              labels={dataset.map((data) => data.label)}
              data_obj={dataset}
            /> 
          </div>
        )}
      </Card> */}
    </Container>
  );
};

export default Index;
