import React from "react";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Select } from "@kit/select";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { apiRole } from "@api/service/role";
import { apiUser } from "@api/service/user";
import { FormHandler } from "@utils/form-handler";
import { UserType } from "@api/service/user/type/user-type";
import { validation } from "@utils/form-handler/validation";
import { useModalHandler } from "@utils/modal-handler/config";
import { IcChevronDown, IcClose } from "@feature/kits/common/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import { useReloadUsers } from "../../get-info-user";

const ChangeUserType = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  const { setReloadUsers } = useReloadUsers();
  const hideModal = useModalHandler((state) => state.hideModal);
  const [formIsDisplayed, setFormIsdisplayed] = useState(false);
  // get modal data
  const user = useModalHandler((state) => state.modalData);
  // get roles
  const { data: roles } = useQuery(apiRole().getAll());
  // role list
  const positionOptions = useMemo(() => {
    let roleData = roles?.data
      ?.filter((role) => role.id !== 11 && role.id !== 12)
      ?.map((role) => {
        return {
          anotherCustomName: role.name,
          value: role.id.toString(),
        };
      });
    return roleData?.length
      ? roleData
      : [
          {
            anotherCustomName: "اپراتور آزمایشگاه",
            value: "1",
          },
          {
            anotherCustomName: "پذیرش",
            value: "2",
          },
        ];
  }, [roles?.data]);
  // form values
  const initialValues = useMemo(() => {
    return {
      // role: user.role_obj?.map((role: any) => role.id.toString()) ?? [],
      role: [],
    };
  }, []);
  // form validation
  const userValidation = useMemo(() => {
    return yup.object({
      role: validation.requiredArrayInput,
    });
  }, []);
  const isCustomer = useMemo(() => {
    return router.asPath.includes("customer");
  }, [router]);

  const labelCustomerUser = useMemo(() => {
    return isCustomer ? "مشتری" : "همکار";
  }, [isCustomer]);
  const updateUserHandler = () => {
    if (labelCustomerUser === "همکار") {
      changeUserToCustomer();
    } else {
      setFormIsdisplayed(true);
    }
  };
  // update user api
  const { mutateAsync } = useMutation(
    apiUser(true, {
      success: `تغییر نقش موفقیت آمیز بود`,
      fail: `تغییر نقش انجام نشد`,
      waiting: "در حال انتظار",
    }).changeUserType(user.id),
  );
  // update user type
  const changeUserToCustomer = () => {
    let data = {
      role: [12],
      national_id: user.national_id,
      username: user.username,
      user_type: UserType.CUSTOMER,
    };
    mutateAsync(data)
      .then((res) => {
        // refetch data
        setReloadUsers(true);
        // clientQuery.invalidateQueries({
        //   queryKey: [apiUser().url],
        // });
        hideModal();
      })
      .catch((err) => {});
  };
  const changeCustomerToUser = (values: any) => {
    let data = {
      role: values.role,
      national_id: user.national_id,
      username: user.username,
      user_type: UserType.STAFF,
    };
    mutateAsync(data)
      .then((res) => {
        // refetch data
        setReloadUsers(true);
        // clientQuery.invalidateQueries({
        //   queryKey: [apiUser().url],
        // });
        hideModal();
      })
      .catch((err) => {});
  };
  return (
    <Card
      color={"white"}
      className="w-[80vw] px-6 pb-8 pt-6 md:w-[50vw] md:pt-8 lg:w-[35vw]"
    >
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">
          تغییر نقش {labelCustomerUser}
        </h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <Card
        color={"info"}
        className="mb-8 mt-7 px-4 py-7 text-center text-[15px]"
      >
        آیا می‌خواهید نقش {user.first_name} {user.last_name} را از &quot;
        {labelCustomerUser}&quot; به &quot;
        {labelCustomerUser === "مشتری" ? "همکار" : "مشتری"}&quot; تغییر دهید؟
        {formIsDisplayed && (
          <p className="pt-4 text-[13px] text-error">
            سمت جدید کاربر را بررسی نمایید.
          </p>
        )}
      </Card>
      {formIsDisplayed && (
        <FormHandler
          validationSchema={userValidation}
          initialValues={initialValues}
          handleSubmit={(values) => changeCustomerToUser(values)}
        >
          {(formik) => (
            <div className="flex justify-center">
              <div className="w-full md:w-2/3">
                <Select
                  multiple
                  name={"role"}
                  formik={formik}
                  options={positionOptions}
                  label={"سمت کاربر"}
                  placeholder={`سمت جدید کاربر را انتخاب کنید`}
                  holder={(activeItem, reset, deleteItem) => (
                    <Card
                      variant={"outline"}
                      className={
                        "mt-2 flex w-full cursor-pointer items-center justify-between overflow-x-auto whitespace-nowrap px-2 py-2 text-sm"
                      }
                    >
                      <span
                        className={
                          !activeItem?.length
                            ? "py-[2px] text-[13px] text-typography-secondary"
                            : "text-typography-main"
                        }
                      >
                        {!activeItem?.length ? (
                          `سمت کاربر را انتخاب کنید`
                        ) : (
                          <div className={"flex flex-row gap-1"}>
                            {React?.Children?.toArray(
                              activeItem?.map((item) => (
                                <Button
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    deleteItem(item);
                                  }}
                                  endIcon={
                                    <SvgIcon
                                      className={
                                        "[&_svg]:h-[14px] [&_svg]:w-[14px]"
                                      }
                                    >
                                      <CloseIcon />
                                    </SvgIcon>
                                  }
                                  size={"tiny"}
                                  color={"primary"}
                                  variant={"outline"}
                                >
                                  {item?.anotherCustomName}
                                </Button>
                              )),
                            )}
                          </div>
                        )}
                      </span>
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
                        activeItem
                          ?.map((activeIndexItem) => activeIndexItem?.value)
                          ?.includes(item?.value)
                          ? "solid"
                          : "text"
                      }
                      color={"primary"}
                    >
                      {item?.anotherCustomName}
                    </Button>
                  )}
                </Select>
                <div className="flex justify-center gap-[12px] pt-8">
                  <Button
                    className="w-[100px]"
                    variant="outline"
                    onClick={hideModal}
                  >
                    لغو
                  </Button>
                  <Button
                    disabled={
                      !formik.isValid || formik.values.role.length === 0
                    }
                  >
                    ذخیره تغییرات
                  </Button>
                </div>
              </div>
            </div>
          )}
        </FormHandler>
      )}
      {!formIsDisplayed && (
        <div className="flex justify-center gap-[12px]">
          <Button className="w-[100px]" variant="outline" onClick={hideModal}>
            خیر
          </Button>
          <Button className="w-[100px]" onClick={() => updateUserHandler()}>
            بله
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ChangeUserType;
