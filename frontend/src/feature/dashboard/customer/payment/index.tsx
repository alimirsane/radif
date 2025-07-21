import React, { useMemo } from "react";
import Container from "@feature/dashboard/common/container";
import Costs from "./costs";
import PaymentMethods from "./payment-methods";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcArrowRight, IcCard } from "@feature/kits/common/icons";
import { apiOrder } from "@api/service/order";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import { usePayOrder } from "@hook/pay-order";
import { apiRequest } from "@api/service/request";
import Link from "next/link";
import { routes } from "@data/routes";

const Payment = () => {
  const { data: user } = useQuery({
    ...apiUser().me(),
  });

  const requestId = usePayOrder((state) => state.requestId);
  const price = usePayOrder((state) => state.price);
  // get request data
  const { data: request } = useQuery({
    ...apiRequest().getById(requestId),
  });
  const requestPrice = useMemo(() => {
    return (
      Number(price) *
      (request?.data?.discount ? (100 - request?.data?.discount) / 100 : 1)
    );
  }, [request, price]);

  // order create api
  const { mutateAsync } = useMutation(
    apiOrder(true).getPaymentLink(request?.data?.order_obj?.[0]?.id.toString()),
  );
  const handlePayment = () => {
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
        {/* <h2 className="mb-[16px] text-[16px] font-bold text-typography-main">
          روش های پرداخت
        </h2>
        <div className="mt-[16px] flex flex-col-reverse md:grid md:grid-cols-2 md:gap-[16px] lg:gap-[40px]">
          <PaymentMethods userData={user?.data} />
          <Costs request={request?.data} />
        </div> */}
        <div className="flex flex-col md:gap-8">
          <div>
            <h2 className="mb-2 text-[16px] font-bold">جزئیات هزینه درخواست</h2>
            <Costs request={request?.data} />
          </div>
          <div className="flex w-full flex-row justify-end">
            <span className="w-full md:w-[50%] lg:w-[37%]">
              {/* <h2 className="mb-2 text-[16px] font-bold">روش‌های پرداخت</h2> */}
              <PaymentMethods
                userData={user?.data}
                requestPrice={
                  request?.data?.order_obj?.[
                    request?.data?.order_obj.length - 1
                  ]?.remaining_amount ?? 0
                }
              />
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
            onClick={handlePayment}
          >
            پرداخت هزینه آزمون
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default Payment;
