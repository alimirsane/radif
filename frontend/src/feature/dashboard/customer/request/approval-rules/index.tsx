import * as yup from "yup";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";

import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { useQuery } from "@tanstack/react-query";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import {
  IcArrowLeft,
  IcArrowRight,
  IcCardList,
} from "@feature/kits/common/icons";
import { useCurrentRequestHandler } from "@hook/current-request-handler";
import { apiRequest } from "@api/service/request";

const ApprovalRules = () => {
  const router = useRouter();

  const termValidationSchema = useMemo(() => {
    return yup.object({
      approvalRules: validation.checkboxInput,
    });
  }, []);
  const [isoApproval, setIsoApproval] = useState<boolean>(false);
  const requestId = useCurrentRequestHandler((state) => state.requestId);

  const { data: currentRequest } = useQuery({
    ...apiRequest().getById(requestId?.toString()),
    enabled: requestId !== undefined,
  });

  return (
    <FormHandler
      initialValues={{
        approvalRules: false,
      }}
      validationSchema={termValidationSchema}
      handleSubmit={(value) => {
        if (value.approvalRules) {
          router.query.step = (Number(router.query.step) + 1).toString();
          router.push(router);
        }
      }}
    >
      {(formik) => (
        <>
          <Card color="info" className="w-full p-[24px] text-typography-main">
            <h2 className="text-[18px] font-bold">
              لطفا قوانین و مقررات آزمایشگاه را تایید کنید:
            </h2>
            <div className="my-[16px]">
              <h3 className=" text-16 mb-[4px] font-bold">
                شرایط و قوانین عمومی آزمون و آزمایشگاه
              </h3>
              <p className="text-[14px]">
                هزینه ارسال فاکتور و عودت نمونه از طریق پست یا پیک به عهده مشتری
                می‌باشد. در صورتیکه نمونه در آزمایشگاه آلوده گردد، نمونه توسط
                اپراتور امحا خواهد شد. مسئولیت ثبت مشخصات نمونه آزمون مورد نظر
                بر عهده مشتری می‌باشد. متقاضیان محترم می‌توانند هزینه آزمون‌ها
                را از طریق درگاه پرداخت آنلاین واریز کنند. نتایج از طریق ایمیل
                برای متقاضیان ارسال خواهد شد.
              </p>
            </div>
            <div>
              <h3 className=" text-16 mb-[4px] font-bold">
                در نظر گرفتن نکات زیر برای انجام آنالیز “
                {currentRequest?.data?.experiment_obj?.name}” ضروری است:
              </h3>
              <p className="text-[14px]">
                {currentRequest?.data?.experiment_obj?.rules?.length
                  ? currentRequest?.data?.experiment_obj?.rules
                  : // <span
                    //   dangerouslySetInnerHTML={{
                    //     __html: currentRequest?.data?.experiment_obj?.rules,
                    //   }}
                    // />
                    "---"}
              </p>
            </div>
            <div className=" flex items-center gap-[4px] pr-[32px] pt-[24px]">
              {/* <input type="checkbox" id="approvalRules" name={"approvalRules"} /> */}
              <input
                type={"checkbox"}
                name={"approvalRules"}
                checked={isoApproval}
                onChange={
                  () => {
                    setIsoApproval(!isoApproval);
                    formik.setFieldValue(
                      "approvalRules",
                      !formik.values.approvalRules,
                    );
                  }
                  // (formik.values.approvalRules = !formik.values.approvalRules)
                }
                className="ml-1 h-4 w-4"
                id={"approvalRules"}
              />
              <label
                htmlFor="approvalRules"
                className={`text-[16px] font-bold text-error ${formik.isValid && isoApproval ? "text-typography-gray" : ""}`}
              >
                من همه موارد بالا را با دقت خوانده و شرایط را قبول میکنم.
              </label>
            </div>
          </Card>
          <div className="flex flex-col-reverse justify-end pt-3 sm:flex-row sm:py-7">
            {router.query.action === "add" ? (
              <>
                <Button
                  className="my-2 w-full sm:my-auto sm:w-auto"
                  startIcon={
                    <SvgIcon
                      fillColor={"primary"}
                      className={"[&_svg]:h-[18px] [&_svg]:w-[18px]"}
                    >
                      <IcCardList />
                    </SvgIcon>
                  }
                  variant="outline"
                  onClick={() => {
                    router.query.step = "6";
                    router.push(router);
                  }}
                >
                  آزمون‌های ثبت شده
                </Button>
                <Button
                  className="my-2 w-full sm:mx-5 sm:my-auto sm:w-auto"
                  startIcon={
                    <SvgIcon
                      fillColor={"primary"}
                      className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
                    >
                      <IcArrowRight />
                    </SvgIcon>
                  }
                  variant="outline"
                  type="button"
                  onClick={() => {
                    router.query.step = (
                      Number(router.query.step) - 1
                    ).toString();
                    router.push(router);
                  }}
                >
                  انتخاب پارامتر
                </Button>
              </>
            ) : (
              <Button
                className="my-2 w-full sm:mx-5 sm:my-auto sm:w-auto"
                startIcon={
                  <SvgIcon
                    fillColor={"primary"}
                    className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
                  >
                    <IcArrowRight />
                  </SvgIcon>
                }
                variant="outline"
                type="button"
                onClick={() => {
                  router.query.step = (
                    Number(router.query.step) - 1
                  ).toString();
                  router.push(router);
                }}
              >
                انتخاب پارامتر
              </Button>
            )}
            <Button
              type={"submit"}
              disabled={!formik.isValid}
              variant="solid"
              color="primary"
              className="my-2 w-full sm:my-auto sm:w-auto"
              endIcon={
                <SvgIcon
                  fillColor={"white"}
                  className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
                >
                  <IcArrowLeft />
                </SvgIcon>
              }
            >
              ورود اطلاعات نمونه
            </Button>
          </div>
        </>
      )}
    </FormHandler>
  );
};

export default ApprovalRules;
