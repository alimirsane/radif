import { useMemo } from "react";
import { useRouter } from "next/router";

import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import classes from "./styles.module.css";
import { IcCheckCircleFill } from "@feature/kits/common/icons";

export const RequestSteps = () => {
  const router = useRouter();
  const steps = useMemo(() => {
    return [
      {
        title: "انتخاب آزمایشگاه و آزمون",
        subtitle: "قدم اول",
      },
      {
        title: "انتخاب پارامتر",
        subtitle: "قدم دوم",
      },
      {
        title: "تایید شرایط و قوانین",
        subtitle: "قدم سوم",
      },
      {
        title: "ورود اطلاعات نمونه",
        subtitle: "قدم چهارم",
      },
      {
        title: "تایید اطلاعات آزمون",
        subtitle: "قدم پنجم",
      },
      {
        title: "ثبت نهایی درخواست",
        subtitle: "قدم ششم",
      },
    ];
  }, []);
  const getColor = (index: number) => {
    if (router.query.step) {
      if (index + 1 === Number(router.query.step)) {
        return "info";
      } else if (index + 1 < Number(router.query.step)) {
        return "success";
      } else return "paper";
    } else if (!router.query.step && index === 0) {
      return "info";
    }
    return "paper";
  };
  const getCardBorder = (index: number) => {
    if (router.query.step) {
      if (index + 1 > Number(router.query.step)) {
        return "border border-background-paper-dark";
      } else if (index + 1 < Number(router.query.step)) {
        return "border border-success";
      } else return "";
    } else if (!router.query.step && index !== 0) {
      return "border border-background-paper-dark";
    }
  };

  const getConnector = (index: number) => {
    if (
      (router.query.step && index + 1 === Number(router.query.step)) ||
      (!router.query.step && index === 0)
    ) {
      return `${classes.connector}`;
    }
  };
  return (
    <>
      <div className="flex flex-row items-center gap-4 overflow-y-hidden overflow-x-scroll px-[1px] pb-[20px] lg:gap-5 lg:overflow-x-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="w-2/3 flex-shrink-0 sm:w-1/3 md:w-2/5 lg:w-1/4 lg:flex-shrink"
          >
            <Card
              color={getColor(index)}
              className={`h-full w-full px-3 py-4 ${getConnector(index)} ${getCardBorder(index)}`}
            >
              <div className="flex flex-wrap-reverse justify-between">
                <h6 className="grow text-[16px] font-semibold">{step.title}</h6>
                {/* {index + 1 < Number(router.query.step) && (
                  <SvgIcon
                    fillColor={"success"}
                    className={
                      "rounded bg-success bg-opacity-20 p-[1px] [&_svg]:h-[24px] [&_svg]:w-[26px]"
                    }
                  >
                    <IcCheck />
                  </SvgIcon>
                )} */}
              </div>
              <div className="flex flex-row items-center gap-1 pt-2">
                <span className="text-[12px] font-medium text-common-gray">
                  {step.subtitle}
                </span>
                {index + 1 < Number(router.query.step) && (
                  <SvgIcon
                    fillColor={"success"}
                    className={" [&_svg]:h-[20px] [&_svg]:w-[20px]"}
                  >
                    <IcCheckCircleFill />
                  </SvgIcon>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};
