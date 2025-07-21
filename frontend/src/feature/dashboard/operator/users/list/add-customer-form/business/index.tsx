import React from "react";
import * as yup from "yup";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Select } from "@kit/select";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { apiUser } from "@api/service/user";
import { apiRole } from "@api/service/role";
import { FormHandler } from "@utils/form-handler";
import { apiDepartment } from "@api/service/department";
import { UserType } from "@api/service/user/type/user-type";
import { validation } from "@utils/form-handler/validation";
import { AccountType } from "@api/service/user/type/account-type";
import { IcCheck, IcChevronDown } from "@feature/kits/common/icons";
import { apiEducationalField } from "@api/service/educational-field";
import { CreateUserType } from "@api/service/user/type/current-user";
import { apiEducationalLevel } from "@api/service/educational-levels";

export const BusinessCustomer = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  // get data
  const { data: roles } = useQuery(apiRole().getAll());
  const { data: educationFields } = useQuery(apiEducationalField().getAll());
  const { data: educationLevels } = useQuery(apiEducationalLevel().getAll());
  const { data: departments } = useQuery(apiDepartment().getAll());
  // is sharif switch
  const [sharifEmailApproval, setSharifEmailApproval] = useState<
    boolean | undefined
  >(undefined);
  // role list for create customer : customers roles list-> only student and customer and teacher
  // development teacher role id: 10 --- sharif teacher role id: 15
  const positionOptions = useMemo(() => {
    let roleData = roles?.data
      ?.filter(
        (role) =>
          role.id === 10 || role.id === 11 || role.id === 12 || role.id === 15,
      )
      ?.map((role) => {
        return {
          value: role.id.toString(),
          anotherCustomName: role.name,
        };
      });
    return roleData?.length
      ? roleData
      : [
          {
            value: "12",
            anotherCustomName: "مشتری",
          },
        ];
  }, [roles?.data]);
  // educational level list
  const gradesList = useMemo(() => {
    let levels = educationLevels?.data.map((level) => {
      return {
        value: level.id.toString(),
        name: level.name,
      };
    });
    return levels?.length ? levels : [];
  }, [educationLevels?.data]);
  // educational field list
  const fieldsList = useMemo(() => {
    let fields = educationFields?.data.map((field) => {
      return {
        value: field.id.toString(),
        name: field.name,
      };
    });
    return fields?.length ? fields : [];
  }, [educationFields?.data]);
  // department list
  const departmentsList = useMemo(() => {
    let department = departments?.data.map((dep) => {
      return {
        value: dep.id.toString(),
        name: dep.name,
      };
    });
    return department?.length ? department : [];
  }, [departments?.data]);
  // form values
  const initialValues = useMemo(() => {
    return {
      first_name: "",
      last_name: "",
      national_id: "",
      username: "",
      password: "",
      postal_code: "",
      address: "",
      email: "",
      company_name: "",
      company_telephone: "",
      company_national_id: "",
      company_economic_number: "",
    };
  }, []);
  // form validation
  const addUserValidationSchema = useMemo(() => {
    return yup.object({
      first_name: validation.persianInput,
      last_name: validation.persianInput,
      national_id: validation.nationalCode,
      username: validation.mobile,
      password: validation.password,
      company_name: validation.requiredInput,
      email: validation.email,
      company_national_id: validation.requiredInput,
      postal_code: validation.optionalPostalCode,
      company_telephone: validation.optionalPhone,
      address: validation.requiredInput,
      approvalRules: validation.checkboxInput,
      company_economic_number: validation.requiredInput,
    });
  }, []);
  // add user service
  const { mutateAsync } = useMutation(
    apiUser(true, {
      success: "ثبت مشتری با موفقیت انجام شد",
      fail: "ثبت مشتری انجام نشد",
      waiting: "درحال انتظار",
    }).create(),
  );
  // add user info
  const submit = (values: CreateUserType) => {
    let data = {
      user_type: UserType.CUSTOMER,
      account_type: AccountType.BUSINESS,
      first_name: values.first_name,
      last_name: values.last_name,
      role: values.role,
      username: `+98${values.username?.slice(1, 11)}`,
      national_id: values.national_id,
      password: values.password,
      // access_level: values.access_level,
      address: values.address,
      postal_code: values.postal_code,
      email: values.email,
      company_telephone: values.company_telephone,
      company_name: values.company_name,
      company_national_id: values.company_national_id,
      company_economic_number: values.company_economic_number,
    };
    mutateAsync(data)
      .then((res) => {
        closeModal();
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (sharifEmailApproval === undefined) return;
    inputRef.current?.focus();
    inputRef.current?.blur();
  }, [sharifEmailApproval]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <FormHandler
        validationSchema={addUserValidationSchema}
        initialValues={initialValues}
        handleSubmit={(values) => submit(values)}
      >
        {(formik) => (
          <div className="grid grid-cols-1 gap-6 pb-3 text-right md:grid-cols-2">
            <div className="col-span-2 rounded-[8px] bg-secondary-light bg-opacity-30 p-4">
              <h6 className="font-bold">اطلاعات سازمان/شرکت</h6>
              <p className="pt-1 text-[14px]">
                اطلاعات سازمان/شرکت برای ثبت مشتری حقوقی ضروری می‌باشد.
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"company_name"}
                formik={formik}
                autoComplete={"company_name"}
                placeholder="نام سازمان را وارد کنید"
                label={"نام سازمان"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"email"}
                formik={formik}
                autoComplete={"email"}
                placeholder="ایمیل سازمانی را وارد کنید"
                label={"ایمیل سازمانی"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"company_national_id"}
                formik={formik}
                autoComplete={"company_national_id"}
                placeholder="شناسه ملی سازمان را وارد کنید"
                label={"شناسه ملی سازمان"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"company_economic_number"}
                formik={formik}
                autoComplete={"company_economic_number"}
                placeholder="شماره اقتصادی سازمان را وارد کنید"
                label={"شماره اقتصادی"}
              />
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"company_telephone"}
                formik={formik}
                autoComplete={"company_telephone"}
                maxLength={11}
                minLength={11}
                placeholder="تلفن سازمان را وارد کنید"
                label={"تلفن"}
                type="number"
              />
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"postal_code"}
                formik={formik}
                autoComplete={"postal_code"}
                placeholder="کدپستی سازمان را وارد کنید"
                label={"کدپستی"}
                type="number"
              />
            </div>
            <div className="col-span-2 ">
              <Input
                name={"address"}
                formik={formik}
                autoComplete={"address"}
                placeholder="آدرس سازمان را وارد کنید"
                label={"آدرس"}
              />
            </div>
            <div className="col-span-2 my-2 rounded-[8px] bg-secondary-light bg-opacity-30 p-4">
              <h6 className="font-bold">اطلاعات نماینده</h6>
              <p className="pt-1 text-[14px]">
                اطلاعات نماینده سازمان یا شرکت را وارد نمایید.
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"first_name"}
                formik={formik}
                autoComplete={"first_name"}
                placeholder="نام را وارد کنید"
                label={"نام"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"last_name"}
                formik={formik}
                autoComplete={"last_name"}
                placeholder="نام خانوادگی را وارد کنید"
                label={"نام خانوادگی"}
              />
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"national_id"}
                formik={formik}
                autoComplete={"national_id"}
                placeholder="کدملی را وارد کنید"
                label={"کد ملی"}
                maxLength={10}
                minLength={10}
                type="number"
              />
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Select
                multiple
                name={"role"}
                formik={formik}
                options={positionOptions}
                label={"سمت"}
                placeholder="سمت مشتری راانتخاب کنید"
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
                        "سمت مشتری را انتخاب کنید"
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
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"username"}
                formik={formik}
                autoComplete={"username"}
                maxLength={11}
                minLength={11}
                placeholder="شماره همراه را وارد کنید"
                label={"شماره همراه"}
                type="number"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"password"}
                formik={formik}
                autoComplete={"password"}
                type={"password"}
                placeholder="رمز عبور خود را وارد کنید"
                label="رمز عبور"
                helper={"حداقل 5 کاراکتر"}
                // label={
                //   <span>
                //     رمز عبور
                //     <span className="px-1 text-[12px] text-common-gray">
                //       (حداقل 5 کاراکتر)
                //     </span>
                //   </span>
                // }
                passwordHandler
              />
            </div>
            <div className="col-span-2 flex justify-end pt-1">
              <Button
                startIcon={
                  <SvgIcon
                    strokeColor="white"
                    className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
                  >
                    <IcCheck />
                  </SvgIcon>
                }
                variant="solid"
                color="primary"
                disabled={!formik.isValid}
              >
                ثبت مشتری جدید
              </Button>
            </div>
          </div>
        )}
      </FormHandler>
    </>
  );
};
