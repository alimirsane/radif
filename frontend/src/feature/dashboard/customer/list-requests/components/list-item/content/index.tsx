import React from "react";
import { useMemo } from "react";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { routes } from "@data/routes";
import { useRouter } from "next/router";
import { usePayOrder } from "@hook/pay-order";
import { RequestType } from "@api/service/request/type";
import { TextArea } from "@kit/text-area";

const Content = (props: {
  status: string | undefined;
  price: string | undefined;
  requestId: number | undefined;
  item?: RequestType;
}) => {
  const { status, price, requestId, item } = props;
  const router = useRouter();
  const setOrder = usePayOrder((state) => state.setOrder);
  const handlePaymentClick = () => {
    setOrder(requestId?.toString(), price?.toString());
    // Navigate to the customer payment route with the updated query parameter
    router.push(routes.customerPayment());
  };
  const downloadFile = (fileUrl: string | undefined) => {
    const link = document.createElement("a");
    link.href = fileUrl ? fileUrl : "";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const statusItem = useMemo(() => {
    switch (status) {
      // در انتظار نمونه
      case "در ‌انتظار نمونه":
        return (
          <>
            <Card
              variant={"outline"}
              color={"white"}
              className={"mt-[12px] px-[24px] py-[16px] text-[14px] lg:mt-0"}
            >
              پرداخت شما با موفقیت انجام شد. لطفا نمونه خود را در اسرع وقت به
              پذیرش تحویل دهید. توجه داشته باشید که شماره درخواست را به همراه
              داشته باشید.
            </Card>
          </>
        );
      // در حال انتظار
      case "در حال انجام":
        return !props?.item?.result_objs?.length ? (
          <>
            <Card
              variant={"outline"}
              color={"white"}
              className={"mt-[12px] px-[24px] py-[16px] text-[14px] lg:mt-0"}
            >
              نمونه و درخواست تحویل گرفته شده توسط پذیرش، در اختیار کارشناس
              آزمایشگاه قرار دارد. پس از انجام آزمایش و تکمیل درخواست، نتایج در
              اختیار شما قرار خواهد گرفت.
            </Card>
          </>
        ) : (
          <>
            <Card
              variant={"outline"}
              color={"white"}
              className={"mt-[12px] px-[24px] py-[16px] text-[14px] lg:mt-0"}
            >
              نمونه و درخواست تحویل گرفته شده توسط پذیرش، در اختیار کارشناس
              آزمایشگاه قرار گرفته و آزمایش انجام شده است. پس از تکمیل درخواست
              توسط کارشناس، نتایج در اختیار شما قرار خواهد گرفت.
              {/* {props.item?.result_objs !== undefined &&
              props.item?.result_objs?.length !== 0 ? (
                <>
                  درخواست شما توسط کارشناس تکمیل شده است. می‌توانید نتایج خود را
                  دریافت نمایید.
                  <Button
                    className={"mx-auto mt-[24px]"}
                    onClick={() =>
                      downloadFile(
                        props.item?.result_objs !== undefined
                          ? props.item?.result_objs[0].file
                          : "",
                      )
                    }
                  >
                    دریافت فایل نتایج
                  </Button>
                </>
              ) : (
                <>فایل نتایج آپلود نشده</>
              )} */}
            </Card>
          </>
        );
      // تکمیل درخواست
      case "تکمیل شده":
        return !props?.item?.result_objs?.length ? (
          <>
            <Card
              variant={"outline"}
              color={"white"}
              className={"mt-[12px] px-[24px] py-[16px] text-[14px] lg:mt-0"}
            >
              درخواست شما توسط کارشناس تکمیل شده است. نتایج بارگذاری نشده است.
            </Card>
          </>
        ) : (
          <>
            <Card
              variant={"outline"}
              color={"white"}
              className={"mt-[12px] px-[24px] py-[16px] text-[14px] lg:mt-0"}
            >
              درخواست شما توسط کارشناس تکمیل شده است. می‌توانید نتایج خود را
              دریافت نمایید.
              <div className="pb-4 pt-4 text-right">
                <TextArea
                  value={
                    props.item?.result_objs !== undefined
                      ? props.item?.result_objs[0].description
                      : "---"
                  }
                  rows={
                    props.item?.result_objs[0]?.file?.includes(
                      "noDataDefaultfile",
                    )
                      ? 1
                      : 4
                  }
                  label={"توضیحات"}
                  disabled
                  className="bg-background-paper"
                />
              </div>
              {!props.item?.result_objs[0]?.file?.includes(
                "noDataDefaultfile",
              ) && (
                <Button
                  className={"mx-auto my-2"}
                  onClick={() =>
                    downloadFile(
                      props.item?.result_objs !== undefined
                        ? props.item?.result_objs[0].file
                        : "",
                    )
                  }
                >
                  دریافت فایل نتایج
                </Button>
              )}
            </Card>
          </>
        );
      // رد درخواست
      case "رد شده":
        return (
          <Card
            variant={"outline"}
            color={"white"}
            className={"mt-[12px] px-[24px] py-[16px] text-[14px] lg:mt-0"}
          >
            {props?.item?.is_cancelled
              ? "درخواست توسط شما لغو شده است."
              : "درخواست شما توسط آزمایشگاه رد شده است."}
            <div className="pt-2">
              <span className="text-[15px] font-semibold">علت رد درخواست:</span>
              <span className="mr-1">
                {
                  props?.item?.status_objs?.[
                    props?.item?.status_objs?.length - 2
                  ].description
                }
              </span>
            </div>
          </Card>
        );
      // در انتظار پرداخت
      case "در انتظار پرداخت":
        return (
          <Card
            variant={"outline"}
            color={"white"}
            className={"mb-2 mt-[12px] px-[24px] py-[16px] text-[14px] lg:mt-0"}
          >
            درخواست شما در انتظار پرداخت می‌باشد.
            {/* <div className=" mt-[16px] flex items-center justify-between rounded-[8px] bg-background-paper-dark p-[8px] pr-[16px] text-typography-main">
              <span className="text-[14px]">
                هزینه نهایی:
                <span className="mr-2 text-[16px] font-bold">
                  {Number(price).toLocaleString()}
                  <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
                </span>
              </span>
              <Button onClick={handlePaymentClick}>پرداخت هزینه</Button>
            </div> */}
          </Card>
        );

      // در ‌انتظار پذیرش
      case "در ‌انتظار پذیرش":
        return (
          <Card
            variant={"outline"}
            color={"white"}
            className={"mt-[12px] px-[24px] py-[16px] text-[14px] lg:mt-0"}
          >
            پس از بررسی درخواست و تایید آن توسط پذیرش، لینک پرداخت برای شما ثبت
            خواهد شد.
            {/* <div className="mb-2 mt-[16px] flex items-center justify-center rounded-[8px] bg-background-paper-dark px-[6px] py-[14px] text-typography-main">
              <span className="text-[14px]">
                هزینه نهایی:
                <span className="mr-2 text-[16px] font-bold">
                  {Number(price).toLocaleString()}
                  <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
                </span>
              </span>
            </div> */}
          </Card>
        );

      // در انتظار اپراتور
      case "در انتظار اپراتور":
        return (
          <Card
            variant={"outline"}
            color={"white"}
            className={"mt-[12px] px-[24px] py-[16px] text-[14px] lg:mt-0"}
          >
            درخواست شما در انتظار بررسی و تایید اپراتور می‌باشد.
            {/* <div className="mb-2 mt-[16px] flex items-center justify-center rounded-[8px] bg-background-paper-dark px-[6px] py-[14px] text-typography-main">
              <span className="text-[14px]">
                هزینه نهایی:
                <span className="mr-2 text-[16px] font-bold">
                  {Number(price).toLocaleString()}
                  <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
                </span>
              </span>
            </div> */}
          </Card>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return statusItem;
};

export default Content;
