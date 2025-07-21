import React from "react";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Switch } from "@kit/switch";
import { Select } from "@kit/select";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { apiRole } from "@api/service/role";
import { apiUser } from "@api/service/user";
import { FormHandler } from "@utils/form-handler";
import { apiDepartment } from "@api/service/department";
import { apiAccessLevel } from "@api/service/access-level";
import { validation } from "@utils/form-handler/validation";
import { useModalHandler } from "@utils/modal-handler/config";
import { AccountType } from "@api/service/user/type/account-type";
import { IcCheck, IcChevronDown } from "@feature/kits/common/icons";
import { apiEducationalField } from "@api/service/educational-field";
import { useUserEditHandler, useReloadUsers } from "../get-info-user";
import { apiEducationalLevel } from "@api/service/educational-levels";
import { CurrentUserType } from "@api/service/user/type/current-user";

const EditUserForm = () => {
  const router = useRouter();
  const { data: accessLevels } = useQuery(apiAccessLevel().getAll());
  const {
    access_level,
    position,
    password,
    first_name,
    last_name,
    national_id,
    username,
    id,
  } = useUserEditHandler();
  const { setReloadUsers } = useReloadUsers();
  // modal handler
  const hideModal = useModalHandler((state) => state.hideModal);
  // customer/user
  const isCustomer = useMemo(() => {
    return router.asPath.includes("customer");
  }, [router]);
  const labelCustomerUser = useMemo(() => {
    return isCustomer ? "مشتری" : "همکار";
  }, [isCustomer]);
  // edit user service
  const { mutateAsync } = useMutation(
    apiUser(true, {
      success: `ویرایش ${labelCustomerUser} موفقیت آمیز بود`,
      fail: `ویرایش ${labelCustomerUser} انجام نشد`,
      waiting: "در حال انتظار",
    }).update(id),
  );
  // get data
  const user: CurrentUserType = useModalHandler((state) => state.modalData);
  const { data: roles } = useQuery(apiRole().getAll());
  const { data: departments } = useQuery(apiDepartment().getAll());
  const { data: educationFields } = useQuery(apiEducationalField().getAll());
  const { data: educationLevels } = useQuery(apiEducationalLevel().getAll());
  // is sharif switch
  const [sharifEmailApproval, setSharifEmailApproval] = useState<boolean>(
    user.is_sharif_student ?? false,
  );
  // is partner switch
  const [isPartner, setIsPartner] = useState<boolean>(user.is_partner ?? false);
  // account type : personal/business
  const isPersonalAccount = useMemo(() => {
    return user.account_type === AccountType.PERSONAL ? true : false;
  }, [user]);
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
  // role list : users roles list-> all roles except student and customer
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
  // role list for edit customer : customers roles list-> only student and customer and teacher
  // development teacher role id: 10 --- sharif teacher role id: 15
  const customerRolesList = useMemo(() => {
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
  // access level list
  const accessOptions = useMemo(() => {
    let accsessLevelData = accessLevels?.data.map((level) => {
      return {
        anotherCustomName: level.name,
        value: level.id.toString(),
      };
    });

    return accsessLevelData?.length
      ? accsessLevelData
      : [
          {
            anotherCustomName: "ثبت نوبت و دریافت هزینه",
            value: "1",
          },
          {
            anotherCustomName: "مدیریت کارمندان",
            value: "2",
          },
        ];
  }, [accessLevels?.data]);
  // form values
  const initialValues = useMemo(() => {
    return {
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      role: user.role_obj?.map((role) => role.id.toString()) ?? [],
      access_level:
        user.access_level_obj?.map((level) => level.id.toString()) ?? [],
      national_id: isPersonalAccount
        ? user.national_id
        : !!user?.linked_users_objs?.length
          ? user?.linked_users_objs[0]?.national_id
          : user.national_id,
      username: isPersonalAccount
        ? user?.username
          ? `0${user?.username.slice(3, user?.username.length)}` // personal account
          : ""
        : !!user?.linked_users_objs?.length
          ? user?.linked_users_objs[0]?.username
            ? `0${user?.linked_users_objs[0]?.username.slice(3, user?.linked_users_objs[0].username.length)}` //business account from signup
            : ""
          : user?.username
            ? `0${user?.username.slice(3, user?.username.length)}` //business account from customers management
            : "",
      // user.username
      //   ? `0${user.username?.slice(3, user.username.length)}`
      //   : "",
      // password: user.password,
      account_type: user.account_type,
      is_partner: user.is_partner,
      postal_code: user.postal_code,
      // personal
      email: user.email,
      student_id: user.student_id,
      field: user?.educational_field?.toString(),
      grade: user?.educational_level?.toString(),
      department: user.is_sharif_student ? "" : user.department?.toString(),
      sharifUserDepartment: user.is_sharif_student
        ? user.department?.toString()
        : undefined,
      telephone: user.telephone,
      is_sharif_student: user.is_sharif_student,
      // business
      address: user.address,
      company_name: user.company_name,
      organizationEmail: user.email,
      organizationId: user.company_national_id,
      company_telephone: user.company_telephone,
      company_economic_number: user.company_economic_number,
    };
  }, [user, isPersonalAccount]);
  // form validation
  // const editUserValidation = useMemo(() => {
  //   return isPersonalAccount
  //     ? yup.object({
  //         first_name: validation.persianInput,
  //         last_name: validation.persianInput,
  //         role: validation.requiredArrayInput,
  //         // access_level: validation.requiredArrayInput,
  //         username: validation.mobile,
  //         national_id: validation.nationalCode,
  //         // password: validation.requiredInput,
  //         email: sharifEmailApproval
  //           ? validation.sharifEmail
  //           : validation.email,
  //         // rulesApproval: validation.checkboxInput,
  //         postal_code: validation.optionalpostalCode,
  //         telephone: validation.optionalPhone,
  //         department: sharifEmailApproval
  //           ? validation.requiredInput
  //           : yup.string().nullable(),
  //       })
  //     : yup.object({
  //         first_name: validation.persianInput,
  //         last_name: validation.persianInput,
  //         role: validation.requiredArrayInput,
  //         // access_level: validation.requiredArrayInput,
  //         username: validation.mobile,
  //         national_id: validation.nationalCode,
  //         // password: validation.requiredInput,
  //         company_name: validation.requiredInput,
  //         organizationEmail: validation.email,
  //         organizationId: validation.requiredInput,
  //         postal_code: validation.postalCode,
  //         phone: validation.phone,
  //         address: validation.persianInput,
  //         company_economic_number: validation.requiredInput,
  //       });
  // }, [sharifEmailApproval, isPersonalAccount]);
  const editUserValidation = useMemo(() => {
    const schemaFields: Record<string, yup.AnySchema> = {
      first_name: validation.persianInput,
      last_name: validation.persianInput,
      role: validation.requiredArrayInput,
      // role: validation.requiredArrayInput.test(
      //   "check-role",
      //   "سمت نمی‌تواند فقط استاد باشد",
      //   (roles) => {
      //     if (
      //       !isCustomer &&
      //       roles.length === 1 &&
      //       (roles.includes("10") || roles.includes("15"))
      //     ) {
      //       return false;
      //     }
      //     return true;
      //   },
      // ),
      username: validation.mobile,
      national_id: validation.nationalCode,
      postal_code: validation.optionalPostalCode,
    };

    if (isPersonalAccount) {
      schemaFields.email = sharifEmailApproval
        ? validation.sharifEmail
        : validation.email;
      schemaFields.telephone = validation.optionalPhone;
      if (sharifEmailApproval) {
        schemaFields.sharifUserDepartment = validation.requiredInput;
      }
    } else {
      schemaFields.company_name = validation.requiredInput;
      schemaFields.organizationEmail = validation.email;
      schemaFields.organizationId = validation.requiredInput;
      schemaFields.company_telephone = validation.optionalPhone;
      schemaFields.address = validation.persianInput;
      schemaFields.company_economic_number = validation.requiredInput;
    }
    return yup.object(schemaFields);
  }, [isPersonalAccount, sharifEmailApproval]);
  // update user info
  const submit = (values: any) => {
    if (
      !isCustomer &&
      values.role.length === 1 &&
      (values.role.includes("10") || values.role.includes("15"))
    ) {
      return;
    }
    let data = {
      ...values,
      first_name: values.first_name,
      last_name: values.last_name,
      role: values.role,
      access_level: values.access_level,
      national_id: values.national_id,
      username: `+98${values.username.slice(1, values.username.length)}`,
      // password : values.password
      email: values.email,
      postal_code: values.postal_code,
    };
    if (isCustomer) {
      data.is_partner = isPartner ? true : false;
    }
    if (isPersonalAccount) {
      data.telephone = values.telephone;
      // data.department = values.department ? Number(values.department) : "";
      (data.department = sharifEmailApproval
        ? values.sharifUserDepartment
          ? Number(values.sharifUserDepartment)
          : undefined
        : values.department
          ? Number(values.department)
          : undefined),
        (data.student_id = values.studentId);
      data.educational_level = Number(values.grade);
      data.educational_field = Number(values.field);
      data.is_sharif_student = sharifEmailApproval ? true : false;
    }
    if (!isPersonalAccount) {
      data.company_national_id = values.company_national_id;
      data.company_economic_number = values.company_economic_number;
      data.company_telephone = values.company_telephone;
    }
    // if (values.password) {
    //   data.password = values.password;
    // }
    mutateAsync(data)
      .then((res) => {
        setReloadUsers(true);
        setTimeout(() => {
          hideModal();
        }, 1000);
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
    <FormHandler
      validationSchema={editUserValidation}
      initialValues={initialValues}
      handleSubmit={(values) => submit(values)}
    >
      {(formik) => (
        <div>
          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
            <span className="col-span-2 md:col-span-1">
              <Input
                label={"نام"}
                placeholder={`نام ${labelCustomerUser} را وارد کنید`}
                name={"first_name"}
                formik={formik}
                value={first_name}
                className="bg-common-white"
              />
            </span>
            <span className="col-span-2 md:col-span-1">
              <Input
                label={"نام خانوادگی"}
                placeholder={`نام خانوادگی ${labelCustomerUser} را وارد کنید`}
                name={"last_name"}
                formik={formik}
                defaultValue={last_name}
                className="bg-common-white"
              />
            </span>
            {/* <Input
              label={"رمز عبور"}
              placeholder={`رمز عبور ${labelCustomerUser} خود را وارد کنید`}
              name={"password"}
              formik={formik}
              defaultValue={password}
              className="bg-common-white"
              type="password"
              passwordHandler
            /> */}
            <span className="col-span-2 md:col-span-1">
              <Input
                label={"کد ملی"}
                placeholder={"کد ملی را وارد کنید"}
                name={"national_id"}
                formik={formik}
                value={national_id}
                className="bg-common-white"
              />
            </span>
            <span className="col-span-2 md:col-span-1">
              <Input
                label={"شماره همراه"}
                placeholder={"شماره همراه را وارد کنید"}
                name={"username"}
                formik={formik}
                value={username}
                className="bg-common-white"
              />
            </span>
            {isPersonalAccount ? (
              <>
                <div className="col-span-2 flex flex-col gap-1 md:col-span-1">
                  <span className="col-span-2 md:col-span-1">
                    <Input
                      name={"email"}
                      formik={formik}
                      autoComplete={"email"}
                      placeholder="ایمیل را وارد کنید"
                      label={"ایمیل"}
                      className="bg-common-white"
                      ref={inputRef}
                    />
                  </span>
                  <div className="pt-3">
                    <input
                      type="checkbox"
                      id="sharifEmailApproval"
                      onChange={() => {
                        setSharifEmailApproval(!sharifEmailApproval);
                      }}
                      name="sharifEmailApproval"
                      checked={sharifEmailApproval}
                      className={`accent-black h-3 w-3 `}
                    ></input>
                    <label
                      htmlFor="sharifEmailApproval"
                      className={`pr-2 text-[12px] font-medium`}
                    >
                      استاد یا دانشجوی دانشگاه صنعتی شریف می‌باشد.
                      <p className="pr-5 text-[11px] font-normal text-common-gray">
                        * برای استفاده از تخفیف‌ها، وارد کردن ایمیل دانشگاهی
                        شریف و دانشکده الزامیست.
                      </p>
                    </label>
                  </div>
                </div>
                {sharifEmailApproval && (
                  <div className="col-span-2 md:col-span-1">
                    <Select
                      options={departmentsList}
                      label={"دانشکده"}
                      name={"sharifUserDepartment"}
                      formik={formik}
                      className="bg-common-white"
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

                          <SvgIcon
                            className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
                          >
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

                <span className="col-span-2 md:col-span-1">
                  <Input
                    name={"studentId"}
                    formik={formik}
                    autoComplete={"studentId"}
                    placeholder="شماره دانشجویی را وارد کنید"
                    label={"شماره دانشجویی"}
                    type="number"
                    className="bg-common-white"
                  />
                </span>
                {!sharifEmailApproval && (
                  <div className="col-span-2 md:col-span-1">
                    <Select
                      options={departmentsList}
                      label={"دانشکده"}
                      name={"department"}
                      formik={formik}
                      resettable
                      className="bg-common-white"
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
                            {activeItem?.name ?? "دانشکده خود را انتخاب کنید"}
                          </span>

                          <SvgIcon
                            className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
                          >
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
                <span className="col-span-2 md:col-span-1">
                  <Select
                    options={gradesList}
                    name={"grade"}
                    label={"مقطع تحصیلی"}
                    formik={formik}
                    className="bg-common-white"
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

                        <SvgIcon
                          className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
                        >
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
                </span>
                <span className="col-span-2 md:col-span-1">
                  <Select
                    options={fieldsList}
                    name={"field"}
                    formik={formik}
                    label={"رشته تحصیلی"}
                    className="bg-common-white"
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
                        <SvgIcon
                          className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
                        >
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
                </span>
                <span className="col-span-2 md:col-span-1">
                  <Input
                    name={"telephone"}
                    formik={formik}
                    autoComplete={"telephone"}
                    maxLength={11}
                    minLength={11}
                    placeholder="تلفن را وارد کنید"
                    label={"تلفن"}
                    type="number"
                    className="bg-common-white"
                  />
                </span>
                <span className="col-span-2 md:col-span-1">
                  <Input
                    name={"postal_code"}
                    formik={formik}
                    autoComplete={"postal_code"}
                    placeholder="کدپستی را وارد کنید"
                    label={"کدپستی"}
                    type="number"
                    className="bg-common-white"
                  />
                </span>
              </>
            ) : (
              <>
                <Input
                  name={"company_name"}
                  formik={formik}
                  autoComplete={"company_name"}
                  placeholder="نام سازمان را وارد کنید"
                  label={"نام سازمان"}
                  className="bg-common-white"
                />
                <Input
                  name={"organizationEmail"}
                  formik={formik}
                  autoComplete={"organizationEmail"}
                  placeholder="ایمیل سازمانی را وارد کنید"
                  label={"ایمیل سازمانی"}
                  className="bg-common-white"
                />
                <Input
                  name={"organizationId"}
                  formik={formik}
                  autoComplete={"organizationId"}
                  placeholder="شناسه ملی سازمان را وارد کنید"
                  label={"شناسه ملی سازمان"}
                  className="bg-common-white"
                />
                <Input
                  name={"company_economic_number"}
                  formik={formik}
                  autoComplete={"company_economic_number"}
                  placeholder="شماره اقتصادی سازمان را وارد کنید"
                  label={"شماره اقتصادی"}
                  className="bg-common-white"
                />
                <Input
                  name={"company_telephone"}
                  formik={formik}
                  autoComplete={"company_telephone"}
                  maxLength={11}
                  minLength={11}
                  placeholder="تلفن سازمان را وارد کنید"
                  label={"تلفن"}
                  type="number"
                  className="bg-common-white"
                />
                <Input
                  name={"postal_code"}
                  formik={formik}
                  autoComplete={"postal_code"}
                  placeholder="کدپستی سازمان را وارد کنید"
                  label={"کدپستی"}
                  type="number"
                  className="bg-common-white"
                />
                <Input
                  name={"address"}
                  formik={formik}
                  autoComplete={"address"}
                  placeholder="آدرس سازمان را وارد کنید"
                  label={"آدرس"}
                  className="bg-common-white"
                />
              </>
            )}

            <span className="col-span-2 md:col-span-1">
              <Select
                multiple
                name={"role"}
                formik={formik}
                options={isCustomer ? customerRolesList : positionOptions}
                label={"سمت"}
                placeholder={`سمت ${labelCustomerUser} خود را انتخاب کنید`}
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
                        `سمت ${labelCustomerUser} را انتخاب کنید`
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
              {!isCustomer &&
                formik.values.role.length === 1 &&
                (formik.values.role.includes("10") ||
                  formik.values.role.includes("15")) && (
                  <span className="text-[12px] text-error">
                    سمت نمی‌تواند فقط استاد باشد. (درصورتی‌که همکار موردنظر شما
                    فقط دارای سمت استاد است، باید ابتدا نقش او را به مشتری تغییر
                    داده و سپس سمت استاد را برای او ثبت نمایید.)
                  </span>
                )}
            </span>
            {isPersonalAccount && (
              <div className="col-span-2">
                <Input
                  name={"address"}
                  formik={formik}
                  autoComplete={"address"}
                  placeholder="آدرس را وارد کنید"
                  label={"آدرس"}
                  className="bg-common-white"
                />
              </div>
            )}
            {isCustomer && (
              <div className="pt-3">
                <Switch
                  checked={isPartner}
                  onChange={() => setIsPartner(!isPartner)}
                >
                  <span className="text-[13px] font-bold">مشتری همکار</span>
                </Switch>
              </div>
            )}
            {/* <Select
              multiple
              name={"access_level"}
              formik={formik}
              options={accessOptions}
              label={"سطح دسترسی"}
              resettable
              placeholder="سطح دسترسی را  مشخص کنید"
              holder={(activeItem, reset, deleteItem) => (
                <Card
                  variant={"outline"}
                  className={
                    "mt-2 flex w-full cursor-pointer items-center justify-between overflow-x-auto whitespace-nowrap px-2 py-2 text-sm"
                  }
                >
                  <span
                    className={
                      activeItem?.length === 0
                        ? "py-[2px] text-typography-secondary"
                        : "text-typography-main"
                    }
                  >
                    {activeItem?.length == 0 ? (
                      "سطح دسترسی را انتخاب کنید"
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
            </Select> */}
          </div>
          <Button
            className="mr-auto mt-[32px]"
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
            ذخیره تغییرات
          </Button>
        </div>
      )}
    </FormHandler>
  );
};

export default EditUserForm;
