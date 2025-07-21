import * as yup from "yup";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { TextArea } from "@kit/text-area";
import { FormHandler } from "@utils/form-handler";
import { useModalHandler } from "@utils/modal-handler/config";
import { IcCheck, IcChevronDown, IcClose } from "@feature/kits/common/icons";
import { Select } from "@kit/select";
import { Switch } from "@kit/switch";
import { validation } from "@utils/form-handler/validation";
import { apiPaymentRecord } from "@api/service/payment-record";
import { ResultType } from "@api/service/payment-record/type";
import { useRouter } from "next/router";
import { apiRequest } from "@api/service/request";

const EditPaymentRecord = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get transaction details form modal
  const request = useModalHandler((state) => state.modalData);
  // status
  const [switchIsChecked, setChecked] = useState<boolean>(
    request?.transaction
      ? request?.transaction?.successful
      : request?.successful ?? false,
  );
  const settlementTypes = useMemo(() => {
    return [
      { value: "cash", name: "نقدی" },
      { value: "pos", name: "کارتخوان" },
      { value: "iopay", name: "درگاه پرداخت داخلی" },
      { value: "eopay", name: "درگاه پرداخت خارجی" },
    ];
  }, []);
  const initialValues = useMemo(() => {
    return {
      amount: request?.transaction
        ? request?.transaction?.amount
        : request?.amount,
      settlement_type: request?.transaction
        ? request?.transaction?.settlement_type
        : request?.settlement_type,
      transaction_code: request?.transaction
        ? request?.transaction?.transaction_code
        : request?.transaction_code,
      tref: request?.transaction ? request?.transaction?.tref : request?.tref,
    };
  }, [request]);
  const transactionValidationSchema = useMemo(() => {
    return yup.object({
      // amount: validation.requiredInput,
      amount: yup
        .number()
        .required("این فیلد اجباریست")
        .positive("مبلغ باید عددی مثبت باشد")
        .integer("مبلغ باید یک عدد صحیح باشد"),
      // .max(
      //   request.price,
      //   `مبلغ تراکنش می‌تواند حداکثر ${Number(request.price).toLocaleString()} ریال باشد`,
      // ),
      settlement_type: validation.requiredInput,
      // transaction_code: validation.requiredInput,
      tref: validation.requiredInput,
      // tref: validation.trefCode,
    });
  }, []);

  // update transaction api
  const { mutateAsync: updateTransaction } = useMutation(
    apiPaymentRecord(true, {
      success: "ویرایش تراکنش موفقیت آمیز بود",
      fail: "ویرایش تراکنش انجام نشد",
      waiting: "در حال انتظار",
    }).updateTransactionByOperator(
      request?.transaction ? request?.transaction?.id : request?.id,
    ),
  );
  const submitTransaction = (
    values: Pick<
      ResultType,
      "tref" | "settlement_type" | "transaction_code" | "amount"
    >,
  ) => {
    const data = {
      amount: values.amount,
      settlement_type: values.settlement_type,
      transaction_code: values.transaction_code,
      tref: values.tref,
      successful: switchIsChecked ? true : false,
    };
    updateTransaction(data)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiRequest().url],
        });
        router.query.action = "edit";
        router.push(router);
        hideModal();
      })
      .catch((err) => {});
  };
  return (
    <Card
      color={"white"}
      className="flex max-h-[95vh] w-[95vw] flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[70vw] xl:w-[50vw]"
    >
      <span className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">ویرایش تراکنش</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>

      <FormHandler
        validationSchema={transactionValidationSchema}
        initialValues={initialValues}
        handleSubmit={(values, utils) => {
          submitTransaction(values);
        }}
      >
        {(formik) => (
          <div className="grid grid-cols-1 gap-8 pb-2 text-right md:grid-cols-2">
            <div className="col-span-2 md:col-span-1">
              <Input
                label={"مبلغ تراکنش"}
                name={"amount"}
                formik={formik}
                autoComplete={"amount"}
                placeholder="مبلغ تراکنش را وارد کنید"
                type="number"
                style={{
                  direction: formik.values["amount"] ? "ltr" : "rtl",
                }}
              />

              {formik.values.amount && (
                <span className="text-[12px] text-typography-secondary">
                  {(Number(formik.values.amount) / 10)?.toLocaleString()} تومان
                </span>
              )}
            </div>
            <div className="col-span-2 md:col-span-1">
              <Select
                options={settlementTypes ?? []}
                name={"settlement_type"}
                label={"نوع تراکنش"}
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
                      {activeItem?.name ?? "نوع تراکنش را انتخاب کنید"}
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
              <Input
                name={"tref"}
                formik={formik}
                autoComplete={"tref"}
                placeholder="شماره تراکنش را وارد کنید"
                label={"شماره تراکنش"}
                style={{
                  direction: formik.values["tref"] ? "ltr" : "rtl",
                }}
              />
              {/* <p className="mt-1 text-[12px] text-error">
                * ویرایش شماره تراکنش الزامیست.
              </p> */}
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"transaction_code"}
                formik={formik}
                autoComplete={"transaction_code"}
                placeholder="کد مرجع را وارد کنید"
                label={"کد مرجع"}
                type="number"
                style={{
                  direction: formik.values["transaction_code"] ? "ltr" : "rtl",
                }}
              />
            </div>
            <div className="col-span-2 flex items-center md:col-span-1">
              <Switch
                checked={switchIsChecked}
                onChange={() => setChecked(!switchIsChecked)}
              >
                موفق
              </Switch>
            </div>
            <div className="col-span-2 flex justify-end">
              <Button
                type="submit"
                variant="solid"
                color="primary"
                className="w-full sm:w-auto"
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
                ثبت تغییرات
              </Button>
            </div>
          </div>
        )}
      </FormHandler>
    </Card>
  );
};
export default EditPaymentRecord;
