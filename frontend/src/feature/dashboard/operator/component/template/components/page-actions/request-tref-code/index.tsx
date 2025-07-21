import { FormHandler } from "@utils/form-handler";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { useModalHandler } from "@utils/modal-handler/config";
import { validation } from "@utils/form-handler/validation";
import { Input } from "@kit/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcChevronDown, IcClose } from "@feature/kits/common/icons";
import * as yup from "yup";
import { apiPaymentRecord } from "@api/service/payment-record";
import { apiRequest } from "@api/service/request";
import { apiOrder } from "@api/service/order";
import { useMemo, useState } from "react";
import { Select } from "@kit/select";

const RequestTrefCode = () => {
  const hideModal = useModalHandler((state) => state.hideModal);

  // get request data
  const request = useModalHandler((state) => state.modalData);

  const [paymentId, setPaymentId] = useState(-1);
  const settlementTypes = useMemo(() => {
    return [
      { value: "pos", name: "کارتخوان" },
      { value: "iopay", name: "درگاه پرداخت داخلی" },
      { value: "eopay", name: "درگاه پرداخت خارجی" },
    ];
  }, []);
  const validationSchema = yup.object({
    settlement_type: validation.requiredInput,
    code: validation.requiredInput,
    // code: validation.trefCode,
  });

  const clientQuery = useQueryClient();
  // order create api
  const { mutateAsync: createTransaction } = useMutation(
    apiOrder(false).create(),
  );
  const handleTransaction = (values: {
    code: any;
    settlement_type: string;
  }) => {
    const data = {
      request: Number(request.requestId),
      buyer: request.buyer,
    };
    createTransaction(data)
      .then((res) => {
        setPaymentId(res?.data?.payment_record[0].id ?? -1);
        setTimeout(() => {
          submitTref(values);
        }, 500);
      })
      .catch((err) => {});
  };
  // update tref api
  const { mutateAsync: submitTrefCode } = useMutation(
    apiPaymentRecord(true, {
      success: "ثبت کد مرجع بانک موفقیت آمیز بود",
      fail: "ثبت کد مرجع بانک انجام نشد",
      waiting: "در حال انتظار",
    }).createTransactionByOperator(),
  );
  const submitTref = (values: { code: any; settlement_type: string }) => {
    const data = {
      amount: Number(request.amount),
      settlement_type: values.settlement_type,
      tref: values.code,
      successful: true,
      order: request.orderId,
      payer: request.buyer,
      payment_type: "order",
      charged: true,
      called_back: true,
      is_returned: false,
    };
    submitTrefCode(data)
      .then((res) => {
        // refetch request data
        clientQuery.invalidateQueries({
          queryKey: [apiRequest().url],
        });
        hideModal();
      })
      .catch((err) => {});
  };
  return (
    <Card
      color={"white"}
      className="2xl:w-[20vw] w-[80vw] px-8 pb-7 pt-6 sm:w-[50vw] xl:w-[30vw]"
    >
      <span className="mb-9 flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">ثبت کد مرجع بانک</h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <FormHandler
        initialValues={{ code: undefined, settlement_type: "" }}
        validationSchema={validationSchema}
        handleSubmit={(values, utils) => {
          submitTref(values);
        }}
      >
        {(formik) => (
          <>
            <div>
              <Input
                formik={formik}
                name="code"
                autoComplete="code"
                placeholder={"کد مرجع بانک را وارد کنید"}
                label="کد مرجع تراکنش"
              />
            </div>
            <div className="pt-5">
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
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => hideModal()}>
                لغو
              </Button>
              <Button type="submit" disabled={!formik.isValid}>
                ثبت کد
              </Button>
            </div>
          </>
        )}
      </FormHandler>
    </Card>
  );
};

export default RequestTrefCode;
