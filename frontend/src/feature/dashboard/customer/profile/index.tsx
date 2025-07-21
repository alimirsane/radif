import { useEffect, useMemo, useRef, useState } from "react";
import * as yup from "yup";

import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Select } from "@kit/select";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { IcCheck, IcChevronDown } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import { apiEducationalField } from "@api/service/educational-field";
import { apiEducationalLevel } from "@api/service/educational-levels";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { apiDepartment } from "@api/service/department";
import { AccountType } from "@api/service/user/type/account-type";
import { useRouter } from "next/router";
import { routes } from "@data/routes";

export const Profile = () => {
  const router = useRouter();
  const { data: user, refetch } = useQuery({
    ...apiUser().me(),
  });
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data: educationFields } = useQuery(apiEducationalField().getAll());
  const { data: educationLevels } = useQuery(apiEducationalLevel().getAll());
  const { data: departments } = useQuery(apiDepartment().getAll());
  const [sharifEmailApproval, setSharifEmailApproval] = useState<
    boolean | undefined
  >(user?.data.is_sharif_student);
  useEffect(() => {
    setSharifEmailApproval(user?.data.is_sharif_student);
  }, [user]);
  const { mutateAsync } = useMutation(
    apiUser(true, {
      success: "ویرایش اطلاعات موفقیت آمیز بود",
      fail: "ویرایش اطلاعات انجام نشد",
      waiting: "در حال انتظار",
    }).updateMyprofile(),
  );

  const gradesList = useMemo(() => {
    let levels = educationLevels?.data.map((level) => {
      return {
        value: level.id.toString(),
        name: level.name,
      };
    });
    return levels?.length ? levels : [];
  }, [educationLevels?.data]);

  const fieldsList = useMemo(() => {
    let fields = educationFields?.data.map((field) => {
      return {
        value: field.id.toString(),
        name: field.name,
      };
    });
    return fields?.length ? fields : [];
  }, [educationFields?.data]);

  const departmentsList = useMemo(() => {
    let department = departments?.data.map((dep) => {
      return {
        value: dep.id.toString(),
        name: dep.name,
      };
    });
    return department?.length ? department : [];
  }, [departments?.data]);

  const initialValues = useMemo(() => {
    return {
      firstName: user?.data.first_name,
      lastName: user?.data.last_name,
      nationalCode: user?.data.national_id,
      mobile: user?.data.username,
      // passwordUser: user?.data.password,
      emailUser: user?.data.email,
      studentId: user?.data.student_id,
      grade: user?.data?.educational_level?.toString(),
      field: user?.data?.educational_field?.toString(),
      postalCode: user?.data.postal_code,
      address: user?.data.address,
      department: user?.data.department?.toString(),
      telephone: user?.data.telephone,
    };
  }, [user]);
  const signUpValidationSchema = useMemo(() => {
    return user?.data.account_type === "personal"
      ? yup.object({
          firstName: validation.persianInput,
          lastName: validation.persianInput,
          emailUser: sharifEmailApproval
            ? validation.sharifEmail
            : validation.email,
          // nationalCode: validation.nationalCode,
          // mobile: validation.mobile,
          // password: validation.password,
          // grade: validation.requiredInput,
          // field: validation.requiredInput,
          // studentId: validation.studentId,
          postalCode: validation.optionalPostalCode,
          telephone: validation.optionalPhone,
          department: sharifEmailApproval
            ? validation.requiredInput
            : yup.string().nullable(),
        })
      : yup.object({
          firstName: validation.persianInput,
          lastName: validation.persianInput,
        });
  }, [sharifEmailApproval, user]);

  useEffect(() => {
    if (sharifEmailApproval === undefined) return;
    inputRef.current?.focus();
    inputRef.current?.blur();
  }, [sharifEmailApproval]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <FormHandler
        validationSchema={signUpValidationSchema}
        initialValues={initialValues}
        handleSubmit={(values) => {
          let data: Pick<
            CurrentUserType,
            // | "password"
            | "first_name"
            | "last_name"
            | "email"
            | "student_id"
            | "educational_level"
            | "educational_field"
            | "postal_code"
            | "address"
            | "is_sharif_student"
            | "telephone"
            | "department"
          > = {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.emailUser,
            student_id: values.studentId,
            educational_level: Number(values.grade),
            educational_field: Number(values.field),
            postal_code: values.postalCode,
            address: values.address,
            is_sharif_student: sharifEmailApproval ? true : false,
            telephone: values.telephone,
            department: values.department
              ? Number(values.department)
              : undefined,
          };

          // if (values.passwordUser) {
          //   data.password = values.passwordUser;
          // }
          mutateAsync(data)
            .then((res) => {
              router.replace({
                pathname: router.asPath.includes(routes.operator())
                  ? routes.operator()
                  : routes.customer(),
              });
            })
            .catch((err) => {});
        }}
      >
        {(formik) => (
          <div className="mt-[12px] grid grid-cols-1 gap-6 text-right md:grid-cols-2">
            <div className="col-span-2 rounded-[8px] bg-secondary-light bg-opacity-30 p-4">
              <h6 className="font-bold">اطلاعات ضروری</h6>
              <p className="pt-1 text-[14px]">
                {user?.data.account_type === AccountType.PERSONAL
                  ? "این اطلاعات ضروری می‌باشد."
                  : "این اطلاعات مربوط به نماینده سازمان/شرکت می‌باشد."}
              </p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <Input
                name={"firstName"}
                formik={formik}
                autoComplete={"firstName"}
                placeholder="نام خود را وارد کنید"
                label={"نام"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"lastName"}
                formik={formik}
                autoComplete={"lastName"}
                placeholder="نام خانوادگی خود را وارد کنید"
                label={"نام خانوادگی"}
              />
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                // name={"nationalCode"}
                // formik={formik}
                value={
                  user?.data.account_type === AccountType.PERSONAL
                    ? user?.data.national_id
                    : !!user?.data?.linked_users_objs?.length
                      ? user?.data?.linked_users_objs?.[0]?.national_id
                      : ""
                }
                autoComplete={"nationalCode"}
                placeholder="کدملی خود را وارد کنید"
                label={"کد ملی"}
                maxLength={10}
                minLength={10}
                disabled
                className="bg-background-paper"
              />
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                // name={"mobile"}
                // formik={formik}
                value={
                  user?.data.account_type === AccountType.PERSONAL
                    ? user?.data.username
                      ? `0${user?.data.username.slice(3, user?.data.username.length)}`
                      : ""
                    : !!user?.data?.linked_users_objs?.length &&
                        user?.data?.linked_users_objs[0]?.username
                      ? `0${user?.data?.linked_users_objs[0]?.username.slice(3, user?.data?.linked_users_objs[0].username.length)}`
                      : ""
                }
                maxLength={11}
                minLength={11}
                placeholder="شماره همراه خود را وارد کنید"
                label={"شماره همراه"}
                type="number"
                disabled
                className="bg-background-paper"
              />
            </div>
            {/* <div className="col-span-2 md:col-span-1">
              <Input
                name={"passwordUser"}
                formik={formik}
                type={"password"}
                placeholder="رمز عبور خود را وارد کنید"
                label={"رمز عبور"}
                passwordHandler
              />
            </div> */}
            {user?.data.account_type === "personal" ? (
              <>
                <div className="col-span-2 md:col-span-1">
                  <Input
                    name={"emailUser"}
                    autoComplete={"emailUser"}
                    formik={formik}
                    placeholder="ایمیل خود را وارد کنید"
                    label={"ایمیل"}
                    ref={inputRef}
                  />
                  <div className="pt-3">
                    <input
                      checked={sharifEmailApproval}
                      type="checkbox"
                      id="sharifEmailApproval"
                      onChange={() => {
                        setSharifEmailApproval(!sharifEmailApproval);
                      }}
                      name="sharifEmailApproval"
                      className={`accent-black h-3 w-3`}
                    ></input>
                    <label
                      htmlFor="sharifEmailApproval"
                      className={`pr-2 text-[14px] font-medium`}
                    >
                      استاد یا دانشجوی دانشگاه صنعتی شریف هستم.
                      <p className="pr-5 text-[12px]">
                        * برای استفاده از تخفیف‌ها، وارد کردن ایمیل دانشگاهی
                        شریف الزامیست.
                      </p>
                    </label>
                  </div>
                </div>
                <div className={`col-span-2 md:col-span-1`}>
                  <Input
                    name={"telephone"}
                    formik={formik}
                    autoComplete={"telephone"}
                    maxLength={11}
                    minLength={11}
                    placeholder="تلفن خود را وارد کنید"
                    label={"تلفن"}
                    type="number"
                  />
                </div>
                {sharifEmailApproval && (
                  <div className="col-span-2 md:col-span-1">
                    <Select
                      options={departmentsList}
                      label={"دانشکده"}
                      name={"department"}
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
                <div className="col-span-2 mt-3 rounded-[8px] bg-secondary-light bg-opacity-30 p-4">
                  <h6 className="font-bold">اطلاعات اختیاری</h6>
                  <p className="pt-1 text-[14px]">
                    با تکمیل این اطلاعات، به ما در ارائه خدمات بهتر کمک می‌کنید.
                  </p>
                </div>

                <div className={`col-span-2 md:col-span-1`}>
                  <Input
                    name={"studentId"}
                    formik={formik}
                    autoComplete={"studentId"}
                    placeholder="شماره دانشجویی خود را وارد کنید"
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
                <div className="col-span-2 md:col-span-1">
                  <Select
                    options={gradesList}
                    name={"grade"}
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
                          {activeItem?.name ?? "مقطع تحصیلی خود را وارد کنید"}
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

                <div className="col-span-2 md:col-span-1">
                  <Select
                    options={fieldsList}
                    name={"field"}
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
                          {activeItem?.name ?? "رشته تحصیلی خود را وارد کنید"}
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
                </div>

                <div className={`col-span-2 md:col-span-1`}>
                  <Input
                    name={"postalCode"}
                    formik={formik}
                    autoComplete={"postalCode"}
                    placeholder="کدپستی خود را وارد کنید"
                    label={"کدپستی"}
                    type="number"
                  />
                </div>

                <div className={`col-span-2`}>
                  <Input
                    name={"address"}
                    formik={formik}
                    autoComplete={"address"}
                    placeholder="آدرس خود را وارد کنید"
                    label={"آدرس"}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="col-span-2 my-2 rounded-[8px] bg-secondary-light bg-opacity-30 p-4">
                  <h6 className="font-bold">اطلاعات سازمان/شرکت</h6>
                  <p className="pt-1 text-[14px]">
                    این اطلاعات مربوط به سازمان/شرکت شما می‌باشد.
                  </p>
                </div>
                <div className={`col-span-2 md:col-span-1`}>
                  <Input
                    value={user?.data.company_name}
                    placeholder="نام سازمان را وارد کنید"
                    label={"نام سازمان"}
                    disabled
                    className="bg-background-paper"
                  />
                </div>
                <div className={`col-span-2 md:col-span-1`}>
                  <Input
                    value={user?.data.email}
                    placeholder="ایمیل سازمانی را وارد کنید"
                    label={"ایمیل سازمانی"}
                    disabled
                    className="bg-background-paper"
                  />
                </div>
                <div className={`col-span-2 md:col-span-1`}>
                  <Input
                    value={user?.data.company_national_id}
                    placeholder="شناسه ملی سازمان را وارد کنید"
                    label={"شناسه ملی سازمان"}
                    disabled
                    className="bg-background-paper"
                  />
                </div>
                <div className={`col-span-2 md:col-span-1`}>
                  <Input
                    value={user?.data.company_economic_number}
                    placeholder="شماره اقتصادی سازمان را وارد کنید"
                    label={"شماره اقتصادی"}
                    disabled
                    className="bg-background-paper"
                  />
                </div>
                <div className={`col-span-2 md:col-span-1`}>
                  <Input
                    value={user?.data.company_telephone}
                    placeholder="تلفن سازمان را وارد کنید"
                    label={"تلفن"}
                    disabled
                    className="bg-background-paper"
                  />
                </div>
                <div className={`col-span-2 md:col-span-1`}>
                  <Input
                    value={user?.data.postal_code}
                    placeholder="کدپستی سازمان را وارد کنید"
                    label={"کدپستی"}
                    disabled
                    className="bg-background-paper"
                  />
                </div>
                <div className={`col-span-2`}>
                  <Input
                    value={user?.data.address}
                    placeholder="آدرس سازمان را وارد کنید"
                    label={"آدرس"}
                    disabled
                    className="bg-background-paper"
                  />
                </div>
              </>
            )}
            <div className="col-span-2 mb-[80px] mt-2 flex justify-end">
              <Button
                type="submit"
                disabled={!formik.isValid}
                startIcon={
                  <SvgIcon
                    strokeColor="white"
                    className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
                  >
                    <IcCheck />
                  </SvgIcon>
                }
              >
                ثبت اطلاعات
              </Button>
            </div>
          </div>
        )}
      </FormHandler>
    </>
  );
};
