import React, { useMemo } from "react";
import Image from "next/image";
import logo from "/public/images/logo.png";
import NACI from "/public/images/naci-logo.png";
import { DateHandler } from "@utils/date-handler";
import { AccountType } from "@api/service/user/type/account-type";
import {
  CertificateObjType,
  RequestType,
  RequestTypeForm,
} from "@api/service/request/type";

export const CertificatePrint = (props: {
  request: RequestType | undefined;
  certifiateData: CertificateObjType | undefined;
}) => {
  const { request, certifiateData } = props;
  // samples and their copies
  const samplesFlattenedForms = useMemo(() => {
    // Recursive function to flatten forms
    const flattenForm = (
      form: RequestTypeForm,
    ): Pick<RequestTypeForm, "id" | "form_number">[] => {
      // Flatten the current form and its children
      const currentForm = {
        id: form.id,
        form_number: form.form_number,
      };
      const childrenForms = form.children?.flatMap(flattenForm) || [];
      // Return the current form along with all its flattened children
      return [currentForm, ...childrenForms];
    };
    // Flatten all the forms in the samples array
    return request?.forms?.flatMap(flattenForm) || [];
  }, [request]);
  return (
    <>
      {request?.parameter_obj?.map((parameter, index) => (
        <div
          key={index}
          className="no-padding page-break hidden w-full text-[9px]"
          id="print-certificate"
        >
          {/* section-1 */}
          <div className="grid grid-cols-3 items-center pb-3">
            <div className="flex flex-row gap-2">
              <div className={"flex flex-col"}>
                <div
                  className={
                    "back-primary-dark m-1 flex h-fit w-fit rounded-[50%]"
                  }
                >
                  <Image
                    src={logo}
                    width={400}
                    height={400}
                    className="w-[52px]"
                    alt="دانشگاه شریف"
                    loading="eager"
                  />
                </div>
                <span
                  className={
                    "flex flex-col text-[5px] font-bold text-primary-dark"
                  }
                >
                  <span className="px-1">معاونت پژوهش و فناوری</span>
                  <span className="text-[6px]">مرکز خدمات آزمایشگاهی</span>
                </span>
              </div>
              {certifiateData?.experiment_obj?.laboratory_obj?.has_iso_17025 &&
                certifiateData?.experiment_obj?.laboratory_obj
                  ?.is_visible_iso && (
                  <div className={"flex flex-col pt-[1px]"}>
                    <Image
                      src={NACI}
                      width={400}
                      height={400}
                      className="w-[80px]"
                      alt="مرکز ملی تایید صلاحیت ایران"
                      loading="eager"
                    />
                  </div>
                )}
            </div>
            <span className="text-center text-[14px] font-bold">
              گواهینامه آزمون
            </span>
            <div className="flex justify-end">
              <div className="w-[55%]">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-start">شماره گواهینامه:</span>
                  <span className="text-end">
                    {certifiateData?.request_number}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-start">تاریخ صدور:</span>
                  <span className="text-end">
                    {request?.result_objs
                      ? DateHandler.formatDate(
                          request?.result_objs[0]?.created_at,
                          {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          },
                        )
                      : DateHandler.formatDate(Date.now(), {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                    {/* {DateHandler.formatDate(Date.now(), {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })} */}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-start">پیوست:</span>
                  <span className="text-end">دارد</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-start">صفحه:</span>
                  <span className="text-end">
                    {index + 1} از {certifiateData?.parameter_obj?.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* section-2 */}
          <div className="mt-[8px] flex w-full flex-row border-[1px] font-medium">
            <span className="back-gray w-[23%] border-l-[1px] py-2 text-center">
              مشخصات آزمایشگاه
            </span>
          </div>
          <div className="flex border-[1px] border-t-0 font-medium">
            <div className="w-[46%] border-l-[1px] px-1 py-[8px]">
              نام:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.name}`}
            </div>
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              شماره اقتصادی:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.economic_number ?? "---"}`}
            </div>
            <div className="w-[31%] px-1 py-[8px]">
              شناسه ملی/شماره ثبت:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.national_id ?? "---"}`}
            </div>
          </div>
          <div className="flex border-[1px] border-t-0 font-medium">
            <div className="w-full px-1 py-[8px]">
              نشانی کامل:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.address ?? "---"}`}
            </div>
          </div>
          <div className="flex border-[1px] border-t-0 font-medium">
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              کدپستی:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.postal_code ?? "---"}`}
            </div>
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              تلفن:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.telephone1 ?? "---"}`}
            </div>
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              دورنگار:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.fax ?? "---"}`}
            </div>
            <div className="w-[31%] px-1 py-[8px]">
              ایمیل:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.email ?? "---"}`}
            </div>
          </div>

          {/* section-3 */}
          <div className="flex w-full flex-row border-[1px] border-t-0 font-medium">
            <span className="back-gray w-[23%] border-l-[1px] py-2 text-center">
              مشخصات متقاضی
            </span>
          </div>
          <div className="flex border-[1px] border-t-0 font-medium">
            <div className="w-[46%] border-l-[1px] px-1 py-[8px]">
              {certifiateData?.owner_obj?.account_type === AccountType.BUSINESS
                ? "نام سازمان حقوقی"
                : "نام شخص"}
              :
              {certifiateData?.owner_obj &&
              certifiateData?.owner_obj?.account_type === AccountType.BUSINESS
                ? ` ${certifiateData?.owner_obj?.company_name}`
                : ` ${certifiateData?.owner_obj?.first_name} ${certifiateData?.owner_obj?.last_name}`}
            </div>
            {certifiateData?.owner_obj?.account_type ===
              AccountType.BUSINESS && (
              <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
                شماره اقتصادی:{" "}
                {certifiateData?.owner_obj?.company_economic_number ?? " ---"}
              </div>
            )}
            <div className="w-[31%] px-1 py-[8px]">
              {certifiateData?.owner_obj?.account_type === AccountType.BUSINESS
                ? "شناسه ملی: "
                : "کد ملی: "}
              {certifiateData?.owner_obj?.account_type === AccountType.BUSINESS
                ? ` ${certifiateData?.owner_obj?.company_national_id}`
                : ` ${certifiateData?.owner_obj?.national_id}`}
            </div>
          </div>
          <div className="flex border-[1px] border-t-0 font-medium">
            <div
              className={`w-[69%] px-1 py-[8px] ${
                certifiateData?.owner_obj?.account_type === AccountType.BUSINESS
                  ? "border-l-[1px]"
                  : ""
              }`}
            >
              نشانی کامل:{` ${certifiateData?.owner_obj?.address ?? " ---"}`}
            </div>
            {certifiateData?.owner_obj?.account_type ===
              AccountType.BUSINESS && (
              <div className="w-[31%] px-1 py-[8px]">
                نام نماینده سازمان:
                {` ${certifiateData?.owner_obj?.first_name} ${certifiateData?.owner_obj?.last_name}`}
              </div>
            )}
          </div>
          <div className="flex border-[1px] border-t-0 font-medium">
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              کدپستی:{` ${certifiateData?.owner_obj?.postal_code ?? " ---"}`}
            </div>
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              ایمیل:{` ${certifiateData?.owner_obj?.email}`}
            </div>
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              تلفن:
              {certifiateData?.owner_obj?.account_type === AccountType.BUSINESS
                ? ` ${certifiateData?.owner_obj?.company_telephone}`
                : certifiateData?.owner_obj?.telephone
                  ? ` ${certifiateData?.owner_obj?.telephone}`
                  : " ---"}
            </div>
            <div className="w-[22%] px-1 py-[8px]">
              شماره همراه:
              {certifiateData?.owner_obj?.account_type === AccountType.BUSINESS
                ? !!certifiateData?.owner_obj?.linked_users_objs?.length &&
                  certifiateData?.owner_obj?.linked_users_objs[0]?.username
                  ? ` 0${certifiateData?.owner_obj?.linked_users_objs[0]?.username.slice(3)}`
                  : " ---"
                : ` 0${certifiateData?.owner_obj?.username?.slice(3)}`}
            </div>
            {/* <div className="w-[9%] px-1 py-[8px]">دورنگار: ---</div> */}
          </div>

          {/* section-4 */}
          <div className="flex w-full flex-row border-[1px] border-t-0 font-medium">
            <span className="back-gray w-[23%] border-l-[1px] py-2 text-center">
              مشخصات درخواست
            </span>
          </div>
          <div className="flex border-[1px] border-t-0 font-medium">
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              شماره درخواست:
              {` ${certifiateData?.request_number?.split("-")?.[1]}-${certifiateData?.request_number?.split("-")?.[0]}`}
            </div>
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              تاریخ درخواست:
              {` ${
                certifiateData?.created_at
                  ? DateHandler.formatDate(certifiateData?.created_at, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "---"
              }`}
            </div>
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              تاریخ دریافت نمونه:
              {request?.delivery_date
                ? ` ${DateHandler.formatDate(request?.delivery_date, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}`
                : "---"}
            </div>
            <div className="w-[31%] px-1 py-[8px]">
              تاریخ انجام آزمون:
              {request?.result_objs
                ? ` ${DateHandler.formatDate(
                    request?.result_objs[0]?.created_at,
                    {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    },
                  )}`
                : "---"}
            </div>
          </div>
          <div className="flex border-[1px] border-t-0 font-medium">
            <div className="w-[46%] border-l-[1px] px-1 py-[8px]">
              نام آزمون:
              {` ${certifiateData?.experiment_obj?.name}`}
            </div>
            <div className="w-[54%] px-1 py-[8px]">
              استاندارد/روش اجرایی: ---
              {/* تاریخ دریافت نمونه:
              {` ${
                certifiateData?.dates?.sample_date
                  ? DateHandler.formatDate(certifiateData.dates.sample_date, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "---"
              }`} */}
            </div>
          </div>
          {/* <div className="flex border-[1px] border-t-0 font-medium">
            <div className="w-full px-1 py-[8px]">
              استاندارد/روش اجرایی: ---
            </div>
          </div> */}
          {/* <div className="flex border-[1px] border-t-0 font-medium">
            <div className="w-[69%] border-l-[1px] px-1 py-[8px]">
              نام آزمایشگاه:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.name} (${certifiateData?.experiment_obj?.laboratory_obj?.name_en})`}
            </div>
            <div className="w-[31%] px-1 py-[8px]">
              تاریخ انجام آزمون:
              {` ${
                certifiateData?.dates?.result_date
                  ? DateHandler.formatDate(certifiateData.dates.result_date, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "---"
              }`}
            </div>
          </div> */}

          {/* section-5 */}
          <div className="flex w-full flex-row border-[1px] border-t-0 font-medium">
            <span className="back-gray w-[23%] border-l-[1px] py-2 text-center">
              مشخصات مرجع مورد استفاده
            </span>
          </div>
          <div className="flex border-[1px] border-t-0 font-medium">
            <div className="w-[46%] border-l-[1px] px-1 py-[8px]">
              نام دستگاه:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.device_objs ? certifiateData?.experiment_obj?.laboratory_obj?.device_objs[0]?.name : "---"}`}
            </div>
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              کد دستگاه:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.device_objs ? certifiateData?.experiment_obj?.laboratory_obj?.device_objs[0]?.serial_number : "---"}`}
            </div>
            <div className="w-[31%] px-1 py-[8px]">
              دقت دستگاه:
              {` ${certifiateData?.experiment_obj?.laboratory_obj?.device_objs ? certifiateData?.experiment_obj?.laboratory_obj?.device_objs[0]?.accuracy ?? "" : "---"}`}
            </div>
          </div>

          {/* section-6 */}
          <div className="flex w-full flex-row border-[1px] border-t-0 font-medium">
            <span className="back-gray w-[23%] border-l-[1px] py-2 text-center">
              شرایط محیطی
            </span>
          </div>
          <div className="flex border-[1px] border-t-0 font-medium">
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              دما:{" "}
              <span dir="ltr">
                {certifiateData?.certificate_obj?.temperature != null
                  ? `${certifiateData.certificate_obj.temperature}°C`
                  : "---"}
              </span>
            </div>
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              رطوبت:{" "}
              <span dir="ltr">
                {certifiateData?.certificate_obj?.humidity != null
                  ? `${certifiateData.certificate_obj.humidity}% RH`
                  : "---"}
              </span>
            </div>
            <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
              فشار:{" "}
              <span dir="ltr">
                {certifiateData?.certificate_obj?.pressure != null
                  ? `${certifiateData.certificate_obj.pressure} atm`
                  : "---"}
              </span>
            </div>
            <div className="w-[31%] px-1 py-[8px]">
              غیره:
              {/* {` ${certifiateData?.experiment_obj?.work_scope}`} */}
            </div>
          </div>

          {/* section-7 */}
          <div className="flex w-full flex-row border-[1px] border-t-0 font-medium">
            <span className="back-gray w-[23%] border-l-[1px] py-2 text-center">
              نتایج آزمون
            </span>
          </div>
          <div className="flex border-[1px] border-t-0 font-medium">
            <div className="back-gray w-[3%] border-l-[1px] px-1 py-[8px]">
              ردیف
            </div>
            <div className="back-gray w-[20%] border-l-[1px] px-1 py-[8px]">
              پارامتر مورد آزمون
            </div>
            <div className="back-gray w-[23%] border-l-[1px] px-1 py-[8px]">
              کد نمونه
            </div>
            <div className="back-gray w-[23%] border-l-[1px] px-1 py-[8px]">
              عدم قطعیت
            </div>
            <div className="back-gray w-[31%] px-1 py-[8px]">توضیحات:</div>
          </div>
          {samplesFlattenedForms?.map((sample, index) => (
            <div
              key={index}
              className="flex border-[1px] border-t-0 font-medium"
            >
              <div className="w-[3%] border-l-[1px] px-1 py-[8px]">
                {index + 1}
              </div>
              <div className="w-[20%] border-l-[1px] px-1 py-[8px]">
                {parameter.name}
              </div>
              <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
                {sample.form_number}
              </div>
              <div className="w-[23%] border-l-[1px] px-1 py-[8px]">
                {certifiateData?.certificate_obj?.uncertainty ?? "---"}
              </div>
              <div className="w-[31%] px-1 py-[8px]">
                {request?.result_objs
                  ? request?.result_objs[0]?.description
                  : "---"}
                {/* نتیجه آزمون پیوست شده است. */}
              </div>
            </div>
          ))}
          {/* section-8 */}
          <div className="page-break-inside flex border-[1px] border-t-0 font-medium">
            <div className="w-[23%] border-l-[1px] px-1 pb-10 pt-[8px]">
              <p>
                کارشناس آزمایشگاه:
                {/* {certifiateData?.experiment_obj?.laboratory_obj?.operator_obj
                  ? ` ${certifiateData?.experiment_obj?.laboratory_obj?.operator_obj?.first_name} ${certifiateData?.experiment_obj?.laboratory_obj?.operator_obj?.last_name}`
                  : ""} */}
                {request?.result_objs && request?.result_objs[0]?.result_by_obj
                  ? ` ${request?.result_objs[0]?.result_by_obj?.first_name} ${request?.result_objs[0]?.result_by_obj?.last_name}`
                  : ""}
              </p>
              {/* <p className="pb-10 pt-1">نام و نام خانوادگی - امضا</p> */}
            </div>
            <div className="w-[23%] border-l-[1px] px-1 pb-10 pt-[8px]">
              <p>
                مدیر فنی:
                {certifiateData?.experiment_obj?.laboratory_obj
                  ?.technical_manager_obj
                  ? ` ${certifiateData?.experiment_obj?.laboratory_obj?.technical_manager_obj?.first_name} ${certifiateData?.experiment_obj?.laboratory_obj?.technical_manager_obj?.last_name}`
                  : ""}
              </p>
              {/* <p className="pb-10 pt-1">نام و نام خانوادگی - امضا</p> */}
            </div>
            <div className="w-[23%] border-l-[1px] px-1 pb-10 pt-[8px]">
              <p>مدیر مرکز خدمات آزمایشگاهی:</p>
              <p className="pt-1">مجتبی تقی پور</p>
              {/* <p className="pb-10 pt-1">نام و نام خانوادگی - امضا</p> */}
            </div>
            <div className="w-[31%] px-1 py-[8px]">مهر آزمایشگاه</div>
          </div>

          {/* section-9 */}
          <div className="py-[8px] font-medium">
            <div className="flex flex-row justify-between pb-[6px]">
              <span>نتایج آزمون طبق جدول پیوست</span>
              <span
                className="text-[10px]"
                style={{
                  fontFamily: "monospace",
                  direction: "ltr",
                  unicodeBidi: "plaintext",
                }}
              >
                {"CLDCFR94040R00"}
              </span>
            </div>
            <p className="pb-[6px]">توضیحات ضروری:</p>
            <p className="pb-[6px]">
              در آزمایشگاه‌های مرکز خدمات آزمایشگاهی دانشگاه صنعتی شریف باتوجه
              به مولفه‌های موثر در نتایح آزمون عدم قطعیت با ضریف K=۲ یا سطح
              اطمینان ۹۵٪ محاسبه گردیده است.
            </p>
            <div className="flex flex-row justify-between pb-[6px] font-medium">
              <span>
                این سند بدون مهر و امضاء مرکز خدمات آزمایشگاهی فاقد اعتبار است.
              </span>
              <span className="underline">
                هرگونه کپی برداری بدون کسب مجوز از خدمات آزمایشگاهی غیرمجاز است.
              </span>
            </div>
            <p className="pb-[6px]">
              باقیمتنده نمونه‌های مورد آزمون با توافق مشتری حداکثر به مدت ۳۰ روز
              نگهداری خواهد شد.
            </p>
            <p className="underline">
              لطفا درصورت وجود هرگونه ابهام در محتوای گزارش و یا نیاز به کسب
              اطلاعات بیشتر با مرکز خدمات آزمایشگاهی تماس حاصل فرمایید.
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
