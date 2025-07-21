import React, { useState } from "react";
import router, { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";

import { Card } from "@kit/card";
import { FBLoader } from "../../../../../../module/form-builder/loader";
import { apiFormResponse } from "@api/service/form-response";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcArrowRight, IcCardList, IcClose } from "@feature/kits/common/icons";
import { FormJsonType } from "@api/service/form-response/type";
import { FBElementProp } from "@module/form-builder/type/sample";
import { Fab } from "@kit/fab";

interface FormProps {
  click: () => void;
  json: FBElementProp[] | string;
  requestId: number;
  closed?: () => void;
}

const Form: React.FC<FormProps> = ({ click, json, requestId, closed }) => {
  const router = useRouter();
  // check if button is clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  // form response create api
  const { mutateAsync } = useMutation(apiFormResponse(true).create());
  // add new sample
  const addSample = (json: FBElementProp[], values: any, requestId: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const responseJson = json.map((item) => {
      const value = values[item.name ?? ""];
      if (value !== undefined) {
        return { ...item, value };
      }
      return item;
    });
    mutateAsync({
      response_json: responseJson,
      response: "",
      request: requestId,
      is_main: true,
    })
      .then((res) => {
        click();
        setIsSubmitting(false);
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
  };
  return (
    <>
      <Card
        color="info"
        className="w-full px-5 pb-[56px] pt-[46px] md:px-[64px]"
      >
        <p className="mb-6 text-[14px]">
          لطفا اطلاعات نمونه‌ مورد نظر را وارد کنید.
          {!closed && (
            <span>
              {" "}
              درصورتی که بیش از یک نمونه دارید، پس از ثبت اولین نمونه، اطلاعات
              نمونه‌های بعدی را وارد کنید.
            </span>
          )}
        </p>
        <Card
          color="white"
          className="relative items-center justify-center p-[24px]"
        >
          <FBLoader
            jsonFB={json as FBElementProp[]}
            submitFB={(values) => {
              addSample(json as FBElementProp[], values, requestId);
            }}
          />
        </Card>
        <div className="mt-5 flex justify-end">
          {closed && (
            <Button variant="outline" onClick={closed}>
              بازگشت به لیست نمونه‌ها
            </Button>
          )}
        </div>
      </Card>
      <div className="flex flex-col justify-end pt-3 sm:flex-row sm:py-7">
        {router.query.action === "add" && (
          <Button
            className="my-2 w-full sm:mx-5 sm:my-auto sm:w-auto"
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
        )}
        <Button
          className="my-2 w-full sm:my-auto sm:w-auto"
          startIcon={
            <SvgIcon
              fillColor={"primary"}
              className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
            >
              <IcArrowRight />
            </SvgIcon>
          }
          variant="outline"
          onClick={() => {
            router.query.step = (Number(router.query.step) - 1).toString();
            router.push(router);
          }}
        >
          شرایط و قوانین
        </Button>
      </div>
    </>
  );
};

export default Form;
