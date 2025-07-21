import { useMemo } from "react";
import Link from "next/link";
import * as yup from "yup";
import { Button } from "@kit/button";
import { Input } from "@kit/input";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { routes } from "@data/routes";
import { useMutation } from "@tanstack/react-query";
import { apiAuth } from "@api/service/auth";
import { UserType } from "@api/service/user/type/user-type";
import { useSignInService } from "@hook/sign-in-service";
import { Checkbox } from "@kit/checkbox";
import { AccountType } from "@api/service/user/type/account-type";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

export const LegalType = () => {
  const { mutateAsync: signUp } = useMutation(
    apiAuth(
      false,
      //   true, {
      //   success: "ثبت نام شما موفقیت آمیز بود",
      //   waiting: "در حال انتظار",
      // }
    ).businessSignUp(),
  );

  const signIn = useSignInService();

  const initialValues = useMemo(() => {
    return {
      firstName: "",
      lastName: "",
      nationalCode: "",
      mobile: "",
      companyName: "",
      organizationEmail: "",
      organizationId: "",
      postalCode: "",
      phone: "",
      address: "",
      password: "",
      approvalRules: false,
      company_economic_number: "",
    };
  }, []);

  const signUpValidationSchema = useMemo(() => {
    return yup.object({
      firstName: validation.persianInput,
      lastName: validation.persianInput,
      nationalCode: validation.nationalCode,
      mobile: validation.mobile,
      companyName: validation.requiredInput,
      organizationEmail: validation.email,
      organizationId: validation.requiredInput,
      postalCode: validation.optionalPostalCode,
      phone: validation.optionalPhone,
      address: validation.requiredInput,
      password: validation.password,
      approvalRules: validation.checkboxInput,
      company_economic_number: validation.requiredInput,
    });
  }, []);

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
            account_type: AccountType.BUSINESS,
            user_type: UserType.CUSTOMER,
            address: values.address,
            email: values.organizationEmail,
            first_name: values.firstName,
            last_name: values.lastName,
            company_name: values.companyName,
            company_national_id: values.organizationId,
            company_telephone: values.phone,
            username: `+98${values.mobile.slice(1, 11)}`,
            national_id: values.nationalCode,
            postal_code: values.postalCode,
            password: values.password,
            company_economic_number: values.company_economic_number,
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
              <h6 className="font-bold">اطلاعات سازمان/شرکت</h6>
              <p className="pt-1 text-[14px]">
                اگر نماینده سازمان یا شرکت هستید از این قسمت ثبت نام کنید.
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"companyName"}
                formik={formik}
                autoComplete={"companyName"}
                placeholder="نام سازمان را وارد کنید"
                label={"نام سازمان"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"organizationEmail"}
                formik={formik}
                autoComplete={"organizationEmail"}
                placeholder="ایمیل سازمانی را وارد کنید"
                label={"ایمیل سازمانی"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"organizationId"}
                formik={formik}
                autoComplete={"organizationId"}
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
                name={"phone"}
                formik={formik}
                autoComplete={"phone"}
                maxLength={11}
                minLength={11}
                placeholder="تلفن سازمان را وارد کنید. مثال: 02166778800"
                label={"تلفن"}
                type="number"
              />
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"postalCode"}
                formik={formik}
                autoComplete={"postalCode"}
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
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"password"}
                formik={formik}
                autoComplete={"password"}
                placeholder="رمز عبور خود را وارد کنید"
                label="رمز عبور (حداقل 5 کاراکتر)"
                // label={
                //   <span>
                //     رمز عبور
                //     <span className="px-1 text-[12px] text-common-gray">
                //       (حداقل 5 کاراکتر)
                //     </span>
                //   </span>
                // }
                type="password"
                passwordHandler
              />
            </div>
            <div className="col-span-2 ">
              <Checkbox
                formik={formik}
                name={"approvalRules"}
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
