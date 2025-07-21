import React, { useEffect } from "react";
import Container from "@feature/dashboard/common/container";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcArrowRight, IcCard } from "@feature/kits/common/icons";
import { apiOrder } from "@api/service/order";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePayOrder } from "@hook/pay-order";
import { apiRequest } from "@api/service/request";
import Link from "next/link";
import { routes } from "@data/routes";
import Details from "./detail";

const PrePayment = () => {
  const requestId = usePayOrder((state) => state.requestId);
  // get request data
  const { data: request, refetch } = useQuery({
    ...apiRequest().getById(requestId),
  });
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);
  // const handlePayment = () => {
  //   console.log(
  //     "prepayment link",
  //     request?.data?.order_obj?.[0]?.payment_record?.[0]?.payment_link,
  //   );
  //   const prePaymentLink =
  //     request?.data?.order_obj?.[0]?.payment_record?.[0]?.payment_link;
  //   if (prePaymentLink) {
  //     // Open the payment link in a new tab
  //     window.open(prePaymentLink, "_self")?.focus();
  //   }
  // };
  // order create api
  const { mutateAsync } = useMutation(
    apiOrder(true).getPrePaymentLink(
      request?.data?.order_obj?.[0]?.id.toString(),
    ),
  );
  const handlePrePayment = () => {
    const data = {
      order_status: "pending",
    };
    mutateAsync(data)
      .then((res) => {
        const paymentLink =
          res?.data.payment_record[res?.data.payment_record.length - 1]
            .payment_link;
        if (paymentLink) {
          // Open the payment link in a new tab
          window.open(paymentLink, "_self")?.focus();
        }
      })
      .catch((err) => {});
  };

  return (
    <Container>
      <Card
        variant={"outline"}
        className={
          "border-0 md:border-[1px] md:bg-common-white md:p-[20px] lg:px-[40px] lg:py-[30px]"
        }
      >
        <div className="flex flex-col md:gap-8">
          <div>
            <h2 className="mb-2 text-[16px] font-bold">جزئیات درخواست</h2>
            <Details request={request?.data} />
          </div>
          <div className="flex w-full flex-row justify-end">
            <span className="w-full lg:w-[41%]">
              <Card
                variant={"outline"}
                className={
                  "mt-[16px] px-[26px] py-[20px] text-typography-main lg:mt-0"
                }
              >
                <div className="flex flex-row text-[16px] font-bold">
                  <span className="w-full whitespace-nowrap text-center lg:w-[1/2] lg:text-start">
                    مبلغ نهایی قابل پرداخت:
                  </span>
                  <span className="w-full text-center text-error lg:w-[1/2]">
                    {new Intl.NumberFormat("fa-IR", { style: "decimal" })
                      .format(
                        Number(request?.data?.total_prepayment_amount ?? 50000),
                      )
                      ?.toLocaleString()}
                    <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
                  </span>
                </div>
              </Card>
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-[16px] pt-8 md:justify-end">
          <Link href={routes.customer()}>
            <Button
              variant={"outline"}
              startIcon={
                <SvgIcon
                  fillColor={"primary"}
                  className={"[&_svg]:h-[12px] [&_svg]:w-[12px]"}
                >
                  <IcArrowRight />
                </SvgIcon>
              }
            >
              بازگشت به میز کار
            </Button>
          </Link>
          <Button
            startIcon={
              <SvgIcon
                fillColor={"white"}
                className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
              >
                <IcCard />
              </SvgIcon>
            }
            onClick={handlePrePayment}
          >
            پرداخت هزینه پیش پرداخت
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default PrePayment;
