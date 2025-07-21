import React from "react";
import { Card } from "@kit/card";
import { apiGrantRecord } from "@api/service/grant-record";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "@kit/menu";
import { SvgIcon } from "@kit/svg-icon";
import { IcWallet } from "@feature/kits/common/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { routes } from "@data/routes";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { Button } from "@kit/button";
import { apiUser } from "@api/service/user";
import { apiGrantRequest } from "@api/service/grant-request";
import { GrantStatusType } from "@api/service/grant-request/type/grant-status-type";

const GrantInfo = (props: { userType: string }) => {
  const { userType } = props;

  const router = useRouter();
  const openModal = useModalHandler((state) => state.openModal);
  // get current user info
  const { data: user } = useQuery({
    ...apiUser().me(),
  });
  // get grant requests data
  const {
    data: grantRequests,
    isLoading: grantRequestsLoading,
    refetch: refetchGrantRequests,
  } = useQuery(apiGrantRequest().getAll());
  // get grant request data
  const {
    data: grantRecords,
    isLoading: grantRecordsLoading,
    refetch,
  } = useQuery(apiGrantRecord().getAll());

  return (
    <>
      <span className="">
        <Menu
          holder={
            <span>
              <Card
                color={"white"}
                className={
                  "flex cursor-pointer items-center py-[12px] pr-[16px] lg:hidden"
                }
              >
                <div className="relative flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-info-light/15">
                  <SvgIcon className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}>
                    <IcWallet />
                  </SvgIcon>
                </div>
              </Card>
              <Card
                color="secondary"
                className="hidden w-full cursor-pointer items-center justify-between rounded-[8px] px-[6px] py-[6px] text-[16px] lg:block lg:px-[16px] lg:py-[16px]"
              >
                <span className="pl-2 ">موجودی گرنت شریف</span>
                <span className="items-center justify-center rounded-[4px] bg-common-white px-2 py-[4px] font-medium">
                  {userType === "teacher"
                    ? grantRecords?.data
                      ? Number(
                          grantRecords?.data?.reduce(
                            (sum, grant) => sum + Number(grant.remaining_grant),
                            0,
                          ),
                        ).toLocaleString()
                      : "-"
                    : grantRequests?.data
                      ? Number(
                          grantRequests?.data?.reduce(
                            (sum, grant) =>
                              sum + Number(grant?.remaining_amount),
                            0,
                          ),
                        ).toLocaleString()
                      : "-"}
                  <span className="mr-1 text-[12px] font-normal">ریال</span>
                </span>
              </Card>
            </span>
          }
        >
          <Card
            color={"white"}
            className={
              "left-0 flex w-[340px] flex-col items-center p-[16px] shadow-lg"
            }
          >
            <div className="mb-3 flex w-full flex-col gap-3 border-b-[1px] border-background-paper-dark pb-[14px]">
              <div className="flex flex-row items-center justify-between gap-2">
                <span>
                  مجموع اعتبار {userType === "teacher" ? "دریافتی" : "درخواستی"}
                  :
                </span>
                <span className="items-center justify-center rounded-[4px] bg-common-white bg-info/10 px-2 py-[4px]">
                  {userType === "teacher"
                    ? grantRecords?.data
                      ? Number(
                          grantRecords?.data?.reduce(
                            (sum, grant) => sum + Number(grant?.amount),
                            0,
                          ),
                        ).toLocaleString()
                      : "-"
                    : grantRequests?.data
                      ? Number(
                          grantRequests?.data?.reduce(
                            (sum, grant) =>
                              sum + Number(grant?.requested_amount),
                            0,
                          ),
                        ).toLocaleString()
                      : "-"}
                  <span className="mr-1 text-[12px] font-normal">ریال</span>
                </span>
              </div>
              <div className="flex flex-row items-center justify-between gap-2">
                <span>
                  مجموع اعتبار{" "}
                  {userType === "teacher" ? "قابل اعطا" : "دریافتی"}:
                </span>
                <span className="items-center justify-center rounded-[4px] bg-common-white bg-success/10 px-2 py-[4px]">
                  {userType === "teacher"
                    ? grantRecords?.data
                      ? Number(
                          grantRecords?.data?.reduce(
                            (sum, grant) =>
                              sum + Number(grant?.remaining_grant),
                            0,
                          ),
                        ).toLocaleString()
                      : "-"
                    : grantRequests?.data
                      ? Number(
                          grantRequests?.data?.reduce(
                            (sum, grant) =>
                              sum + Number(grant?.approved_amount),
                            0,
                          ),
                        ).toLocaleString()
                      : "-"}
                  <span className="mr-1 text-[12px] font-normal">ریال</span>
                </span>
              </div>
              <div className="flex flex-row items-center justify-between gap-2">
                <span>
                  {userType === "teacher"
                    ? "گرنت‌های من"
                    : "مجموع اعتبار باقیمانده"}
                  :
                </span>
                <span className="items-center justify-center rounded-[4px] bg-common-white bg-secondary/10 px-2 py-[4px]">
                  {userType === "teacher"
                    ? grantRequests?.data
                      ? Number(
                          grantRequests?.data
                            ?.filter(
                              (grant) =>
                                grant.status === GrantStatusType.APPROVED &&
                                grant.receiver === user?.data?.id &&
                                grant.sender === user?.data?.id,
                            )
                            ?.reduce(
                              (sum, grant) =>
                                sum + Number(grant.remaining_amount),
                              0,
                            ),
                        ).toLocaleString()
                      : "-"
                    : grantRequests?.data
                      ? Number(
                          grantRequests?.data?.reduce(
                            (sum, grant) =>
                              sum + Number(grant?.remaining_amount),
                            0,
                          ),
                        ).toLocaleString()
                      : "-"}
                  <span className="mr-1 text-[12px] font-normal">ریال</span>
                </span>
              </div>
            </div>
            <div className="flex w-full cursor-pointer flex-row gap-3 pt-1 text-[15px] text-typography-main">
              {userType === "teacher" ? (
                <>
                  {" "}
                  <span>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        router.push(
                          router.route.includes(routes.customer())
                            ? routes.customerGrantRequestsManagement()
                            : routes.operatorGrantRequests(),
                        );
                      }}
                    >
                      بررسی درخواست‌های گرنت
                    </Button>
                  </span>
                  <span className="flex-grow">
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        router.push(
                          router.route.includes(routes.customer())
                            ? routes.customerGrantRequestsManagement()
                            : routes.operatorGrantRequests(),
                        );
                        openModal(ModalKeys.GRANT_SELF_ASSIGNMENT);
                      }}
                    >
                      تخصیص به خود
                    </Button>
                  </span>
                </>
              ) : (
                <span className="flex-grow">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      router.push(routes.customerGrantRequests());
                    }}
                  >
                    مشاهده گرنت‌های من
                  </Button>
                </span>
              )}
              {/* <Link
                href={
                  router.route.includes(routes.customer())
                    ? routes.customerGrantRequestsManagement()
                    : routes.operatorGrantRequests()
                }
              >
                    بررسی درخواست‌های گرنت
              </Link>
              <span
                onClick={() => {
                  router.push(
                    router.route.includes(routes.customer())
                      ? routes.customerGrantRequestsManagement()
                      : routes.operatorGrantRequests(),
                  );
                  openModal(ModalKeys.GRANTS_LIST);
                }}
              >
                مشاهده اعتبارهای دریافتی
              </span>
              <span
                onClick={() => {
                  router.push(
                    router.route.includes(routes.customer())
                      ? routes.customerGrantRequestsManagement()
                      : routes.operatorGrantRequests(),
                  );
                  openModal(ModalKeys.GRANT_SELF_ASSIGNMENT);
                }}
              >
                تخصیص به خود
              </span> */}
            </div>
          </Card>
        </Menu>
      </span>
    </>
  );
};

export default GrantInfo;
