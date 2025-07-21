import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as yup from "yup";

import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Select } from "@kit/select";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { routes } from "../../../../../data/routes";
import { IcChevronDown } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiAuth } from "@api/service/auth";
import { UserType } from "@api/service/user/type/user-type";
import { useSignInService } from "../../../../../hook/sign-in-service";
import { apiEducationalLevel } from "@api/service/educational-levels";
import { apiEducationalField } from "@api/service/educational-field";
import { apiDepartment } from "@api/service/department";
import { AccountType } from "@api/service/user/type/account-type";
import { Checkbox } from "@kit/checkbox";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

export const NaturalType = () => {
  const { mutateAsync: signUp } = useMutation(
    apiAuth(
      false,
      //   true, {
      //   success: "ثبت نام شما موفقیت آمیز بود",
      //   waiting: "در حال انتظار",
      // }
    ).personalSignUp(),
  );
  const [sharifEmailApproval, setSharifEmailApproval] = useState<
    boolean | undefined
  >(undefined);

  const signIn = useSignInService();

  const { data: educationFields } = useQuery(apiEducationalField().getAll());
  const { data: educationLevels } = useQuery(apiEducationalLevel().getAll());
  const { data: departments } = useQuery(apiDepartment().getAll());
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
      firstName: "",
      lastName: "",
      nationalCode: "",
      mobile: "",
      password: "",
      email: "",
      studentId: "",
      grade: "",
      field: "",
      postalCode: "",
      rulesApproval: false,
      telephone: "",
      department: "",
      sharifUserDepartment: undefined,
      address: "",
    };
  }, []);
  const signUpValidationSchema = useMemo(() => {
    const schemaFields: Record<string, yup.AnySchema> = {
      firstName: validation.persianInput,
      lastName: validation.persianInput,
      nationalCode: validation.nationalCode,
      mobile: validation.mobile,
      password: validation.password,
      email: sharifEmailApproval ? validation.sharifEmail : validation.email,
      rulesApproval: validation.checkboxInput,
      postalCode: validation.optionalPostalCode,
      telephone: validation.optionalPhone,
      // grade: validation.requiredInput,
      // field: validation.requiredInput,
      // studentId: validation.studentId,
      // department: sharifEmailApproval
      //   ? validation.requiredInput
      //   : yup.string().nullable(),
    };

    if (sharifEmailApproval) {
      schemaFields.sharifUserDepartment = validation.requiredInput;
    }

    return yup.object(schemaFields);
  }, [sharifEmailApproval]);

  useEffect(() => {
    if (sharifEmailApproval === undefined) return;
    inputRef.current?.focus();
    inputRef.current?.blur();
  }, [sharifEmailApproval]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openModal = useModalHandler((state) => state.openModal);

  const rulesLabel = useMemo(() => {
    return (
      <span className="pr-1 text-[14px] font-medium">
        ثبت نام شما به معنای پذیرش{" "}
        <span
          className="cursor-pointer text-[15px] font-semibold italic underline underline-offset-4"
          onClick={() => openModal(ModalKeys.SIGN_UP_RULES)}
        >
          شرایط استفاده از خدمات و سیاست حفظ حریم خصوصی
        </span>{" "}
        است.
      </span>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormHandler
        validationSchema={signUpValidationSchema}
        initialValues={initialValues}
        handleSubmit={(values, utils) => {
          signUp({
            account_type: AccountType.PERSONAL,
            user_type: UserType.CUSTOMER,
            email: values.email,
            first_name: values.firstName,
            last_name: values.lastName,
            username: `+98${values.mobile.slice(1, 11)}`,
            national_id: values.nationalCode,
            postal_code: values.postalCode,
            address: values.address,
            password: values.password,
            is_sharif_student: sharifEmailApproval ? true : false,
            student_id: !!values.studentId.length
              ? values.studentId
              : undefined,
            educational_level: values.grade ? Number(values.grade) : undefined,
            educational_field: values.field ? Number(values.field) : undefined,
            telephone: values.telephone,
            department: sharifEmailApproval
              ? values.sharifUserDepartment
                ? Number(values.sharifUserDepartment)
                : undefined
              : values.department
                ? Number(values.department)
                : undefined,
          })
            .then(() => {
              signIn(values.mobile, values.password);
            })
            .catch(() => {});
        }}
      >
        {(formik) => (
          <div className="grid grid-cols-1 gap-6 pb-3 text-right md:grid-cols-2">
            <div className="col-span-2 rounded-[8px] bg-secondary-light bg-opacity-30 p-4">
              <h6 className="font-bold">اطلاعات ضروری</h6>
              <p className="pt-1 text-[14px]">
                این اطلاعات برای ثبت نام ضروری می‌باشد.
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
                name={"nationalCode"}
                formik={formik}
                autoComplete={"nationalCode"}
                placeholder="کدملی خود را وارد کنید"
                label={"کد ملی"}
                maxLength={10}
                minLength={10}
                // type="number"
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
                placeholder="ایمیل خود را وارد کنید"
                label={"ایمیل"}
                ref={inputRef}
              />

              <div className="col-span-2 pt-3">
                <input
                  type="checkbox"
                  id="sharifEmailApproval"
                  onChange={() => {
                    setSharifEmailApproval(!sharifEmailApproval);
                  }}
                  name="sharifEmailApproval"
                  className={`accent-black h-3 w-3 `}
                ></input>
                <label
                  htmlFor="sharifEmailApproval"
                  className={`pr-2 text-[12px] font-medium`}
                >
                  استاد یا دانشجوی دانشگاه صنعتی شریف هستم.
                  <p className="pr-5 text-[11px] font-normal text-common-gray">
                    * برای استفاده از تخفیف‌ها، وارد کردن ایمیل دانشگاهی شریف
                    الزامیست.
                  </p>
                </label>
              </div>
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"mobile"}
                formik={formik}
                autoComplete={"mobile"}
                maxLength={11}
                minLength={11}
                placeholder="شماره همراه خود را وارد کنید"
                label={"شماره همراه"}
                type="number"
              />
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
                        {activeItem?.name ?? "دانشکده خود را انتخاب کنید"}
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
                        {activeItem?.name ?? "دانشکده خود را انتخاب کنید"}
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
                      {activeItem?.name ?? "مقطع تحصیلی خود را انتخاب کنید"}
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
                      {activeItem?.name ?? "رشته تحصیلی خود را انتخاب کنید"}
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
                placeholder="تلفن خود را وارد کنید. مثال: 02166778800"
                label={"تلفن"}
                type="number"
              />
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

            <div className="col-span-2">
              <Input
                name={"address"}
                formik={formik}
                autoComplete={"address"}
                placeholder="آدرس خود را وارد کنید"
                label={"آدرس"}
              />
            </div>
            <div className="col-span-2 ">
              {/* <input
                type="checkbox"
                id="rulesApproval"
                onChange={() =>
                  formik.setFieldValue(
                    "rulesApproval",
                    !formik.values.rulesApproval,
                  )
                }
                name="rulesApproval"
                className={`accent-black h-3 w-3 `}
              ></input>
              <label
                htmlFor="rulesApproval"
                className={`pr-2 text-[15px] font-medium ${!formik.isValid && !formik.values.rulesApproval && "text-error"}`}
              >
                ثبت نام شما به معنای پذیرش شرایط استفاده از خدمات و سیاست حفظ
                حریم خصوصی است.
              </label> */}
              <Checkbox
                formik={formik}
                name={"rulesApproval"}
                label={rulesLabel}
              />
            </div>
            <div className="col-span-2 justify-self-center pt-1">
              <Button
                type="submit"
                variant="solid"
                color="primary"
                disabled={!formik.isValid}
              >
                ثبت نام در سامانه
              </Button>
            </div>
          </div>
        )}
      </FormHandler>
    </>
  );
};
