import { Card } from "@kit/card";
import {
  IcClose,
  IcDelete,
  IcEdit,
  IcEye,
  IcKey,
  IcUserSetting,
} from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import { useEffect, useMemo, useState } from "react";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { useRouter } from "next/router";
import { useModalHandler } from "@utils/modal-handler/config";
import { ModalKeys } from "@utils/modal-handler/config";
import { useReloadUsers, useUserEditHandler } from "./get-info-user";
import { useQueryClient } from "@tanstack/react-query";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { AccountType } from "@api/service/user/type/account-type";
import Badge from "@feature/kits/badge";
import Tooltip from "@kit/tooltip";
import Pagination from "@kit/pagination";

const List = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();

  const isCustomer = useMemo(() => {
    return router.asPath.includes("customer");
  }, [router]);

  const [displayLoadingOverlay, setDisplayLoadingOverlay] = useState(true);
  const { setUserEditHandler } = useUserEditHandler();
  const { reload, setReloadUsers } = useReloadUsers();
  const openModal = useModalHandler((state) => state.openModal);

  // const { data, refetch: refetchUsers } = useQuery({
  //   ...apiUser().getAllMineList({
  //     role: router.query.role,
  //     user_type: isCustomer ? "customer" : "staff",
  //     search: router.query.search_user,
  //     account_type: router.query.account_type,
  //     end_date: router.query.end_date,
  //     start_date: router.query.start_date,
  //     useLoadingOverlay: displayLoadingOverlay,
  //     page: router.query.page,
  //     // end_date: router.query.hasOwnProperty("end_date")
  //     //   ? decodeURIComponent(router.query.end_date as string)
  //     //   : "",
  //     // start_date: router.query.hasOwnProperty("start_date")
  //     //   ? decodeURIComponent(router.query.start_date as string)
  //     //   : "",
  //   }),
  // });
  const { data: staffs, refetch: refetchStaffs } = useQuery({
    ...apiUser().getAllStaffs({
      role: router.query.role,
      search: router.query.search_user,
      account_type: router.query.account_type,
      end_date: router.query.end_date,
      start_date: router.query.start_date,
      useLoadingOverlay: displayLoadingOverlay,
      page: router.query.page,
    }),
    enabled: !isCustomer,
  });

  const { data: customers, refetch: refetchCustomers } = useQuery({
    ...apiUser().getAllCustomers({
      role: router.query.role,
      search: router.query.search_user,
      account_type: router.query.account_type,
      end_date: router.query.end_date,
      start_date: router.query.start_date,
      useLoadingOverlay: displayLoadingOverlay,
      page: router.query.page,
    }),
    enabled: isCustomer,
  });

  const [users, setUsers] = useState<CurrentUserType[]>(
    isCustomer ? customers?.data?.results ?? [] : staffs?.data?.results ?? [],
  );

  const [totalPageCount, setTotalPageCount] = useState<number>(
    isCustomer
      ? customers?.data?.page_count ?? -1
      : staffs?.data?.page_count ?? -1,
  );

  useEffect(() => {
    // const user =
    //   data?.data.filter(
    //     (user: CurrentUserType) => user.user_type === "staff",
    //   ) ?? [];
    // setUsers(user);
    // setUsers(data?.data?.results ?? []);

    if (isCustomer) {
      setUsers(customers?.data?.results ?? []);
      setTotalPageCount(customers?.data?.page_count ?? -1);
    } else {
      setUsers(staffs?.data?.results ?? []);
      setTotalPageCount(staffs?.data?.page_count ?? -1);
    }
  }, [isCustomer, staffs, customers]);

  const handleOpenModal =
    (modalKey: ModalKeys, user: CurrentUserType) => () => {
      openModal(modalKey, user);
      setUserEditHandler({
        first_name: user.first_name,
        last_name: user.last_name,
        access_level: user.access_level_obj[0]?.name,
        position: user.role_obj[0]?.name,
        id: user.id.toString(),
        password: user.password,
      });
    };
  useEffect(() => {
    if (reload) {
      // clientQuery.invalidateQueries({
      //   queryKey: [apiUser().url],
      // });
      isCustomer ? refetchCustomers() : refetchStaffs();
      setReloadUsers(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  // fetch data every 60 seconds
  useEffect(() => {
    setDisplayLoadingOverlay(false);
    const interval = setInterval(async () => {
      try {
        // await refetchUsers();
        (await isCustomer) ? refetchCustomers() : refetchStaffs();
      } catch (err) {
        console.error(err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [isCustomer, refetchCustomers, refetchStaffs]);

  const currentPage = useMemo(() => {
    return parseInt((router.query.page as string) ?? "1");
  }, [router.query.page]);

  const handlePageChange = (page: number) => {
    router.query.page = page.toString();
    router.push(router);
  };

  return (
    <AccessLevel module={"user"} permission={["view"]}>
      <>
        {users && users.length ? (
          <>
            <Card
              className={
                "lg:whitespace-norma flex w-full flex-nowrap justify-between gap-5 overflow-x-auto whitespace-nowrap bg-background-paper-dark px-3 py-7 font-bold lg:gap-2 lg:px-7"
              }
            >
              {isCustomer && (
                <span className="hidden w-full lg:block lg:w-[5%]"></span>
              )}
              <span
                className={`w-full ${isCustomer ? "lg:w-[43%]" : "lg:w-[17%]"}`}
              >
                نام و نام خانوادگی
              </span>
              {/* <span className="w-full lg:w-[30%]">سطح دسترسی</span> */}
              <span
                className={`w-full ${isCustomer ? "lg:w-[40%]" : "lg:w-[17%]"}`}
              >
                شماره همراه
              </span>
              {!isCustomer && <span className="w-full lg:w-[26%]">سمت</span>}
              <span className="flex w-full lg:w-[14%]">اقدامات</span>
            </Card>
            {users?.map((user: CurrentUserType, index) => (
              <Card
                key={index}
                color={index % 2 === 0 ? "paper" : "white"}
                variant={index % 2 === 0 ? "flat" : "outline"}
                className="mt-[16px] flex w-full flex-nowrap items-center justify-between gap-5 overflow-x-auto whitespace-nowrap px-3 py-[22px] lg:gap-2 lg:overflow-x-visible lg:whitespace-normal lg:px-7"
              >
                {isCustomer && (
                  <div className="hidden w-full lg:block lg:w-[5%]">
                    {user.account_type === AccountType.BUSINESS && (
                      <Badge color="primary">حقوقی</Badge>
                    )}
                  </div>
                )}
                <div
                  className={`flex w-full flex-row items-center text-[16px] ${isCustomer ? "lg:w-[44%]" : "lg:w-[17%]"}`}
                >
                  {user.first_name + " " + user.last_name}
                  {isCustomer && (
                    <span className="mr-1 lg:hidden">
                      {user.account_type === AccountType.BUSINESS && (
                        <Badge color="primary">حقوقی</Badge>
                      )}
                    </span>
                  )}
                </div>
                <div
                  className={`w-full text-[16px] ${isCustomer ? "lg:w-[41%]" : "lg:w-[17%]"}`}
                >
                  {/* {user.account_type === AccountType.BUSINESS
                    ? user.company_telephone
                    : `0${user?.username?.slice(3)}`} */}
                  {user.account_type === AccountType.PERSONAL
                    ? user?.username
                      ? `0${user?.username.slice(3, user?.username.length)}` // personal account
                      : ""
                    : !!user?.linked_users_objs?.length
                      ? user?.linked_users_objs[0]?.username
                        ? `0${user?.linked_users_objs[0]?.username.slice(3, user?.linked_users_objs[0].username.length)}` //business account from signup
                        : ""
                      : user?.username
                        ? `0${user?.username.slice(3, user?.username.length)}` //business account from customers management
                        : ""}
                </div>
                {!isCustomer && (
                  <div className="lex-nowrap flex w-full gap-[8px] overflow-x-auto whitespace-nowrap lg:w-[26%]">
                    {user.role_obj.length ? (
                      user.role_obj.map((role, index) => (
                        <div
                          key={index}
                          className="h-fit w-fit rounded-[25px] bg-background-paper-dark p-[12px] text-[12px] font-semibold"
                        >
                          {role?.name}
                        </div>
                      ))
                    ) : (
                      <span>---</span>
                    )}
                  </div>
                )}

                {/* <div className="flex w-full flex-nowrap gap-[8px] overflow-x-auto whitespace-nowrap lg:w-[30%]">
                  {user.access_level_obj.length ? (
                    user.access_level_obj.map((level, index) => (
                      <div
                        key={index}
                        className="flex h-fit w-fit max-w-[200px] items-center gap-[4px] rounded-[25px] bg-background-paper-dark p-[12px] text-[12px] font-semibold"
                      >
                        {level?.name}
                        <SvgIcon
                          className={
                            "cursor-pointer [&>svg]:h-[12px] [&>svg]:w-[12px]"
                          }
                        >
                          <IcClose />
                        </SvgIcon>
                      </div>
                    ))
                  ) : (
                    <span>---</span>
                  )}
                </div> */}

                <div className="flex w-full gap-2 lg:w-[14%]">
                  <AccessLevel module={"user"} permission={["update"]}>
                    <Tooltip message="تغییر رمز عبور">
                      <SvgIcon
                        onClick={handleOpenModal(
                          ModalKeys.CHANGE_USER_PASSWORD,
                          user,
                        )}
                        fillColor={"primary"}
                        className={
                          "cursor-pointer [&_svg]:h-[28px] [&_svg]:w-[28px]"
                        }
                      >
                        <IcKey />
                      </SvgIcon>
                    </Tooltip>
                  </AccessLevel>
                  <AccessLevel module={"user"} permission={["update"]}>
                    <Tooltip message="تغییر نقش">
                      <SvgIcon
                        onClick={handleOpenModal(
                          ModalKeys.CHANGE_USER_TYPE,
                          user,
                        )}
                        fillColor={"primary"}
                        className={
                          "cursor-pointer [&_svg]:h-[28px] [&_svg]:w-[28px]"
                        }
                      >
                        <IcUserSetting />
                      </SvgIcon>
                    </Tooltip>
                  </AccessLevel>
                  <AccessLevel module={"user"} permission={["update"]}>
                    <Tooltip message="ویرایش">
                      <SvgIcon
                        onClick={handleOpenModal(ModalKeys.EDIT_USER, user)}
                        className={"cursor-pointer [&>svg]:opacity-85"}
                      >
                        <IcEdit />
                      </SvgIcon>
                    </Tooltip>
                  </AccessLevel>
                  <AccessLevel module={"user"} permission={["delete"]}>
                    <Tooltip message="حذف">
                      <SvgIcon
                        fillColor="primary"
                        onClick={handleOpenModal(ModalKeys.DELETE_USER, user)}
                        className={
                          "cursor-pointer [&_svg]:h-[21px] [&_svg]:w-[21px]"
                        }
                      >
                        <IcDelete />
                      </SvgIcon>
                    </Tooltip>
                  </AccessLevel>
                  <Tooltip message="مشاهده">
                    <SvgIcon
                      onClick={handleOpenModal(ModalKeys.VIEW_USER, user)}
                      strokeColor={"primary"}
                      className={
                        "cursor-pointer [&_svg]:h-[24px] [&_svg]:w-[24px]"
                      }
                    >
                      <IcEye />
                    </SvgIcon>
                  </Tooltip>
                </div>
              </Card>
            ))}
            <div className="mt-5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPageCount}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <Card
            className="flex justify-center p-[24px] text-[14px]"
            color={"info"}
          >
            {router.query.search_user
              ? "کاربری یافت نشد."
              : "شما هنوز کاربری ثبت نکرده اید."}
          </Card>
        )}
      </>
    </AccessLevel>
  );
};

export default List;
