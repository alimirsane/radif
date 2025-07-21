import { FormHandler } from "@utils/form-handler";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { useModalHandler } from "@utils/modal-handler/config";
import { validation } from "@utils/form-handler/validation";
import { Input } from "@kit/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import {
  IcCheckCircle,
  IcClose,
  IcCloseCircle,
  IcQuestionCircle,
} from "@feature/kits/common/icons";
import * as yup from "yup";
import { apiRequest } from "@api/service/request";
import { TextArea } from "@kit/text-area";
import { useMemo } from "react";
import Badge from "@feature/kits/badge";
import { DateHandler } from "@utils/date-handler";
import { RequestType } from "@api/service/request/type";

const RequestLabsnetDiscount = () => {
  const hideModal = useModalHandler((state) => state.hideModal);

  // get payment record id
  const request = useModalHandler((state) => state.modalData);
  const getLabsnetStatus = (status: number | undefined) => {
    switch (status) {
      case 1:
        return (
          <>
            <SvgIcon
              fillColor={"info"}
              className={"mt-[4px] [&_svg]:h-[14px] [&_svg]:w-[14px]"}
            >
              <IcQuestionCircle />
            </SvgIcon>
            <span>ثبت نشده</span>
          </>
        );
      case 2:
        return (
          <>
            <SvgIcon
              fillColor={"success"}
              className={"mt-[4px] [&_svg]:h-[14px] [&_svg]:w-[14px]"}
            >
              <IcCheckCircle />
            </SvgIcon>
            <span>ثبت موفق</span>
          </>
        );
      case 3:
        return (
          <>
            <SvgIcon
              fillColor={"error"}
              className={"mt-[4px] [&_svg]:h-[14px] [&_svg]:w-[14px]"}
            >
              <IcCloseCircle />
            </SvgIcon>
            <span>ثبت ناموفق</span>
          </>
        );
      default:
        return null;
    }
  };
  const initialValues = useMemo(() => {
    return {
      labsnet_discount_1: undefined,
      // labsnet_discount_2: undefined,
      labsnet_description: "",
    };
  }, []);
  const createDiscountValidation = (isRequired: boolean, maxPrice: number) => {
    let schema = yup
      .number()
      .positive("گرنت لبزنت باید عددی مثبت باشد")
      .min(0, "گرنت لبزنت باید عددی مثبت باشد")
      .integer("باید یک عدد صحیح باشد")
      .max(
        maxPrice,
        `گرنت لبزنت می‌تواند حداکثر ${maxPrice.toLocaleString()} ریال باشد`,
      );

    if (isRequired) {
      schema = schema.required("این فیلد اجباریست");
    }

    return schema;
  };

  const validationSchema = yup.object({
    // labsnet_description: validation.requiredInput,
    labsnet_discount_1: createDiscountValidation(true, Number(request?.price)),
    // labsnet_discount_2: createDiscountValidation(
    //   !!request?.labsnet_code2 && request?.labsnet_code2?.length !== 0,
    //   Number(request?.price),
    // ),
  });
  const clientQuery = useQueryClient();
  // submit labsnet discount
  const { mutateAsync: completeRequest } = useMutation(
    apiRequest(true, {
      success: "اعمال گرنت لبزنت موفقیت آمیز بود",
      fail: "اعمال گرنت لبزنت انجام نشد",
      waiting: "در حال انتظار",
    }).submitLabsnetDiscount(request?.requestId),
  );
  const submit = (values: {
    labsnet_discount_1: number | undefined;
    // labsnet_discount_2: number | undefined;
    labsnet_description: string;
  }) => {
    const data = {
      // labsnet_discount: (
      //   Number(values.labsnet_discount_1) +
      //   (!!values.labsnet_discount_2 ? Number(values.labsnet_discount_2) : 0)
      // ).toString(),
      labsnet_discount: values.labsnet_discount_1?.toString(),
      labsnet_description: values.labsnet_description,
    };
    completeRequest(data)
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
      className="2xl:w-[30vw] max-h-[95vh] w-[90vw] overflow-y-auto px-8 pb-7 pt-6 sm:w-[60vw] xl:max-h-[95vh] xl:w-[40vw]"
    >
      <span className="mb-6 flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">گرنت لبزنت</h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <div className="mb-6 border-b border-background-paper-dark pb-8">
        <h6 className="pb-2 text-[18px] font-[600] text-common-gray">
          گرنت‌های لبزنت درخواستی:
        </h6>
        {request?.labsnet ? (
          // <div className="flex flex-col gap-6">
          //   <Input
          //     name="labsnetGrant1"
          //     value={
          //       request?.labsnet_code1?.length !== 0
          //         ? request?.labsnet_code1
          //         : "گرنتی ثبت نشده است"
          //     }
          //     label="گرنت اول"
          //     className="bg-background-paper"
          //     disabled
          //   />
          //   <Input
          //     name="labsnetGrant2"
          //     value={
          //       request?.labsnet_code2?.length !== 0
          //         ? request?.labsnet_code2
          //         : "گرنتی ثبت نشده است"
          //     }
          //     label="گرنت دوم"
          //     className="bg-background-paper"
          //     disabled
          //   />
          // </div>
          <div className="flex flex-col gap-6">
            {request?.labsnet1_obj &&
              Object.keys(request?.labsnet1_obj).length > 0 && (
                <Card
                  color="white"
                  variant="outline"
                  className={`flex w-full cursor-pointer flex-col gap-4 px-4 py-5 md:items-center md:pb-4`}
                >
                  <div className="flex w-full flex-row">
                    <span className="flex flex-row items-center gap-2">
                      <span className="flex flex-grow flex-row items-center gap-2 overflow-hidden text-[15px] font-bold">
                        {request?.labsnet1_obj?.title}
                      </span>
                    </span>
                  </div>
                  <div className="flex w-full flex-col md:flex-row">
                    <div className="flex w-full flex-col gap-[14px] md:w-[50%] md:pt-[2px]">
                      <span className="flex flex-row items-center gap-2">
                        <span className="flex flex-grow flex-row items-center gap-2 overflow-hidden text-[14px]">
                          میزان تخفیف:
                          <Badge
                            color="primary"
                            className="bg-opacity-15 px-3 pt-[6px] text-[13px] font-bold text-primary"
                          >
                            {request?.labsnet1_obj?.percent}%
                          </Badge>
                        </span>
                      </span>
                      <div className="flex w-full flex-row flex-wrap justify-start gap-1 overflow-hidden text-[14px]">
                        تاریخ انقضا:
                        <span className="font-[500]">
                          {DateHandler.formatDate(
                            request?.labsnet1_obj?.end_date,
                            {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="md:pt-auto flex flex-col gap-2 md:w-[50%]">
                      <div className="flex w-full flex-row flex-wrap gap-1 overflow-hidden pb-1 text-[15px] md:justify-end md:gap-0 md:px-4">
                        <span className="md:hidden">مبلغ گرنت: </span>
                        <span className="font-bold text-typography-secondary">
                          {request?.labsnet1_obj?.amount}
                          <span className="mr-1 text-[13px] font-[400]">
                            (ریال)
                          </span>
                        </span>
                      </div>
                      <div className="flex w-full flex-row items-center rounded-[8px] bg-background-paper bg-opacity-80 px-4 py-2">
                        <div className="flex w-full flex-row flex-wrap items-center justify-between">
                          <h6 className="text-[14px] font-[400]">
                            مبلغ باقیمانده
                          </h6>
                          <span className={`text-[16px] font-[600]`}>
                            {request?.labsnet1_obj?.remain}
                            <span className="mr-1 text-[13px] font-[400]">
                              (ریال)
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            {request?.labsnet2_obj &&
              Object.keys(request?.labsnet2_obj).length > 0 && (
                <Card
                  color="white"
                  variant="outline"
                  className={`flex w-full cursor-pointer flex-col gap-4 px-4 py-5 md:items-center md:pb-4`}
                >
                  <div className="flex w-full flex-row">
                    <span className="flex flex-row items-center gap-2">
                      <span className="flex flex-grow flex-row items-center gap-2 overflow-hidden text-[15px] font-bold">
                        {request?.labsnet2_obj?.title}
                      </span>
                    </span>
                  </div>
                  <div className="flex w-full flex-col md:flex-row">
                    <div className="flex w-full flex-col gap-[14px] md:w-[50%] md:pt-[2px]">
                      <span className="flex flex-row items-center gap-2">
                        <span className="flex flex-grow flex-row items-center gap-2 overflow-hidden text-[14px]">
                          میزان تخفیف:
                          <Badge
                            color="primary"
                            className="bg-opacity-15 px-3 pt-[6px] text-[13px] font-bold text-primary"
                          >
                            {request?.labsnet2_obj?.percent}%
                          </Badge>
                        </span>
                      </span>
                      <div className="flex w-full flex-row flex-wrap justify-start gap-1 overflow-hidden text-[14px]">
                        تاریخ انقضا:
                        <span className="font-[500]">
                          {DateHandler.formatDate(
                            request?.labsnet1_obj?.end_date,
                            {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="md:pt-auto flex flex-col gap-2 md:w-[50%]">
                      <div className="flex w-full flex-row flex-wrap gap-1 overflow-hidden pb-1 text-[15px] md:justify-end md:gap-0 md:px-4">
                        <span className="md:hidden">مبلغ گرنت: </span>
                        <span className="font-bold text-typography-secondary">
                          {request?.labsnet2_obj?.amount}
                          <span className="mr-1 text-[13px] font-[400]">
                            (ریال)
                          </span>
                        </span>
                      </div>
                      <div className="flex w-full flex-row items-center rounded-[8px] bg-background-paper bg-opacity-80 px-4 py-2">
                        <div className="flex w-full flex-row flex-wrap items-center justify-between">
                          <h6 className="text-[14px] font-[400]">
                            مبلغ باقیمانده
                          </h6>
                          <span className={`text-[16px] font-[600]`}>
                            {request?.labsnet2_obj?.remain}
                            <span className="mr-1 text-[13px] font-[400]">
                              (ریال)
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
          </div>
        ) : (
          <Card
            color={"info"}
            className="rounded-[8px] p-[22px] text-center text-[14px]"
          >
            درخواست استفاده از گرنت لبزنت ثبت نشده است.
          </Card>
        )}
      </div>
      <div className="pb-1">
        <h2 className="mb-2 flex flex-row gap-1 text-[18px] font-[600] text-common-gray">
          جزئیات ثبت گرنت لبزنت درخواست
          <span>{request?.request_number}:</span>
        </h2>
        <Card
          className="flex w-full flex-col px-4 pt-4"
          color="white"
          variant="outline"
        >
          <Card
            color="paper"
            className="flex flex-row gap-2 p-3 text-[16px] font-semibold"
          >
            <span className="w-full md:w-[50%]">نام آزمون</span>
            <span className="w-full md:w-[25%]">هزینه آزمون</span>
            <span className="w-full md:w-[25%]">وضعیت ثبت</span>
          </Card>
          {request?.child_requests?.map((child: RequestType, index: number) => (
            <div
              key={index}
              className={`flex flex-row gap-2 ${index !== request?.child_requests?.length - 1 ? "border-b border-paper" : ""} border-opacity-20 px-3 py-4 text-[14px]`}
            >
              <span className="w-full md:w-[50%]">
                {child?.experiment_obj?.name}
              </span>
              <span className="w-full md:w-[25%]">
                {Number(child?.price ?? 0)?.toLocaleString()}
                <span className="mr-1 text-[12px]">(ریال)</span>
              </span>
              <span className="flex w-full flex-row gap-1 md:w-[25%]">
                {getLabsnetStatus(child?.labsnet_status)}
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* <h2 className="mb-2 flex flex-row gap-1 text-[18px] font-[600] text-common-gray">
        ثبت گرنت لبزنت:
      </h2>
      <FormHandler
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={(values, utils) => {
          submit(values);
        }}
      >
        {(formik) => (
          <>
            <div>
              <Input
                name={"labsnet_discount_1"}
                formik={formik}
                autoComplete={"labsnet_discount_1"}
                placeholder="میزان گرنت لبزنت را وارد کنید"
                label={"میزان گرنت"}
                type="number"
                style={{
                  direction: formik.values["labsnet_discount_1"]
                    ? "ltr"
                    : "rtl",
                }}
              />
              {formik.values.labsnet_discount_1 && (
                <span className="text-[12px] text-typography-secondary">
                  {(
                    Number(formik.values.labsnet_discount_1) / 10
                  )?.toLocaleString()}{" "}
                  تومان
                </span>
              )}
            </div> */}
      {/* <div>
              <Input
                name={"labsnet_discount_1"}
                formik={formik}
                autoComplete={"labsnet_discount_1"}
                placeholder="میزان گرنت لبزنت اول را وارد کنید"
                label={"میزان گرنت اول"}
                type="number"
                style={{
                  direction: formik.values["labsnet_discount_1"]
                    ? "ltr"
                    : "rtl",
                }}
              />
              {formik.values.labsnet_discount_1 && (
                <span className="text-[12px] text-typography-secondary">
                  {(
                    Number(formik.values.labsnet_discount_1) / 10
                  )?.toLocaleString()}{" "}
                  تومان
                </span>
              )}
            </div>
            <div className="pt-4">
              <Input
                name={"labsnet_discount_2"}
                formik={formik}
                autoComplete={"labsnet_discount_2"}
                placeholder="میزان گرنت لبزنت دوم را وارد کنید"
                label={"میزان گرنت دوم"}
                type="number"
                style={{
                  direction: formik.values["labsnet_discount_2"]
                    ? "ltr"
                    : "rtl",
                }}
              />
              {formik.values.labsnet_discount_2 && (
                <span className="text-[12px] text-typography-secondary">
                  {(
                    Number(formik.values.labsnet_discount_2) / 10
                  )?.toLocaleString()}{" "}
                  تومان
                </span>
              )}
            </div> */}
      {/* <div className="pt-4">
              <TextArea
                formik={formik}
                name="labsnet_description"
                label={`توضیحات`}
                placeholder={`توضیحات گرنت لبزنت را وارد کنید`}
              />
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => hideModal()}>
                لغو
              </Button>
              <Button type="submit" disabled={!formik.isValid}>
                اعمال گرنت لبزنت
              </Button>
            </div>
          </>
        )}
      </FormHandler> */}
    </Card>
  );
};

export default RequestLabsnetDiscount;
