import Container from "@feature/dashboard/common/container";
import { useRouter } from "next/router";
import EmptyBox from "./components/empty-box";
import Tab from "./components/tab";
import ListItem from "./components/list-item";
import Search from "./components/search";
import TestDetails from "./components/test-details";
import { RequestType } from "@api/service/request/type";
import { useMemo } from "react";
import { WorkflowType } from "@api/service/workflow/type";
import { useShowSampleHandler } from "@feature/dashboard/operator/component/template/components/samples/show-sample";
import Pagination from "@kit/pagination";
import { SvgIcon } from "@kit/svg-icon";
import { IcDownload, IcSort } from "@feature/kits/common/icons";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { Fab } from "@kit/fab";
import Tooltip from "@kit/tooltip";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@api/service/request";
import { Card } from "@kit/card";
import { PaginationModel } from "@api/config/model/pagination-model";

type StepObjectType = {
  paginateData: PaginationModel<RequestType[]> | undefined;
  isLoadingRequests: boolean;
} & Pick<WorkflowType, "steps_objs">;

const Template = (props: StepObjectType) => {
  const { steps_objs, paginateData, isLoadingRequests } = props;

  const { setSample } = useShowSampleHandler();

  const router = useRouter();

  const requestSelected = useMemo(() => {
    return router?.query?.request_id as string;
  }, [router?.query?.request_id]);

  const currentPage = useMemo(() => {
    return parseInt((router.query.page as string) ?? "1");
  }, [router.query.page]);

  const handlePageChange = (page: number) => {
    // router.push(
    //   {
    //     pathname: router.pathname,
    //     query: {
    //       ...router.query,
    //       page: page,
    //     },
    //   },
    //   undefined,
    //   { scroll: false },
    // );
    router.query.page = page.toString();
    delete router.query.request_id;
    router.push(router);
  };

  // get file URL for downloading
  const { data: fileUrl, refetch } = useQuery({
    ...apiRequest().getFileUrl({ ...router.query, export_excel: true }),
    enabled: false,
  });
  const getFileUrl = async () => {
    // trigger the query to fetch the file URL
    const { data: file } = await refetch();
    // download the file if the URL is available
    if (file?.data.file_url) {
      const link = document.createElement("a");
      link.href = file?.data.file_url;
      link.download = "requests-list.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const sortRequestHandler = (name: string) => {
    router.query.ordering = name;
    delete router.query.page;
    router.replace(router);
  };
  return (
    <div className="min-h-full w-full border-common-black/10 bg-common-white">
      <Container>
        <div
          id="request_operator_tabs"
          className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-7"
        >
          {steps_objs?.map((tab, index) => (
            <Tab
              key={index}
              click={() => {
                delete router.query.request_id;
                delete router.query.page;
                // delete router.query.owner_national_id;
                // delete router.query.owner_fullname;
                // delete router.query.experiment_name;
                // delete router.query.request_number;
                setSample(undefined);
                if (router.query.request_status === tab.id?.toString()) {
                  router.push({ query: {} });
                } else {
                  router.query.request_status = tab.id?.toString();
                  router.push(router);
                }
              }}
              color={tab.step_color}
              count={tab.request_counter ?? ""}
              text={tab.name}
              select={
                router.query.request_status === tab.id?.toString()
                  ? "selected"
                  : undefined
              }
            />
          ))}
        </div>

        {/* <div className="grid grid-cols-1 gap-[32px] pt-[32px] md:grid-cols-2">
          <Header />
          <Search />
        </div> */}
        <div
          id="filter-section"
          className="flex flex-col items-end gap-[38px] pt-[32px] lg:flex-row"
        >
          <div className="w-full lg:w-1/3">
            {/* <Header /> */}
            <div className="flex flex-row justify-between pb-2">
              <span className="flex flex-row items-center">
                <SvgIcon className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}>
                  <IcSort />
                </SvgIcon>
                <h6 className="px-2 text-[14px] font-bold">مرتب سازی:</h6>
                <span
                  onClick={() => sortRequestHandler("-created_at")}
                  className={`cursor-pointer px-3 py-1 text-[13px]
                      ${
                        !router.query.ordering ||
                        router.query.ordering === "-created_at"
                          ? "rounded-md bg-primary bg-opacity-10 font-medium text-primary"
                          : "font-normal"
                      }`}
                >
                  جدیدترین
                </span>
                <span
                  onClick={() => sortRequestHandler("created_at")}
                  className={`cursor-pointer px-3 py-1 text-[13px]
                      ${
                        router.query.ordering === "created_at"
                          ? "rounded-md bg-primary bg-opacity-10 font-medium text-primary"
                          : "font-normal"
                      }`}
                >
                  قدیمی‌ترین
                </span>
              </span>
              <span>
                <Fab
                  variant="solid"
                  size="small"
                  onClick={() => {
                    getFileUrl();
                  }}
                >
                  <Tooltip message="دانلود لیست درخواست‌ها">
                    <SvgIcon strokeColor={"white"}>
                      <IcDownload />
                    </SvgIcon>
                  </Tooltip>
                </Fab>
              </span>
            </div>
          </div>
          <div className="w-full lg:w-2/3 lg:pr-2">
            <Search />
          </div>
        </div>
        <AccessLevel module={"request"} permission={["view"]}>
          <div
            id="request-list-root-wrapper"
            className="flex flex-col gap-[26px] pt-[26px] md:flex-row"
          >
            <div
              id="request_operator_list_item"
              className="flex w-full flex-col gap-[8px] md:w-1/3"
            >
              {isLoadingRequests && (
                <Card
                  color="info"
                  className="flex w-full items-center justify-center p-10"
                >
                  <p>در حال بارگذاری ...</p>
                </Card>
              )}
              {/* <ListRequests/> */}
              {!paginateData?.results.length && !isLoadingRequests && (
                <Card
                  color="info"
                  className="flex w-full items-center justify-center p-10"
                >
                  <p>درخواستی یافت نشد.</p>
                </Card>
              )}
              {paginateData?.results?.map((item, index: number) =>
                router.query.request_status ? (
                  router.query.request_status.toString() ===
                    item.latest_status_obj?.step_obj.id.toString() && (
                    <>
                      <ListItem
                        key={index}
                        onClick={() => {
                          delete router.query.sample;
                          setSample(undefined);
                          if (router.query.request_id) {
                            router.replace(
                              {
                                pathname: router.pathname,
                                query: {
                                  ...router.query,
                                  request_id: item.id?.toString(),
                                },
                              },
                              undefined,
                              { scroll: false },
                            );
                          } else {
                            router.push(
                              {
                                pathname: router.pathname,
                                query: {
                                  ...router.query,
                                  request_id: item.id?.toString(),
                                },
                              },
                              undefined,
                              { scroll: false },
                            );
                          }
                        }}
                        {...item}
                      />
                      {router?.query?.request_id === item.id?.toString() && (
                        <div
                          // id="request_operator_list_details"
                          className={`border-${item.latest_status_obj?.step_obj.step_color} mx-1 rounded-xl border p-4 md:hidden`}
                        >
                          <TestDetails />
                        </div>
                      )}
                    </>
                  )
                ) : (
                  <>
                    <ListItem
                      key={index}
                      onClick={() => {
                        delete router.query.sample;
                        if (router.query.request_id) {
                          router.replace(
                            {
                              pathname: router.pathname,
                              query: {
                                ...router.query,
                                request_id: item.id?.toString(),
                              },
                            },
                            undefined,
                            { scroll: false },
                          );
                        } else {
                          router.push(
                            {
                              pathname: router.pathname,
                              query: {
                                ...router.query,
                                request_id: item.id?.toString(),
                              },
                            },
                            undefined,
                            { scroll: false },
                          );
                        }
                      }}
                      {...item}
                    />
                    {router?.query?.request_id === item.id?.toString() && (
                      <div
                        // id="request_operator_list_details"
                        className={`border-${item.latest_status_obj?.step_obj.step_color} mx-1 rounded-xl border p-4 md:hidden`}
                      >
                        <TestDetails />
                      </div>
                    )}
                  </>
                ),
              )}
              <div className="mt-5">
                <Pagination
                  currentPage={currentPage}
                  totalPages={paginateData?.page_count ?? -1}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>

            <div
              className="top-[50px] hidden h-fit w-full md:sticky md:block md:w-2/3 md:pr-[16px]"
              id="request_operator_list_details"
            >
              {requestSelected ? <TestDetails /> : <EmptyBox />}
            </div>
          </div>
        </AccessLevel>
      </Container>
    </div>
  );
};

export default Template;
