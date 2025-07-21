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

export const PersonalCustomer = ({
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
      email: "",
      student_id: "",
      educational_level: "",
      educational_field: "",
      postal_code: "",
      telephone: "",
      department: "",
      sharifUserDepartment: undefined,
      address: "",
    };
  }, []);
  // form validation
  const addUserValidationSchema = useMemo(() => {
    const schemaFields: Record<string, yup.AnySchema> = {
      first_name: validation.persianInput,
      last_name: validation.persianInput,
      national_id: validation.nationalCode,
      username: validation.mobile,
      password: validation.password,
      email: sharifEmailApproval ? validation.sharifEmail : validation.email,
      postal_code: validation.optionalPostalCode,
      telephone: validation.optionalPhone,
      // educational_level: validation.requiredInput,
      // educational_field: validation.requiredInput,
      // student_id: validation.studentId,
      // department: sharifEmailApproval
      //   ? validation.requiredInput
      //   : yup.string().nullable(),
    };

    if (sharifEmailApproval) {
      schemaFields.sharifUserDepartment = validation.requiredInput;
    }

    return yup.object(schemaFields);
  }, [sharifEmailApproval]);
  // add user service
  const { mutateAsync } = useMutation(
    apiUser(true, {
      success: "ثبت مشتری با موفقیت انجام شد",
      fail: "ثبت مشتری انجام نشد",
      waiting: "درحال انتظار",
    }).create(),
  );
  // add user info
  const submit = (
    values: CreateUserType & { sharifUserDepartment: number | undefined },
  ) => {
    let data = {
      user_type: UserType.CUSTOMER,
      account_type: AccountType.PERSONAL,
      first_name: values.first_name,
      last_name: values.last_name,
      role: values.role,
      username: `+98${values.username?.slice(1, 11)}`,
      national_id: values.national_id,
      password: values.password,
      email: values.email,
      address: values.address,
      postal_code: values.postal_code,
      is_sharif_student: sharifEmailApproval ? true : false,
      telephone: values.telephone,
      educational_level: values.educational_level
        ? Number(values.educational_level)
        : "",
      educational_field: values.educational_field
        ? Number(values.educational_field)
        : "",
      department: sharifEmailApproval
        ? values.sharifUserDepartment
          ? Number(values.sharifUserDepartment)
          : undefined
        : values.department
          ? Number(values.department)
          : undefined,
      // department: values.department ? Number(values.department) : "",
      // student_id: values.student_id,
      // access_level: values.access_level,
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
              <h6 className="font-bold">اطلاعات ضروری</h6>
              <p className="pt-1 text-[14px]">
                این اطلاعات برای ثبت مشتری ضروری می‌باشد.
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
            <div className="col-span-2 flex flex-col gap-1 md:col-span-1">
              <Input
                name={"email"}
                formik={formik}
                autoComplete={"email"}
                placeholder="ایمیل را وارد کنید"
                label={"ایمیل"}
                ref={inputRef}
              />

              <div className="col-span-2 pt-3">
                <input
                  type="checkbox"
                  id="sharifEmailApproval"
                  onChange={() => {
                    setSharifEmailApproval(!sharifEmailApproval);
                    formik.values.department = "";
                  }}
                  name="sharifEmailApproval"
                  className={`accent-black h-3 w-3 `}
                ></input>
                <label
                  htmlFor="sharifEmailApproval"
                  className={`pr-2 text-[12px] font-medium`}
                >
                  استاد یا دانشجوی دانشگاه صنعتی شریف می‌باشد.
                  <p className="pr-5 text-[11px] font-normal text-common-gray">
                    * برای استفاده از تخفیف‌ها، وارد کردن ایمیل دانشگاهی شریف
                    الزامیست.
                  </p>
                </label>
              </div>
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
            {sharifEmailApproval && (
              <div className="col-span-2 md:col-span-1">
                <Select
                  options={departmentsList}
                  label={"دانشکده"}
                  name={"sharifUserDepartment"}
                  formik={formik}
                  holder={(activeItem) => (
                    <Card
                      variant={"outline"}
                      className={
                        "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
                      }
                    >
                      <span
                        className={
                          activeItem
                            ? "text-typography-main"
                            : "text-[13px] text-typography-secondary"
                        }
                      >
                        {activeItem?.name ?? "دانشکده را انتخاب کنید"}
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
                        item?.value === activeItem?.value ? "solid" : "text"
                      }
                      color={"primary"}
                    >
                      {item?.name}
                    </Button>
                  )}
                </Select>
              </div>
            )}
            <div className="col-span-2 mt-2 rounded-[8px] bg-secondary-light bg-opacity-30 p-4">
              <h6 className="font-bold">اطلاعات اختیاری</h6>
              <p className="pt-1 text-[14px]">
                با تکمیل این اطلاعات، به ما در ارائه خدمات بهتر کمک می‌کنید.
              </p>
            </div>

            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"student_id"}
                formik={formik}
                autoComplete={"student_id"}
                placeholder="شماره دانشجویی را وارد کنید"
                label={"شماره دانشجویی"}
                type="number"
              />
            </div>

            {!sharifEmailApproval && (
              <div className="col-span-2 md:col-span-1">
                <Select
                  options={departmentsList}
                  label={"دانشکده"}
                  name={"department"}
                  formik={formik}
                  resettable
                  holder={(activeItem) => (
                    <Card
                      variant={"outline"}
                      className={
                        "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
                      }
                    >
                      <span
                        className={
                          activeItem
                            ? "text-typography-main"
                            : "text-[13px] text-typography-secondary"
                        }
                      >
                        {activeItem?.name ?? "دانشکده را انتخاب کنید"}
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
                        item?.value === activeItem?.value ? "solid" : "text"
                      }
                      color={"primary"}
                    >
                      {item?.name}
                    </Button>
                  )}
                </Select>
              </div>
            )}
            <div className="col-span-2 md:col-span-1">
              <Select
                options={gradesList}
                name={"educational_level"}
                label={"مقطع تحصیلی"}
                formik={formik}
                holder={(activeItem) => (
                  <Card
                    variant={"outline"}
                    className={
                      "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
                    }
                  >
                    <span
                      className={
                        activeItem
                          ? "text-typography-main"
                          : "text-[13px] text-typography-secondary"
                      }
                    >
                      {activeItem?.name ?? "مقطع تحصیلی را انتخاب کنید"}
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
                      item?.value === activeItem?.value ? "solid" : "text"
                    }
                    color={"primary"}
                  >
                    {item?.name}
                  </Button>
                )}
              </Select>
            </div>

            <div className="col-span-2 md:col-span-1">
              <Select
                options={fieldsList}
                name={"educational_field"}
                formik={formik}
                label={"رشته تحصیلی"}
                holder={(activeItem) => (
                  <Card
                    variant={"outline"}
                    className="mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
                  >
                    <span
                      className={
                        activeItem
                          ? "text-typography-main"
                          : "text-[13px] text-typography-secondary"
                      }
                    >
                      {activeItem?.name ?? "رشته تحصیلی را انتخاب کنید"}
                    </span>
                    <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                      <IcChevronDown />
                    </SvgIcon>
                  </Card>
                )}
              >
                {(item, activeItem) => (
                  <Button
                    className="w-full"
                    variant={
                      item?.value === activeItem?.value ? "solid" : "text"
                    }
                    color={"primary"}
                  >
                    {item?.name}
                  </Button>
                )}
              </Select>
            </div>

            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"telephone"}
                formik={formik}
                autoComplete={"telephone"}
                maxLength={11}
                minLength={11}
                placeholder="تلفن را وارد کنید"
                label={"تلفن"}
                type="number"
              />
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"postal_code"}
                formik={formik}
                autoComplete={"postal_code"}
                placeholder="کدپستی را وارد کنید"
                label={"کدپستی"}
                type="number"
              />
            </div>
            <div className="col-span-2">
              <Input
                name={"address"}
                formik={formik}
                autoComplete={"address"}
                placeholder="آدرس را وارد کنید"
                label={"آدرس"}
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
