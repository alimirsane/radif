import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import {
  IcChevronDown,
  IcChevronUp,
  IcClose,
  IcKey,
} from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";
import { Status } from "@kit/status";
import { useMemo, useState } from "react";
import { ColorTypes } from "@kit/common/color-type";
import { Collapse } from "@kit/collapse";

const RequestsListUserGuide = () => {
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // handle collapse
  const [expandItem, setExpandItem] = useState<number>(0);
  // user guide data
  const requestSteps = useMemo(() => {
    return [
      {
        id: 1,
        title: "در انتظار اپراتور",
        color: "paper",
        description:
          'تمامی درخواست‌ها پس از ثبت توسط مشتری در این قسمت قابل مشاهده خواهند بود. در این مرحله، اپراتور آزمایشگاه موظف است که آزمون‌های هر درخواست را بررسی کرده و آزمون‌ها را در یکی از وضعیت‌های "رد درخواست" یا "تایید درخواست" قرار دهد. برای ارسال درخواست به مرحله بعد (در انتظار پذیرش)، لازم است که وضعیت تمامی آزمون‌های مربوط به آن درخواست مشخص شده باشد.',
        note: "تا زمانی که وضعیت تمامی آزمون‌ها تعیین نگردیده باشد، امکان ویرایش درخواست در مرحله بعد وجود نخواهد داشت.",
      },
      {
        id: 2,
        title: "در انتظار پذیرش",
        color: "secondary",
        description:
          'پس از تعیین وضعیت توسط اپراتور، درخواست‌ها در دسترس پذیرش قرار خواهند گرفت. در این مرحله، پذیرش موظف است که درخواست را بررسی نموده و آزمون‌های هر درخواست را در یکی از وضعیت‌های "رد درخواست" یا "تایید درخواست" قرار دهد. برای ارسال درخواست به مرحله بعد (در انتظار پرداخت)، لازم است وضعیت تمامی آزمون‌های مربوط به آن درخواست مشخص شده باشد. همچنین اگر پیش پرداختی انجام شده است، تراکنش مربوط به آن باید در این مرحله ایجاد شود.',
        note: "تا زمانی که وضعیت تمامی آزمون‌ها تعیین نگردیده باشد، امکان ویرایش درخواست در مرحله بعد وجود نخواهد داشت.",
        note2:
          "در صورتی که مشتری درخواست استفاده از گزنت لبزنت ثبت کرده باشد‌، پذیرش بایستی میزان گرنت لبزنت را وارد نماید.",
      },
      {
        id: 3,
        title: "در انتظار پرداخت",
        color: "info",
        description:
          "پس از تایید توسط پذیرش، درخواست به این مرحله می‌رسد. مشتری باید مبلغ درخواست را پرداخت کند. پس از پرداخت، با تایید پذیرش درخواست به مرحله بعد منتقل خواهد شد.",
        note: "تا زمانی که پرداخت انجام نشده باشد، امکان ارسال درخواست به مرحله بعد وجود ندارد.",
        // note2:
        //   "در صورتی که مشتری پرداختی به روشی غیر از درگاه داخلی انجام داده است، کد مرجع بانک آن تراکنش بایستی ثبت شود.",
      },
      {
        id: 4,
        title: "در انتظار نمونه",
        color: "warning",
        description:
          "پس از پرداخت، مشتری باید نمونه‌های لازم را ارسال کند. پس از دریافت نمونه‌ها، آزمایشگاه بررسی را آغاز می‌کند.",
        note: "تا زمانی که نمونه‌ها ارسال نشده باشند، درخواست به مرحله بعد (در حال انجام) منتقل نخواهد شد.",
      },
      {
        id: 5,
        title: "در حال انجام",
        color: "primary",
        description:
          "در این مرحله، آزمایشگاه روی نمونه‌ها کار می‌کند و آزمون‌ها را انجام می‌دهد. پس از پایان فرآیند آزمایش، اپراتور نتیجه را بارگذاری می‌کند.",
        note: "درصورت عدم بارگذاری نتیجه داخل سایت، امکان تکمیل درخواست وجود ندارد.",
      },
      {
        id: 6,
        title: "تکمیل شده",
        color: "success",
        description:
          "پس از اتمام تمامی آزمون‌ها و تایید نهایی توسط مدیر فنی، درخواست به این مرحله می‌رسد. در این مرحله نتایج آزمون‌ها به مشتری اطلاع داده خواهد شد.",
        note: "",
      },
      {
        id: 7,
        title: "رد شده",
        color: "error",
        description:
          "در صورتی که درخواست به هر دلیلی رد شود، به این مرحله منتقل می‌شود و دلیل رد به مشتری اعلام خواهد شد.",
        note: "",
      },
    ];
  }, []);

  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] w-full flex-col overflow-y-auto px-9 pb-9 pt-7 md:max-h-[93vh] md:w-[60vw] lg:w-[50vw]"
    >
      <div className="mb-7 flex flex-row items-center justify-between">
        <h6 className="text-[18px] font-bold">راهنمای بررسی درخواست‌ها</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <div className="flex flex-col gap-2">
        {requestSteps.map((step, index) => (
          <Card
            className={`flex flex-col border border-background-paper ${
              step.color === "paper" ||
              (step.color !== "paper" && expandItem !== step.id)
                ? "bg-opacity-35"
                : "bg-opacity-10"
            }`}
            key={index}
            color={
              expandItem === step.id ? (step.color as ColorTypes) : "paper"
            }
          >
            <div
              className={
                "flex cursor-pointer flex-row items-center justify-between px-4 py-2"
              }
              onClick={() => setExpandItem(step.id)}
            >
              <Status color={step.color as ColorTypes}>
                <span className="text-[14px] font-medium">{step.title}</span>
              </Status>

              <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                {expandItem === step.id ? <IcChevronUp /> : <IcChevronDown />}
              </SvgIcon>
            </div>
            <Collapse open={expandItem === step.id}>
              <Card
                color={"white"}
                className={"flex flex-col gap-3 px-5 py-5 text-[14px]"}
              >
                <p className="px-1 leading-loose">{step.description}</p>
                {step.note && (
                  <p className="px-1 font-medium italic">
                    <span
                      className={`font-semibold not-italic ${`text-${step.color}`}`}
                    >
                      تذکر:{" "}
                    </span>
                    {step.note}
                  </p>
                )}

                {step.note2 && (
                  <p className="px-1 font-medium italic">
                    <span
                      className={`font-semibold not-italic ${`text-${step.color}`}`}
                    >
                      تذکر2:{" "}
                    </span>
                    {step.note2}
                  </p>
                )}
              </Card>
            </Collapse>
          </Card>
          //   <Card
          //     key={index}
          //     color={"white"}
          //     className={`
          //      rounded-[12px] border-[1px] border-r-[14px] px-4 pb-4 pt-5
          //     ${`border-${step.color}`}
          // `}
          //   >
          //     <Status color={step.color as ColorTypes}>{step.title}</Status>
          //     <p className="px-1 pt-2 text-[14px] leading-loose">
          //       {step.description}
          //     </p>
          //     {step.note && (
          //       <p className="px-1 pt-2 text-[14px] font-medium italic">
          //         <span
          //           className={`font-semibold not-italic ${`text-${step.color}`}`}
          //         >
          //           تذکر:{" "}
          //         </span>
          //         {step.note}
          //       </p>
          //     )}

          //     {step.note2 && (
          //       <p className="px-1 pt-2 text-[14px] font-medium italic">
          //         <span
          //           className={`font-semibold not-italic ${`text-${step.color}`}`}
          //         >
          //           تذکر2:{" "}
          //         </span>
          //         {step.note2}
          //       </p>
          //     )}
          //   </Card>
        ))}
      </div>
      <div className="pt-2">
        <Card
          color="white"
          className="flex flex-row gap-2 border border-background-paper bg-opacity-35 px-6 py-4 text-[14px] leading-loose"
        >
          <h6 className="flex flex-row items-center gap-[5px] font-semibold">
            <div className={`h-[10px] w-[10px] rounded-full bg-common-black`} />
            نکته:
          </h6>
          <p>
            وضعیت هر یک از آزمون‌های درخواست، نمی‌تواند بیشتر از یک مرحله از
            درخواست اصلی جلوتر باشد.
          </p>
        </Card>
      </div>
      <div className="grid gap-2 pt-2 md:grid-cols-1">
        <Card
          color="white"
          className="flex flex-col gap-2 border border-background-paper bg-opacity-35 px-6 py-4 text-[14px] leading-loose"
        >
          <h6 className="flex flex-row items-center gap-[5px] font-semibold">
            <div className={`h-[10px] w-[10px] rounded-full bg-common-black`} />
            دسترسی‌های اپراتور و مدیر فنی
          </h6>
          <p>
            اپراتور و مدیر فنی در تمامی مراحل، به غیر از مراحل &quot;در انتظار
            پذیرش&quot; و &quot;در انتظار پرداخت&quot;، امکان انجام تغییرات
            دارند. تغییراتی که اپراتور و مدیرفنی می‌توانند انجام دهند، براساس
            اینکه درخواست در چه مرحله‌ای قرار دارد، شامل عملیات زیر می‌باشد:
          </p>
          <div className="grid gap-2 font-medium italic text-common-gray xl:grid-cols-3">
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              چاپ درخواست
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              تایید/رد درخواست
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              چاپ فاکتور/پیش فاکتور
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              اعمال تخفیف
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              چاپ اطلاعات آزمون
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              بارگذاری/مشاهده نتیجه
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              چاپ گواهینامه آزمون
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              تایید نتیجه
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              مشاهده تاریخچه درخواست
            </span>
          </div>
        </Card>
        <Card
          color="white"
          className="flex flex-col gap-2 border border-background-paper bg-opacity-35 px-6 py-4 text-[14px] leading-loose"
        >
          <h6 className="flex flex-row items-center gap-[5px] font-semibold">
            <div className={`h-[10px] w-[10px] rounded-full bg-common-black`} />
            دسترسی‌های پذیرش
          </h6>
          <p>
            پذیرش امکان مشاهده درخواست‌های تمامی مراحل را دارد، اما فقط در مراحل
            &quot;در انتظار پذیرش&quot; و &quot;در انتظار پرداخت&quot;، امکان
            انجام تغییرات دارد. تغییراتی که پذیرش می‌تواند انجام دهد، براساس
            اینکه درخواست در چه مرحله‌ای قرار دارد، شامل عملیات زیر می‌باشد:
          </p>
          <div className="grid gap-2 font-medium italic text-common-gray xl:grid-cols-3">
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              چاپ درخواست
            </span>
            {/* <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              ثبت کد مرجع بانک
            </span> */}
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              ثبت میزان تخفیف لبزنت
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              چاپ فاکتور/پیش فاکتور
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              اعمال تخفیف
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              چاپ اطلاعات آزمون
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              مشاهده نتیجه
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              چاپ گواهینامه آزمون
            </span>
            <span className="flex flex-row items-center gap-[6px]">
              <div className={`h-[6px] w-[6px] rounded-full bg-common-gray`} />
              مشاهده تاریخچه درخواست
            </span>
          </div>
        </Card>
      </div>
    </Card>
  );
};
export default RequestsListUserGuide;
