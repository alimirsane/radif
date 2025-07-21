import { ResultType } from "@api/service/payment-record/type";
import { DateHandler } from "@utils/date-handler";
import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import logo from "/public/images/logo.png";
import logo_print from "/public/images/logo-print.png";
import { RequestType, RequestTypeForm } from "@api/service/request/type";
import { AccountType } from "@api/service/user/type/account-type";
import { ParameterType } from "@api/service/parameter/type";

interface TransactionPrintProps {
  transaction?: ResultType;
  role: "customer" | "operator";
}

export const TransactionPrint = (props: TransactionPrintProps) => {
  const { transaction, role } = props;

  const laboratory = useMemo(() => {
    return transaction?.request_obj?.experiment_obj?.laboratory_obj;
  }, [transaction]);

  let rowIndex = useMemo(() => {
    return 1;
  }, []);

  // calculate count of samples and copies
  const getSamplesFlattenedForms = useCallback((forms: any) => {
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
    return forms.flatMap(flattenForm) || [];
  }, []);
  // calculate total price of children before discount
  const totalPrice = useMemo(() => {
    return transaction?.request_obj?.child_requests
      ?.filter((child) => child?.latest_status_obj?.step_obj?.name !== "رد شده")
      ?.reduce((sum, child) => {
        return (
          sum +
          (child?.parameter_obj?.reduce((paramSum, parameter) => {
            const unitPrice = child.is_urgent
              ? parseInt(parameter?.urgent_price ?? "0", 10)
              : child?.owner_obj?.is_partner
                ? parameter?.partner_price === null
                  ? parseInt(parameter?.price, 10)
                  : parseInt(parameter?.partner_price, 10)
                : parseInt(parameter?.price, 10);

            const quantity =
              getSamplesFlattenedForms(child?.forms)?.length ?? 1;

            return paramSum + unitPrice * quantity;
          }, 0) ?? 0)
        );
      }, 0);
  }, [transaction, getSamplesFlattenedForms]);
  // calculate total discount of children
  const totalDiscount = useMemo(() => {
    return transaction?.request_obj?.child_requests
      ?.filter((child) => child?.latest_status_obj?.step_obj?.name !== "رد شده")
      ?.reduce((sum, child) => {
        return (
          sum +
          (child?.parameter_obj?.reduce((paramSum, parameter) => {
            const unitPrice = child.is_urgent
              ? parseInt(parameter?.urgent_price ?? "0", 10)
              : child?.owner_obj?.is_partner
                ? parameter?.partner_price === null
                  ? parseInt(parameter?.price, 10)
                  : parseInt(parameter?.partner_price, 10)
                : parseInt(parameter?.price, 10);

            const quantity =
              getSamplesFlattenedForms(child?.forms)?.length ?? 1;

            // Calculate discount amount for this parameter
            const discountAmount =
              (unitPrice * quantity * (child.discount ?? 0)) / 100;

            return paramSum + discountAmount;
          }, 0) ?? 0)
        );
      }, 0);
  }, [transaction, getSamplesFlattenedForms]);
  const getParamPrice = (param: ParameterType, child: RequestType) => {
    if (child?.is_urgent) {
      if (child?.owner_obj?.is_partner) {
        return param.partner_urgent_price !== null
          ? Number(param.partner_urgent_price)
          : param.partner_price !== null
            ? Number(param.partner_price)
            : Number(param.price);
      } else {
        return Number(param.urgent_price);
      }
    } else {
      if (child?.owner_obj?.is_partner) {
        return param.partner_price !== null
          ? Number(param.partner_price)
          : Number(param.price);
      } else {
        return Number(param.price);
      }
    }
  };
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "دقیقه" },
      { value: "hour", name: "ساعت" },
    ];
  }, []);
  return (
    <div className="no-padding hidden w-full text-[9px]" id="print-transaction">
      {/* row-1 */}
      <div className="grid grid-cols-3 items-center">
        {/* <span>
          <Image
            src={logo_print}
            width={400}
            height={400}
            className="w-[72px]"
            alt="دانشگاه شریف"
          />
        </span> */}
        {logo && (
          <span
            className={"back-primary-dark m-1 flex h-fit w-fit rounded-[50%]"}
          >
            <Image
              src={logo}
              width={400}
              height={400}
              className="w-[72px]"
              alt="دانشگاه شریف"
              loading="eager"
            />
          </span>
        )}
        <span className="text-center">
          {/* {request?.order_obj.order_status === "completed" &&
            (role === "customer"
              ? "صورت حساب نسخه مشتری"
              : "صورت حساب نسخه مالی")} */}

          {/* ****** MUST BE CHANGED AFTER ADDING ORDER_OBJ ****** */}
          {/* 1 */}
          {/* {request?.order_obj.order_status === "pending"
            ? "پیش فاکتور"
            : "صورت‌حساب نسخه مالی"} */}
          {/* 2 */}
          {/* {request?.status_objs &&
          request?.status_objs.some(
            (obj) => obj.step_obj.name === "در ‌انتظار نمونه",
          )
            ? "صورت‌حساب نسخه مالی"
            : "پیش فاکتور"} */}

          {/* 3 */}
          {/* {!transaction?.request_obj?.order_obj?.length ||
          transaction?.request_obj?.order_obj[0].order_status === "pending"
            ? "پیش فاکتور"
            : "صورت‌حساب نسخه مالی"} */}

          {/* 4 */}
          {transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
            "در انتظار اپراتور" ||
          transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
            "در ‌انتظار پذیرش" ||
          transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
            "در انتظار پرداخت"
            ? "پیش فاکتور"
            : `صورت‌حساب نسخه ${role === "customer" ? "مشتری" : "مالی"}`}

          {/* ****** MUST BE CHANGED AFTER ADDING ORDER_OBJ ****** */}
        </span>
        <div className="flex justify-end">
          <div className="w-[80%] border-[1px]">
            <div className="grid grid-cols-2 text-center">
              <span className="border-l-[1px] py-1">شماره صورت‌حساب</span>
              <span className="py-1">
                {transaction?.request_obj?.request_number}
              </span>
            </div>
            <div className="grid grid-cols-2 border-t-[1px] text-center">
              <span className="border-l-[1px] py-1">
                {/* ****** MUST BE CHANGED AFTER ADDING ORDER_OBJ ****** */}
                {/* 1 */}
                {/* {request?.order_obj.order_status === "pending"
                  ? "تاریخ صدور پیش فاکتور"
                  : "تاریخ چاپ صورت‌حساب"} */}
                {/* 2 */}
                {/* {request?.status_objs &&
                request?.status_objs.some(
                  (obj) => obj.step_obj.name === "در ‌انتظار نمونه",
                )
                  ? "تاریخ چاپ صورت‌حساب"
                  : "تاریخ صدور پیش فاکتور"} */}

                {/* 3 */}
                {/* {!transaction?.request_obj?.order_obj?.length ||
                transaction?.request_obj?.order_obj[0].order_status ===
                  "pending"
                  ? "تاریخ صدور پیش فاکتور"
                  : "تاریخ چاپ صورت‌حساب"} */}

                {/* 4 */}
                {transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
                  "در انتظار اپراتور" ||
                transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
                  "در ‌انتظار پذیرش" ||
                transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
                  "در انتظار پرداخت"
                  ? "تاریخ صدور پیش فاکتور"
                  : "تاریخ چاپ صورت‌حساب"}

                {/* ****** MUST BE CHANGED AFTER ADDING ORDER_OBJ ****** */}
              </span>
              <span className="py-1">
                {/* ****** MUST BE CHANGED AFTER ADDING ORDER_OBJ ****** */}
                {/* 1 */}
                {/* {request?.order_obj.order_status === "pending" */}
                {/* 2 */}
                {/* {request?.status_objs &&
                request?.status_objs.some(
                  (obj) => obj.step_obj.name === "در ‌انتظار نمونه",
                )
                  ? DateHandler.formatDate(Date.now(), {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })
                  : request?.status_objs &&
                    DateHandler.formatDate(
                      request?.status_objs[0]?.updated_at,
                      {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      },
                    )} */}

                {/* 3 */}
                {/* {!transaction?.request_obj?.order_obj?.length ||
                transaction?.request_obj?.order_obj[0].order_status ===
                  "pending"
                  ? transaction?.request_obj?.status_objs &&
                    DateHandler.formatDate(
                      transaction?.request_obj?.status_objs[0]?.updated_at,
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
                    })} */}

                {/* 4 */}
                {DateHandler.formatDate(Date.now(), {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
                {/* ****** MUST BE CHANGED AFTER ADDING ORDER_OBJ ****** */}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* row-2 */}
      <div className="back-gray mt-[8px] border-[1px] px-[8px] py-1 text-center">
        مشخصات سازمان
      </div>
      {/* row-3 */}
      <div className="flex border-[1px] p-[12px] ">
        <div className="w-[55%]">
          <p className="mb-[6px]">
            <span>نام سازمان: </span>
            <span>مرکز خدمات آزمایشگاهی دانشگاه صنعتی شریف</span>
          </p>
          <p className="mb-[6px]">
            <span>نشانی: </span>
            <span>
              تهران، خیابان آزادی، دانشگاه صنعتی شریف، مجتمع فناوری استاد رضا
              روستا آزاد، مرکز خدمات آزمایشگاهی
            </span>
          </p>
          <p>
            <span>کدپستی: </span>
            <span>1458889694</span>
          </p>
        </div>
        <div className="w-[22.5%]">
          <p className="mb-[6px]">
            <span>تلفن: </span>
            <span>02166166246</span>
          </p>
          <p>
            <span>ایمیل: </span>
            <span>clab@sharif.ir</span>
          </p>
          {/* <p className="mb-[12px]">
            <span>دورنگار: </span>
            <span>66072563</span>
          </p> */}
        </div>
        <div className="w-[22.5%]">
          <p className="mb-[6px]">
            <span>شناسه ملی :</span>
            <span>14002830256</span>
          </p>
          <p className="mb-[6px]">
            <span>شماره اقتصادی: </span>
            <span>411375661499</span>
          </p>
        </div>
      </div>
      {/* row-4 */}
      <div className="back-gray border-[1px] px-[8px] py-1 text-center">
        مشخصات متقاضی
      </div>
      {/* row-5 */}
      <div className="flex border-[1px] p-[12px] ">
        <div className="w-[55%]">
          <p className="mb-[6px]">
            <span> نام شخص حقیقی: </span>
            <span>
              {/* ****** MUST BE CHANGED AFTER ADDING PAYER_OBJ ****** */}
              {/* {request?.payer_obj?.first_name +
                " " +
                request?.payer_obj?.last_name} */}
              {transaction?.request_obj?.owner_obj?.first_name +
                " " +
                transaction?.request_obj?.owner_obj?.last_name}
            </span>
          </p>
          <p className="mb-[6px]">
            <span>نشانی: </span>
            <span>
              {/* ****** MUST BE CHANGED AFTER ADDING PAYER_OBJ ****** */}
              {/* {request?.payer_obj?.address} */}
              {transaction?.request_obj?.owner_obj?.address}
            </span>
          </p>
          <p>
            <span>کدپستی: </span>
            <span>
              {/* ****** MUST BE CHANGED AFTER ADDING PAYER_OBJ ****** */}
              {/* {request?.payer_obj?.postal_code} */}
              {transaction?.request_obj?.owner_obj?.postal_code}
            </span>
          </p>
        </div>
        <div className="w-[22.5%]">
          <p className="mb-[6px]">
            <span>تلفن: </span>
            <span>
              {/* {"0" + request?.payer_obj?.username?.slice(3)} */}
              {/* ****** MUST BE CHANGED AFTER ADDING PAYER_OBJ ****** */}
              {transaction?.request_obj?.owner_obj?.account_type ===
              AccountType.BUSINESS
                ? transaction?.request_obj?.owner_obj?.company_telephone
                : transaction?.request_obj?.owner_obj?.telephone ?? "---"}
            </span>
          </p>
          <p className="mb-[6px]">
            <span>شماره همراه: </span>
            <span>
              {/* ****** MUST BE CHANGED AFTER ADDING PAYER_OBJ ****** */}
              {/* {"0" + request?.payer_obj?.username?.slice(3)} */}
              {/* {"0" + transaction?.request_obj?.owner_obj?.username?.slice(3)} */}
              {transaction?.request_obj?.owner_obj?.account_type ===
              AccountType.PERSONAL
                ? transaction?.request_obj?.owner_obj?.username
                  ? `0${transaction?.request_obj?.owner_obj?.username.slice(3)}`
                  : ""
                : !!transaction?.request_obj?.owner_obj?.linked_users_objs
                      ?.length &&
                    transaction?.request_obj?.owner_obj?.linked_users_objs[0]
                      ?.username
                  ? `0${transaction?.request_obj?.owner_obj?.linked_users_objs[0]?.username.slice(3)}`
                  : ""}
            </span>
          </p>
          {transaction?.request_obj?.owner_obj?.account_type ===
            AccountType.BUSINESS && (
            <p className="mb-[6px]">
              <span>نام سازمان: </span>
              <span>
                {transaction?.request_obj?.owner_obj?.company_name ?? "-"}
              </span>
            </p>
          )}
          {/* <p className="mb-[12px]">
            <span>دورنگار: </span>
            <span></span>
          </p> */}
        </div>
        <div className="w-[22.5%]">
          <p className="mb-[6px]">
            <span>
              {/* کد ملی:  */}
              {/* / شناسه ملی */}
              {transaction?.request_obj?.owner_obj?.account_type ===
              AccountType.BUSINESS
                ? "شناسه ملی"
                : "کد ملی"}{" "}
            </span>
            <span>
              {/* ****** MUST BE CHANGED AFTER ADDING PAYER_OBJ ****** */}
              {/* {request?.payer_obj?.national_id} */}
              {transaction?.request_obj?.owner_obj?.account_type ===
              AccountType.BUSINESS
                ? transaction?.request_obj?.owner_obj?.company_national_id
                : transaction?.request_obj?.owner_obj?.national_id}
            </span>
          </p>
          <p className="mb-[6px]">
            <span>ایمیل: </span>
            <span>
              {/* ****** MUST BE CHANGED AFTER ADDING PAYER_OBJ ****** */}
              {/* {request?.payer_obj?.email} */}
              {transaction?.request_obj?.owner_obj?.email}
            </span>
          </p>

          {/* ****** MUST BE CHANGED AFTER ADDING PAYER_OBJ ****** */}
          {transaction?.request_obj?.owner_obj?.account_type ===
            AccountType.BUSINESS && (
            <p className="mb-[6px]">
              <span>شماره اقتصادی: </span>
              <span>
                {transaction?.request_obj?.owner_obj?.company_economic_number ??
                  "-"}
              </span>
            </p>
          )}
        </div>
      </div>
      {/* row-6 */}
      <div className="back-gray border-[1px] px-[8px] py-1 text-center">
        مشخصات خدمات آزمایشگاهی
      </div>
      {/* row-7 */}
      <div className="flex border-[1px]">
        <div className="text-vertical-mode flex w-[3%] items-center justify-center border-l-[1px] p-[8px] text-center">
          ردیف
        </div>
        <div className="flex w-[12%] items-center justify-center border-l-[1px] p-[8px] text-center">
          {/* {`کد خدمات (${laboratory?.name + " " + laboratory?.name_en})`} */}
          نام آزمایشگاه
        </div>
        <div className="grid w-[25%] grid-rows-2 border-l-[1px] text-center">
          <div className="flex items-center justify-center border-b-[1px]">
            شرح خدمات آزمایشگاه
          </div>
          <div className="grid grid-cols-2">
            <div className="flex items-center justify-center border-l-[1px]">
              نام آزمون
            </div>
            <div className="flex items-center justify-center">نام پارامتر</div>
          </div>
        </div>
        <div className="flex w-[8%] items-center justify-center border-l-[1px] p-[8px] text-center">
          تعداد / مقدار
        </div>
        <div className="flex w-[6%] items-center justify-center border-l-[1px] p-[8px] text-center">
          واحد
        </div>
        <div className="flex w-[8%] items-center justify-center border-l-[1px] p-[8px] text-center">
          تعداد تکرار
        </div>
        <div className="flex w-[12%] items-center justify-center border-l-[1px] p-[8px] text-center">
          مبلغ واحد (ریال)
        </div>
        <div className="flex w-[11%] items-center justify-center border-l-[1px] p-[8px] text-center">
          مبلغ کل (ریال)
        </div>
        <div className="flex w-[6%] items-center justify-center border-l-[1px] p-[8px] text-center">
          مبلغ تخفیف
        </div>
        <div className="flex w-[9%] items-center justify-center p-[8px] text-center">
          مبلغ کل پس از تخفیف (ریال)
        </div>
      </div>
      {/* row-8 list */}
      {transaction?.request_obj?.child_requests
        ?.filter(
          (child) => child?.latest_status_obj?.step_obj?.name !== "رد شده",
        )
        ?.map((child, index) => (
          <div key={index}>
            {child?.parameter_obj?.map((parameter, i) => (
              <div className="flex border-[1px]" key={i}>
                <div className="text-cenetr flex w-[3%] items-center justify-center border-l-[1px] py-[8px]">
                  {rowIndex++}
                </div>
                <div className="text-cenetr flex w-[12%] items-center justify-center border-l-[1px] py-[8px]">
                  {/* {child?.request_number} */}
                  {laboratory?.name}
                </div>
                <div className="text-cenetr grid w-[25%] grid-cols-2 border-l-[1px]">
                  <span className="text-cenetr flex items-center justify-center border-l-[1px] py-[8px]">
                    {child?.experiment_obj?.name}
                    {child.is_urgent ? ` - (فوری)` : ""}
                  </span>
                  <span className="text-cenetr flex items-center justify-center py-[8px]">
                    {parameter?.name}
                  </span>
                </div>
                <div className="text-cenetr flex w-[8%] items-center justify-center border-l-[1px] py-[8px]">
                  {/* {request?.request_obj?.forms?.length} */}
                  {child?.experiment_obj?.test_unit_type === "sample" ||
                  child?.experiment_obj?.test_unit_type === "نمونه"
                    ? getSamplesFlattenedForms(child?.forms)?.length
                    : child?.test_duration}
                </div>
                <div className="text-cenetr flex w-[6%] items-center justify-center border-l-[1px] py-[8px]">
                  {
                    unitsList.find(
                      (unit) =>
                        unit.value === child?.experiment_obj?.test_unit_type ||
                        unit.name === child?.experiment_obj?.test_unit_type,
                    )?.name
                  }
                </div>
                <div className="text-cenetr flex w-[8%] items-center justify-center border-l-[1px] py-[8px]">
                  1
                </div>
                <div className="text-cenetr flex w-[12%] items-center justify-center border-l-[1px] py-[8px]">
                  {/* {child.is_urgent
                    ? Number(parameter?.urgent_price).toLocaleString()
                    : child?.owner_obj?.is_partner
                      ? parameter.partner_price === null
                        ? Number(parameter?.price).toLocaleString()
                        : Number(parameter?.partner_price).toLocaleString()
                      : Number(parameter?.price).toLocaleString()} */}
                  {getParamPrice(parameter, child).toLocaleString()}
                </div>
                <div className="text-cenetr flex w-[11%] items-center justify-center border-l-[1px] py-[8px]">
                  {
                    // parseInt(
                    //   child.is_urgent
                    //     ? parameter?.urgent_price ?? "0"
                    //     : child?.owner_obj?.is_partner
                    //       ? parameter?.partner_price === null
                    //         ? parameter?.price
                    //         : parameter?.partner_price
                    //       : parameter?.price,
                    // )
                    child?.experiment_obj?.test_unit_type === "sample" ||
                    child?.experiment_obj?.test_unit_type === "نمونه"
                      ? (
                          getParamPrice(parameter, child) *
                          (getSamplesFlattenedForms(child?.forms)?.length ?? 1)
                        ).toLocaleString()
                      : Number(child?.price_wod).toLocaleString()
                  }
                  {/* {Number(request?.request_obj?.price).toLocaleString()} */}
                </div>
                <div className="text-cenetr flex w-[6%] flex-col items-center justify-center border-l-[1px] py-[8px]">
                  {
                    //   parseInt(
                    //   child.is_urgent
                    //     ? parameter?.urgent_price ?? "0"
                    //     : child?.owner_obj?.is_partner
                    //       ? parameter?.partner_price === null
                    //         ? parameter?.price
                    //         : parameter?.partner_price
                    //       : parameter?.price,
                    // )
                    (
                      (getParamPrice(parameter, child) *
                        (getSamplesFlattenedForms(child?.forms)?.length ?? 1) *
                        // (request?.request_obj?.forms?.length ?? 1) *
                        Number(child?.discount ?? 0)) /
                      100
                    ).toLocaleString()
                  }
                  {child?.discount !== 0 && <p>({child?.discount}%)</p>}
                </div>
                <div className="text-cenetr flex w-[9%] items-center justify-center py-[8px]">
                  {/* {(
                parseInt(
                  isUrgent ? parameter?.urgent_price ?? "0" : parameter?.price,
                ) * (request?.request_obj?.forms?.length ?? 1)
              ).toLocaleString()} */}
                  {/* {(
                (Number(request?.request_obj?.price) *
                  (100 - Number(request?.request_obj?.discount ?? 0))) /
                100
              ).toLocaleString()} */}
                  {
                    //   parseInt(
                    //   child.is_urgent
                    //     ? parameter?.urgent_price ?? "0"
                    //     : child?.owner_obj?.is_partner
                    //       ? parameter?.partner_price === null
                    //         ? parameter?.price
                    //         : parameter?.partner_price
                    //       : parameter?.price,
                    // )
                    child?.experiment_obj?.test_unit_type === "sample" ||
                    child?.experiment_obj?.test_unit_type === "نمونه"
                      ? (
                          (getParamPrice(parameter, child) *
                            (getSamplesFlattenedForms(child?.forms)?.length ??
                              1) *
                            // (request?.request_obj?.forms?.length ?? 1) *
                            (100 - Number(child?.discount ?? 0))) /
                          100
                        ).toLocaleString()
                      : Number(child?.price).toLocaleString()
                  }
                </div>
                {/* Increse row index after displaying each parameter */}
              </div>
            ))}
          </div>
        ))}
      {/* row-9 */}
      <div className="flex border-[1px]">
        <div className=" w-[74%] border-l-[1px] py-[8px] text-center">
          جمع کل
        </div>
        <div className="text-cenetr flex w-[11%] items-center justify-center border-l-[1px] py-[8px]">
          {/* {Number(request?.request_obj?.price).toLocaleString()} */}
          {/* {Number(transaction?.request_obj?.price_wod).toLocaleString()} */}

          {totalPrice?.toLocaleString() ?? "0"}
        </div>
        <div className="text-cenetr flex w-[6%] items-center justify-center border-l-[1px] py-[8px]">
          {/* {(
            (Number(transaction?.request_obj?.price_wod) *
              Number(transaction?.request_obj?.discount ?? 0)) /
            100
          ).toLocaleString()} */}

          {totalDiscount?.toLocaleString() ?? "0"}
        </div>
        <div className="text-cenetr flex w-[9%] items-center justify-center py-[8px]">
          {Number(transaction?.request_obj?.price_wod).toLocaleString()}
          {/* {(
            (Number(transaction?.request_obj?.price_wod) *
              (100 - Number(transaction?.request_obj?.discount ?? 0))) /
            100
          ).toLocaleString()} */}
        </div>
      </div>
      {/* row-10 */}
      <div className="page-break-inside flex border-[1px]">
        <div className="flex w-[74%]">
          <div className="back-gray flex w-[42%] flex-col items-center justify-center gap-1 border-l-[1px] text-center">
            {/* مجموع مبلغ خدمات اعتباری: 0 (ریال) */}
            <span>
              مجموع مبلغ خدمات اعتباری شبکه راهبردی:{" "}
              {Number(
                transaction?.request_obj?.labsnet_discount,
              ).toLocaleString()}{" "}
              (ریال)
            </span>
            {/* {transaction?.request_obj?.labsnet_code1 && (
              <span>1. {transaction?.request_obj?.labsnet_code1}</span>
            )}
            {transaction?.request_obj?.labsnet_code2 && (
              <span>2. {transaction?.request_obj?.labsnet_code2}</span>
            )} */}
            <span>{transaction?.request_obj?.labsnet_description}</span>
          </div>
          <div className="flex w-[42%] flex-col items-center justify-center gap-1 border-l-[1px] text-center">
            {/* مجموع هزینه خدمات اعتباری:{" "} */}
            <span>
              مجموع گرنت پژوهشی:{" "}
              {Number(
                transaction?.request_obj?.grant_request_discount,
              ).toLocaleString()}{" "}
              (ریال)
            </span>
            {/* {transaction?.request_obj?.grant_request1 && (
              <span>
                1.{" گرنت اعطایی "}
                {
                  transaction?.request_obj?.grant_request1_obj?.receiver_obj
                    .first_name
                }{" "}
                {
                  transaction?.request_obj?.grant_request1_obj?.receiver_obj
                    .last_name
                }
              </span>
            )}
            {transaction?.request_obj?.grant_request2 && (
              <span>
                2.{" گرنت اعطایی "}
                {
                  transaction?.request_obj?.grant_request2_obj?.receiver_obj
                    .first_name
                }{" "}
                {
                  transaction?.request_obj?.grant_request2_obj?.receiver_obj
                    .last_name
                }
              </span>
            )} */}
          </div>
          <div className="back-gray flex w-[16%] items-center justify-center border-l-[1px] text-center">
            {(
              Number(transaction?.request_obj?.labsnet_discount) +
              Number(transaction?.request_obj?.grant_request_discount)
            ).toLocaleString()}{" "}
            (ریال)
          </div>
        </div>
        <div className="w-[17%] border-l-[1px]">
          <div className="flex items-center justify-center border-b-[1px] border-l-[1px] py-[8px] text-center">
            مجموع هزینه
          </div>
          <div className="flex items-center justify-center border-b-[1px] border-l-[1px] py-[8px] text-center">
            هزینه ارسال نمونه و فاکتور
          </div>
          <div className="flex items-center justify-center border-b-[1px] border-l-[1px] py-[8px] text-center">
            هزینه نهایی
          </div>
          {(transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
            "در انتظار اپراتور" ||
            transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
              "در ‌انتظار پذیرش" ||
            transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
              "در انتظار پرداخت") && (
            <div className="flex items-center justify-center border-l-[1px] py-[8px] text-center">
              مبلغ قابل پرداخت
            </div>
          )}
        </div>
        <div className="w-[9%]">
          <div className=" flex items-center justify-center border-b-[1px] py-[8px] text-center">
            {/* {Number(request?.request_obj?.price).toLocaleString()} */}
            {(
              (Number(transaction?.request_obj?.price_wod) *
                (100 - Number(transaction?.request_obj?.discount ?? 0))) /
              100
            ).toLocaleString()}
          </div>
          <div className=" flex items-center justify-center border-b-[1px] py-[8px] text-center">
            {/* {request?.request_obj?.is_sample_returned
              ? (
                  (850000 *
                    (100 - Number(request?.request_obj?.discount ?? 0))) /
                  100
                ).toLocaleString()
              : 0} */}
            {Number(
              transaction?.request_obj?.price_sample_returned,
            ).toLocaleString()}
          </div>
          <div className=" flex items-center justify-center border-b-[1px] py-[8px] text-center">
            {Number(transaction?.request_obj?.price).toLocaleString()}
            {/* {(
              (Number(request?.request_obj?.price) *
                (100 - Number(request?.request_obj?.discount ?? 0))) /
              100
            ).toLocaleString()} */}
          </div>
          {(transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
            "در انتظار اپراتور" ||
            transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
              "در ‌انتظار پذیرش" ||
            transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
              "در انتظار پرداخت") && (
            <div className=" back-gray flex items-center justify-center py-[8px] text-center">
              {new Intl.NumberFormat("fa-IR", { style: "decimal" })
                .format(
                  Number(
                    transaction?.request_obj?.order_obj?.[
                      transaction?.request_obj?.order_obj.length - 1
                    ]?.remaining_amount,
                  ),
                )
                ?.toLocaleString()}
            </div>
          )}
        </div>
      </div>
      {/* row-11 */}
      <div className="page-break-inside flex border-[1px]">
        <div className="w-[31.1%] border-l-[1px] p-[8px] pb-[15px]">
          {/* ****** MUST BE CHANGED AFTER ADDING ORDER_OBJ ****** */}
          {/* 1 */}
          {/* {request?.order_obj.order_status === "pending" ? ( */}
          {/* 2 */}
          {/* {request?.status_objs &&
          request?.status_objs.some(
            (obj) => obj.step_obj.name === "در ‌انتظار نمونه",
          ) ? (
            <p className="mb-[8px]">
              <span>تاریخ پرداخت: </span>
              <span>
                {DateHandler.formatDate(request?.updated_at, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </span>
            </p>
          ) : (
            <p>
              <span>توضیحات: </span>
              <span></span>
            </p>
          )} */}

          {/* 3 */}
          {/* {!transaction?.request_obj?.order_obj?.length ||
          transaction?.request_obj?.order_obj[0].order_status === "pending" ? */}

          {/* 4 */}
          {transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
            "در انتظار اپراتور" ||
          transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
            "در ‌انتظار پذیرش" ||
          transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
            "در انتظار پرداخت" ? (
            <p>
              <span>تاریخ ثبت درخواست: </span>
              <span>
                {DateHandler.formatDate(transaction?.request_obj?.created_at, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </span>
              <p className="mt-[8px]">توضیحات: </p>
            </p>
          ) : (
            <>
              <p className="mb-[8px]">
                <span>تاریخ پرداخت: </span>
                <span>
                  {DateHandler.formatDate(
                    transaction?.request_obj?.order_obj?.[0]?.updated_at,
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    },
                  )}
                </span>
              </p>
              <p className="mb-[8px]">
                <span>تاریخ دریافت نمونه: </span>
                <span>
                  {transaction?.request_obj?.delivery_date
                    ? DateHandler.formatDate(
                        transaction?.request_obj?.delivery_date,
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        },
                      )
                    : "---"}
                </span>
              </p>
            </>
          )}

          {/* ****** MUST BE CHANGED AFTER ADDING ORDER_OBJ ****** */}
          {/* <p className="mb-[8px]">
            <span>تاریخ در خواست :</span>
            <span>
              {DateHandler.formatDate(request?.request_obj?.updated_at, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </p> */}
          {/*<p className="mb-[8px]">*/}
          {/*  <span>تاریخ پیش فاکتور : </span>*/}
          {/*  <span>*/}
          {/*    {DateHandler.formatDate(request?.request_obj?.created_at, {year: "numeric", month: "2-digit", day: "2-digit"})}*/}
          {/*  </span>*/}
          {/*</p>*/}
          {/* <p>
            <span>توضیحات : </span>
            <span></span>
          </p> */}
        </div>
        <div className="w-[31.1%] border-l-[1px] p-[8px] pb-[15px]">
          <p className="mb-[8px]">مهر و امضاء آزمایشگاه مرکزی: </p>
          <p className="mb-[16px]">
            <span>نام هماهنگ کننده: </span>
            <span>
              {/* {request?.result_objs && request?.result_objs[0]?.result_by_obj
                ? ` ${request?.result_objs[0]?.result_by_obj?.first_name} ${request?.result_objs[0]?.result_by_obj?.last_name}`
                : ""} */}
              {!!transaction?.request_obj?.status_objs?.length
                ? transaction?.request_obj?.status_objs[1]?.action_by_name
                : ""}
            </span>
          </p>
        </div>
        <div className="w-[37.8%] p-[8px] pb-[15px]">امضاء مشتری: </div>
      </div>

      {/* {transaction?.request_obj?.status_objs &&
      transaction?.request_obj?.status_objs.some(
        (obj) => obj.step_obj.name === "در ‌انتظار نمونه",
      )  */}

      {transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
        "در انتظار اپراتور" ||
      transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
        "در ‌انتظار پذیرش" ||
      transaction?.request_obj?.latest_status_obj?.step_obj?.name ===
        "در انتظار پرداخت" ? (
        <p className="mt-[4px] text-[8px]">
          مشخصات حساب: به نام تمرکز وجوه درآمد اختصاصی دانشگاه صنعتی شریف شماره
          شبا: IR92 0100 0040 0107 2103 0072 74 شناسه پرداخت:
          372072174140107003501000045800
        </p>
      ) : (
        <p className="mt-[4px]">
          {/* این فاکتور در داخل دانشگاه صنعتی شریف قابل هزینه کرد نمی‌باشد. */}
        </p>
      )}
    </div>
  );
};
