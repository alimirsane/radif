import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useDebounce } from "@utils/use-debounce";

import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Select } from "@kit/select";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcAddUser, IcChevronDown, IcSearch } from "@feature/kits/common/icons";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { apiRole } from "@api/service/role";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { apiUser } from "@api/service/user";
import { Downloder } from "@feature/dashboard/common/download-file";
import { UserType } from "@api/service/user/type/user-type";

const HeaderUserList = () => {
  const router = useRouter();
  const { value, debouncedValue, setValue } = useDebounce("");
  const [selectedAccountType, setSelectedAccountType] = useState<
    string | undefined
  >(undefined);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined,
  );
  // search user
  useEffect(() => {
    if (debouncedValue) {
      router.query.search_user = debouncedValue;
      router.replace(router);
    } else {
      delete router.query.search_user;
      router.replace(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  // modal handler
  const openModal = useModalHandler((state) => state.openModal);
  const handleOpenModal = (modalKey: ModalKeys) => () => {
    openModal(modalKey);
  };

  const isCustomer = useMemo(() => {
    return router.asPath.includes("customer");
  }, [router]);
  // account types
  const accountTypeOptions = useMemo(() => {
    return [
      {
        name: "حقیقی",
        value: "personal",
      },
      {
        name: "حقوقی",
        value: "business",
      },
    ];
  }, []);
  // get roles list
  const { data: roles } = useQuery(apiRole().getAll());
  const positionOptions = useMemo(() => {
    let roleData = roles?.data.map((role) => {
      return {
        name: role.name,
        value: role.id.toString(),
      };
    });
    return roleData?.length
      ? roleData
      : [
          {
            name: "اپراتور آزمایشگاه",
            value: "1",
          },
          {
            name: "پذیرش",
            value: "2",
          },
        ];
  }, [roles?.data]);
  // get file URL for downloading
  // const { data: fileUrl, refetch } = useQuery({
  //   ...apiUser().getFileUrl({
  //     ...router.query,
  //     user_type: isCustomer ? UserType.CUSTOMER : UserType.STAFF,
  //     export_excel: true,
  //   }),
  //   enabled: false,
  // });
  const { data: customerFileUrl, refetch: refetchCustomerFileUrl } = useQuery({
    ...apiUser().getCustomerFileUrl({
      ...router.query,
      export_excel: true,
    }),
    enabled: false,
  });
  const { data: staffFileUrl, refetch: refetchStaffFileUrl } = useQuery({
    ...apiUser().getStaffFileUrl({
      ...router.query,
      export_excel: true,
    }),
    enabled: false,
  });
  const getFileUrl = async () => {
    // trigger the query to fetch the file URL
    const { data: file } = isCustomer
      ? await refetchCustomerFileUrl()
      : await refetchStaffFileUrl();
    // download the file if the URL is available
    if (file?.data.file_url) {
      const link = document.createElement("a");
      link.href = file?.data.file_url;
      link.download = "users-list.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const labelCustomerUser = useMemo(() => {
    return isCustomer ? "مشتری" : "همکار";
  }, [isCustomer]);

  return (
    <div>
      <header className="flex w-full flex-col items-center justify-between border-b border-background-paper-dark pb-6 md:flex-row md:pb-4">
        <span className="flex flex-col">
          <h6 className="text-[19px] font-bold">فهرست {labelCustomerUser}ان</h6>
          <p className="pb-8 pt-1 text-[14px]">
            {labelCustomerUser}انی که ثبت می‌کنید در این بخش قابل مشاهده هستند.
          </p>
        </span>
        {!isCustomer ? (
          <span className="flex flex-col items-end gap-4 md:flex-row">
            {/* <div className="mt-8 flex w-full justify-center lg:mt-auto lg:w-1/3 lg:justify-end"> */}
            <AccessLevel module={"user"} permission={["create"]}>
              <Button
                variant="solid"
                color="primary"
                onClick={handleOpenModal(ModalKeys.ADD_USER)}
                startIcon={
                  <SvgIcon
                    fillColor={"white"}
                    className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
                  >
                    <IcAddUser />
                  </SvgIcon>
                }
              >
                افزودن همکار جدید
              </Button>
            </AccessLevel>
            {/* </div> */}
          </span>
        ) : (
          <span className="flex flex-col items-end gap-4 md:flex-row">
            {/* <div className="mt-8 flex w-full justify-center lg:mt-auto lg:w-1/3 lg:justify-end"> */}
            <AccessLevel module={"user"} permission={["create"]}>
              <Button
                variant="solid"
                color="primary"
                onClick={handleOpenModal(ModalKeys.ADD_CUSTOMER)}
                startIcon={
                  <SvgIcon
                    fillColor={"white"}
                    className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
                  >
                    <IcAddUser />
                  </SvgIcon>
                }
              >
                افزودن مشتری جدید
              </Button>
            </AccessLevel>
            {/* </div> */}
          </span>
        )}
      </header>
      <div className="my-8 flex w-full flex-col items-center gap-4 lg:flex-row">
        <div className={`w-full lg:w-[17%]`}>
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (router.query.hasOwnProperty("page")) {
                delete router.query.page;
                router.replace(router);
              }
            }}
            className=""
            label={`جستجوی ${labelCustomerUser}`}
            placeholder={`نام ${labelCustomerUser} را وارد کنید`}
            endNode={
              <SvgIcon
                className={
                  "cursor-pointer [&_path]:fill-typography-gray [&_svg]:h-[15px] [&_svg]:w-[15px]"
                }
              >
                <IcSearch />
              </SvgIcon>
            }
          />
        </div>
        <div className={`w-full lg:w-[17%]`}>
          {isCustomer ? (
            <Select
              onItemChange={(selectedItem) => {
                setSelectedAccountType(selectedItem?.value || undefined);
                router.query.account_type = selectedItem?.value;
                if (!selectedItem?.value) {
                  delete router.query.account_type;
                }
                delete router.query.page;
                router.replace(router);
              }}
              options={accountTypeOptions}
              value={selectedAccountType}
              name={"account_type"}
              label={"نوع حساب کاربری"}
              holder={(activeItem, reset) => {
                return (
                  <Card
                    variant={"outline"}
                    className={
                      "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2 text-sm"
                    }
                  >
                    {activeItem ? (
                      // If empty and activeItem exists, reset
                      selectedAccountType ? (
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            reset();
                          }}
                          endIcon={
                            <SvgIcon
                              className={"[&_svg]:h-[14px] [&_svg]:w-[14px]"}
                            >
                              <CloseIcon />
                            </SvgIcon>
                          }
                          size={"tiny"}
                          color={"primary"}
                          variant={"outline"}
                        >
                          {activeItem?.name}
                        </Button>
                      ) : (
                        <span
                          className={
                            "py-[2px] text-[13px] text-typography-secondary"
                          }
                        >
                          نوع حساب را انتخاب کنید
                        </span>
                      )
                    ) : (
                      <span
                        className={
                          "py-[2px] text-[13px] text-typography-secondary"
                        }
                      >
                        نوع حساب را انتخاب کنید
                      </span>
                    )}
                    <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                      <IcChevronDown />
                    </SvgIcon>
                  </Card>
                );
              }}
            >
              {(item, activeItem) => (
                <Button
                  className={"w-full"}
                  variant={
                    activeItem?.value === item?.value && selectedAccountType
                      ? "outline"
                      : "text"
                  }
                  color={"primary"}
                >
                  {item?.name}
                </Button>
              )}
            </Select>
          ) : (
            <Select
              onItemChange={(selectedItem) => {
                setSelectedRole(selectedItem?.value || undefined);
                router.query.role = selectedItem?.value;
                if (!selectedItem?.value) {
                  delete router.query.role;
                }
                delete router.query.page;
                router.replace(router);
              }}
              options={positionOptions}
              value={selectedRole}
              name={"role"}
              label={"انتخاب سمت"}
              holder={(activeItem, reset) => (
                <Card
                  variant={"outline"}
                  className={
                    "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2 text-sm"
                  }
                >
                  {activeItem ? (
                    // If empty and activeItem exists, reset
                    selectedRole ? (
                      <Button
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          reset();
                        }}
                        endIcon={
                          <SvgIcon
                            className={"[&_svg]:h-[14px] [&_svg]:w-[14px]"}
                          >
                            <CloseIcon />
                          </SvgIcon>
                        }
                        size={"tiny"}
                        color={"primary"}
                        variant={"outline"}
                      >
                        {activeItem?.name}
                      </Button>
                    ) : (
                      <span
                        className={
                          "py-[2px] text-[13px] text-typography-secondary"
                        }
                      >
                        سمت را انتخاب کنید
                      </span>
                    )
                  ) : (
                    <span
                      className={
                        "py-[2px] text-[13px] text-typography-secondary"
                      }
                    >
                      سمت را انتخاب کنید
                    </span>
                  )}

                  <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                    <IcChevronDown />
                  </SvgIcon>
                </Card>
              )}
            >
              {(item, activeItem) => (
                <Button
                  className={"w-full"}
                  variant={
                    activeItem?.value === item?.value && selectedRole
                      ? "outline"
                      : "text"
                  }
                  color={"primary"}
                >
                  {item?.name}
                </Button>
              )}
            </Select>
          )}
        </div>
        <div className={`w-full lg:w-[66%]`}>
          <Downloder
            title={`دانلود لیست ${labelCustomerUser}ان`}
            onDownload={getFileUrl}
            onReset={() => {
              setSelectedAccountType(undefined);
              setSelectedRole(undefined);
              delete router.query.account_type;
              delete router.query.role;
            }}
            // onReset={() => {
            //   isCustomer
            //     ? delete router.query.account_type
            //     : delete router.query.role;
            // }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderUserList;
