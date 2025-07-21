import React, { useEffect, useMemo } from "react";
import { Card } from "@kit/card";
import { useState } from "react";
import { usePayOrder } from "@hook/pay-order";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGrantRequest } from "@api/service/grant-request";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { apiUser } from "@api/service/user";
import { apiGrantLabsnet } from "@api/service/grant-labsnet";
import { CreditType } from "@api/service/grant-labsnet/type";

const PaymentMethods = ({
  userData,
  requestPrice,
}: {
  userData: CurrentUserType | undefined;
  requestPrice: number;
}) => {
  // const percent = 100;
  const price = usePayOrder((state) => state.price);

  const [proccessPrice, setProccessPrice] = useState<string>();

  const [tomanProcess, setTomanProcess] = useState<boolean>(false);
  const [percentProcess, setPercentProcess] = useState<boolean>(false);
  const [labsnetGrants, setLabsnetGrants] = useState<CreditType[]>([]);
  const [customer, setCustomer] = useState<string>("---");
  const [percent, setPercent] = useState<number>(100);

  const { data: grantRequests } = useQuery(apiGrantRequest().getAll());

  const toman = useMemo(() => {
    return grantRequests?.data?.findLast((item) => item.status === "approved")
      ?.approved_amount;
  }, [grantRequests]);
  // get current user data
  const { data: currentUser, isLoading: currentUserLoading } = useQuery(
    apiUser().me(),
  );
  // create labsnet grant api
  const { mutateAsync } = useMutation(
    apiGrantLabsnet(true, {
      success: "درخواست دریافت لیست گرنت لبزنت موفقیت آمیز بود",
      fail: "درخواست شما انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
  );
  // POST
  const getLabsnetGrant = () => {
    const data = {
      national_id: currentUser?.data?.national_id
        ? currentUser?.data?.national_id?.toString()
        : "",
      type: "1",
      services: "17535",
    };
    mutateAsync(data)
      .then((res) => {
        setLabsnetGrants(res?.data?.credits ?? []);
        setCustomer(res?.data?.customer_name ?? "");
      })
      .catch((err) => {});
  };
  useEffect(() => {
    if (percentProcess) {
      getLabsnetGrant();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentProcess]);

  useEffect(() => {
    setProccessPrice(
      (
        Number(requestPrice) * (percentProcess ? percent / 100 : 1) -
        (tomanProcess ? toman ?? 0 : 0)
      ).toString(),
    );
  }, [tomanProcess, percentProcess, requestPrice, percent, toman]);
  return (
    <Card
      variant={"outline"}
      className={"mt-[16px] px-[26px] py-[20px] text-typography-main lg:mt-0"}
    >
      {/* <div className="flex flex-col pb-[12px] text-[16px]">
        <div className="flex gap-[8px]">
          <input
            type="checkbox"
            id="percent"
            name="discount"
            onChange={() => setPercentProcess(!percentProcess)}
          />
          <label htmlFor="percent" className="flex flex-col">
            <span>گرنت شبکه راهبردی (لبزنت)</span>
          </label>
        </div>
        {percentProcess && (
          <>
            <div className="flex flex-row gap-2 pr-[22px] pt-2">
              <h6 className="text-[14px] font-bold text-common-gray">
                درخواست دهنده:
              </h6>
              <span className="text-[14px]">{customer}</span>
            </div>
            <div className="flex flex-row gap-2 pr-[22px] pt-2">
              <h6 className="text-[14px] font-bold text-common-gray">
                گرنت‌های فعال:
              </h6>
              {!!labsnetGrants.length ? (
                <>
                  {labsnetGrants?.map((grant, index) => (
                    <div
                      key={index}
                      className="flex flex-row justify-between gap-4 pb-2"
                    >
                      <div className="flex items-start gap-[8px]">
                        <input
                          type="checkbox"
                          id={`labsnet_checkbox_${index + 1}`}
                          name="discount"
                          className="mt-[1px]"
                          onChange={() => {
                            setPercent(Number(grant.percent));
                          }}
                        />
                        <label
                          htmlFor={`labsnet_checkbox_${index + 1}`}
                          className="flex flex-col text-[14px]"
                        >
                          <span>{grant.name}</span>
                          <span className="text-error/60">
                            تاریخ انقضا تا {grant.expiration_date}
                          </span>
                        </label>
                      </div>
                      <div className="text-[14px] font-medium">
                        %{grant.percent}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <span className="text-[14px] text-error">
                  گرنت فعالی یافت نشد.
                </span>
              )}
            </div>
          </>
        )}
      </div> */}
      {/* <div className="flex justify-between border-b-[1px] border-t-[1px] border-common-black/10 py-[12px] text-[16px]">
        <div className="flex gap-[8px]">
          <input
            type="checkbox"
            id="toman"
            name="discount"
            onChange={() => setTomanProcess(!tomanProcess)}
          />
          <label htmlFor="toman">گرنت پژوهشی اساتید</label>
        </div>
        <span>
          {userData?.research_grant}
          <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
        </span>
      </div> */}
      <div className="flex flex-row text-[16px] font-bold">
        <span className="w-full whitespace-nowrap text-center lg:w-[1/2] lg:text-start">
          مبلغ نهایی قابل پرداخت:
        </span>
        <span className="w-full text-center text-error lg:w-[1/2]">
          {new Intl.NumberFormat("fa-IR", { style: "decimal" })
            .format(Number(requestPrice))
            ?.toLocaleString()}
          <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
        </span>
      </div>
    </Card>
  );
};

export default PaymentMethods;
