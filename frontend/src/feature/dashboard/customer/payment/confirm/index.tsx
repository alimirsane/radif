import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { routes } from "@data/routes";
import { SvgIcon } from "@kit/svg-icon";
import { apiPayment } from "@api/service/payment";
import { IcArrowLeft } from "@feature/kits/common/icons";
import { PaymentConfirmResponseType } from "@api/service/payment/type";
import { scales } from "chart.js";

const PaymentConfirm = () => {
  const router = useRouter();

  const [paymentResult, setPaymentResult] =
    useState<PaymentConfirmResponseType | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<boolean>(false);
  const [paymentResultFailed, setPaymentResultFailed] =
    useState<boolean>(false);
  const [resultRefetched, setResultRefetched] = useState<boolean>(false);
  // payment api
  const { mutateAsync: getPaymentStatus } = useMutation(
    apiPayment(false, {
      success: "پرداخت شما با موفقیت انجام شد.",
      fail: "پرداخت شما موفقیت آمیز نبود.",
      waiting: "در حال انتظار",
    }).getPaymentStatus(router.query.id2 as string),
  );
  // refetch payment data
  const { mutateAsync: ReFetchPaymentStatus } = useMutation(
    apiPayment(false, {
      success: "بررسی وضعیت پرداخت شما با موفقیت انجام شد.",
      fail: "بررسی وضعیت پرداخت شما موفقیت آمیز نبود.",
      waiting: "در حال انتظار",
    }).getPaymentStatus(router.query.id2 as string),
  );
  // get payment result
  const getPaymentResult = () => {
    const result = Number(router.query.result);
    const commonData = {
      id2: router.query.id2 as string,
      result,
    };

    let data;
    if (result === 0) {
      data = {
        ...commonData,
        orderid: (router.query.orderid as string) ?? "orderid",
        orderguid: (router.query.orderguid as string) ?? "orderguid",
      };
    } else {
      data = {
        ...commonData,
      };
    }
    getPaymentStatus(data)
      .then((res) => {
        setPaymentResult(res?.data ?? null);
        // const status = res?.data.successful && res?.data.charged && res?.data.called_back;
        const status = res?.data.successful;
        setPaymentStatus(status !== "" && !!status);
      })
      .catch((err) => {
        setPaymentResultFailed(true);
      });
  };
  // get payment result again when transaction is unsuccessful
  const refetchPaymentResult = () => {
    const data = {
      result: 0,
      id2: router.query.id2 as string,
      orderid: (router.query.orderid as string) ?? "orderid",
      orderguid: (router.query.orderguid as string) ?? "orderguid",
    };
    ReFetchPaymentStatus(data)
      .then((res) => {
        setResultRefetched(true);
        setPaymentResult(res?.data ?? null);
        const status = res?.data.successful;
        setPaymentStatus(status !== "" && !!status);
      })
      .catch((err) => {
        setPaymentResultFailed(true);
      });
  };
  useEffect(() => {
    if (router.query.id2 && router.query.result) {
      getPaymentResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id2, router.query.result]);
  return (
    <Card
      variant={"outline"}
      className="mx-auto mt-10 px-5 pb-2 pt-6 sm:w-4/5 md:px-12 md:pb-8 md:pt-12 lg:w-1/2"
    >
      {!paymentResult && !paymentResultFailed && (
        <Card color="info" className="mb-4 p-5 text-center">
          <p className="font-bold text-info-dark">
            در حال دریافت اطلاعات پرداخت...
          </p>
        </Card>
      )}
      {paymentResultFailed && (
        <Card color="error" className="mb-4 p-5 text-center">
          <p className="font-bold text-error-dark">خطایی رخ داده است!</p>
        </Card>
      )}
      {paymentResult && (
        <>
          <Card
            color={
              paymentStatus ? "success" : resultRefetched ? "error" : "warning"
            }
            className="p-5 text-center"
          >
            <h6
              className={`text-[18px] font-bold ${paymentStatus ? "text-success-dark" : resultRefetched ? "text-error-dark" : "text-warning"}`}
            >
              {paymentStatus
                ? "پرداخت شما با موفقیت انجام شد."
                : resultRefetched
                  ? "پرداخت شما موفقیت آمیز نبود."
                  : "وضعیت پرداخت شما در حال بررسی می‌باشد."}
            </h6>
          </Card>
          <div className="py-4 md:px-10">
            <div className="flex flex-row items-center justify-between border-b border-b-background-paper-dark px-2 py-4">
              <h6 className="text-[14px]">شماره درخواست:</h6>
              <h6 className="text-[16px] font-bold">
                {paymentResult?.order_obj?.request_number}
              </h6>
            </div>
            <div className="flex flex-row items-center justify-between border-b border-b-background-paper-dark px-2 py-4">
              <h6 className="text-[14px]">شماره تراکنش:</h6>
              <h6 className="text-[16px] font-bold">{router.query.id2}</h6>
            </div>
            <div className="flex flex-row items-center justify-between border-b border-b-background-paper-dark px-2 py-4">
              <h6 className="text-[14px]">مبلغ تراکنش:</h6>
              <h6 className="text-[16px] font-bold">
                {paymentResult?.amount?.toLocaleString()}
                <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
              </h6>
            </div>
            <div className="flex flex-row items-center justify-between border-b border-b-background-paper-dark px-2 py-4">
              <h6 className="text-[14px]">وضعیت تراکنش:</h6>
              <h6
                className={`text-[16px] font-bold ${paymentStatus ? "text-success" : resultRefetched ? "text-error" : "text-warning"}`}
              >
                {paymentStatus ? "موفق" : resultRefetched ? "ناموفق" : "---"}
              </h6>
            </div>
            {paymentStatus ? (
              <Link href={routes.customerRequestsList()}>
                <Button
                  endIcon={
                    <SvgIcon
                      fillColor={"white"}
                      className={"[&_svg]:h-[11px] [&_svg]:w-[11px]"}
                    >
                      <IcArrowLeft />
                    </SvgIcon>
                  }
                  className="mx-auto mt-9"
                >
                  تکمیل پرداخت و بازگشت به لیست درخواست‌ها
                </Button>
              </Link>
            ) : resultRefetched ? (
              <Link href={routes.customerRequestsList()}>
                <Button
                  endIcon={
                    <SvgIcon
                      fillColor={"white"}
                      className={"[&_svg]:h-[11px] [&_svg]:w-[11px]"}
                    >
                      <IcArrowLeft />
                    </SvgIcon>
                  }
                  className="mx-auto mt-9"
                >
                  تکمیل پرداخت و بازگشت به لیست درخواست‌ها
                </Button>
              </Link>
            ) : (
              <Button onClick={refetchPaymentResult} className="mx-auto mt-9">
                بررسی وضعیت تراکنش
              </Button>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default PaymentConfirm;
