import * as yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { apiUser } from "@api/service/user";
import { useModalHandler } from "@utils/modal-handler/config";
import { IcClose, IcCheck } from "@feature/kits/common/icons";
import { apiGrantRequest } from "@api/service/grant-request";
import { FormHandler } from "@utils/form-handler";
import { Input } from "@kit/input";
import { useRouter } from "next/router";
import { apiGrantRecord } from "@api/service/grant-record";
import { DateHandler } from "@utils/date-handler";
import { GrantStatusType } from "@api/service/grant-request/type/grant-status-type";

interface GrantRequestFormType {
  requested_amount: string | undefined;
}

const GrantSelfAssignment = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // close modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get current user data
  const { data: user } = useQuery({
    ...apiUser().me(),
  });
  // form initial values
  const initialValues = useMemo(() => {
    return {
      requested_amount: undefined,
    };
  }, []);
  // form validation
  const grantValidationSchema = useMemo(() => {
    return yup.object({
      // grantId: validation.requiredInput,
      // requested_amount: validation.requiredInput,
      requested_amount: yup
        .number()
        .required("این فیلد اجباریست")
        .positive("مبلغ باید عددی مثبت باشد")
        .min(0, "مبلغ باید عددی مثبت باشد")
        .integer("مبلغ باید یک عدد صحیح باشد"),
    });
  }, []);

  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [grantRequestId, setGrantRequestId] = useState<number>(0);
  const [grantRequestedAmount, setGrantRequestedAmount] = useState<number>(0);

  // get grant request data
  const {
    data: grantRecords,
    isLoading: grantRecordsLoading,
    refetch,
  } = useQuery(apiGrantRecord().getAll());
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // current date
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${year}-${month}-${day}`;
  };
  // create grant request api
  const { mutateAsync: createGrant } = useMutation(
    apiGrantRequest(false).create(),
  );
  // POST
  const createGrantRequest = (values: GrantRequestFormType) => {
    const data = {
      requested_amount: values.requested_amount ?? "0",
      approved_amount: 0,
      approved_datetime: `${getCurrentDate()}T00:00:00+03:30`,
      datetime: `${getCurrentDate()}T00:00:00+03:30`,
      expiration_date: getCurrentDate(),
      status: GrantStatusType.SENT,
      sender: user?.data.id ?? -1,
      receiver: user?.data.id ?? -1,
    };
    createGrant(data)
      .then((res) => {
        setGrantRequestId(res?.data?.id ?? -1);
        setGrantRequestedAmount(Number(res?.data?.requested_amount));
      })
      .catch((err) => {});
  };
  useEffect(() => {
    if (grantRequestId > 0) {
      submitGrantRequest(grantRequestedAmount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantRequestId, grantRequestedAmount]);
  // approve grant request api
  const { mutateAsync: submitGrant } = useMutation(
    apiGrantRequest(true, {
      success: "تخصیص گرنت موفقیت آمیز بود",
      fail: "تخصیص گرنت انجام نشد",
      waiting: "در حال انتظار",
    }).approveGrant(grantRequestId.toString()),
  );
  // POST
  const submitGrantRequest = (requested_amount: number) => {
    const data = {
      approved_amount: requested_amount ?? 0,
      approved_grant_record: selectedItem,
    };
    submitGrant(data)
      .then((res) => {
        hideModal();
        // refetch grant requests list
        clientQuery.invalidateQueries({
          queryKey: [apiGrantRequest().url],
        });
        clientQuery.invalidateQueries({
          queryKey: [apiGrantRecord().url],
        });
      })
      .catch((err) => {});
  };

  return (
    <Card
      color={"white"}
      className="flex max-h-[95vh] w-[95vw] flex-col overflow-y-auto px-8 py-4 md:w-[65vw] lg:max-h-[90vh] lg:w-[75vw] lg:py-8"
    >
      <div className="flex flex-row items-center justify-between lg:mb-5">
        <h6 className="text-[22px] font-[700]">تخصیص گرنت به خود</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <div>
        <FormHandler
          validationSchema={grantValidationSchema}
          initialValues={initialValues}
          handleSubmit={(values, utils) => {
            createGrantRequest(values);
          }}
        >
          {(formik) => (
            <div className="flex w-full flex-col">
              <div className="w-full md:w-1/2 md:pl-[10px]">
                <p className="mb-5 mt-1 text-[14px]">
                  گرنت موردنظر و مبلغ گرنت تخصیصی را وارد کنید.
                </p>
                <Input
                  name={"requested_amount"}
                  formik={formik}
                  autoComplete={"requested_amount"}
                  placeholder="مقدار گرنت تخصیصی را وارد کنید"
                  label={"مقدار گرنت"}
                  type="number"
                  style={{
                    direction: formik.values["requested_amount"]
                      ? "ltr"
                      : "rtl",
                  }}
                />
                {formik.values.requested_amount && (
                  <span className="text-[12px] text-typography-secondary">
                    {(
                      Number(formik.values.requested_amount) / 10
                    )?.toLocaleString()}{" "}
                    تومان
                  </span>
                )}

                {Number(formik.values.requested_amount) >
                  Number(
                    grantRecords?.data?.find((type) => type.id === selectedItem)
                      ?.remaining_grant,
                  ) && (
                  <p className="mt-2 text-[12px] text-error">
                    مبلغ گرنت تخصیصی بیشتر از مبلغ باقیمانده گرنت انتخابی
                    می‌باشد.
                  </p>
                )}
              </div>

              <div className="grid gap-5 overflow-y-auto py-5 lg:grid-cols-2">
                {grantRecords?.data.length === 0 && (
                  <Card color={"info"} className="w-full">
                    <p className="p-[16px] text-center text-[14px]">
                      گرنتی یافت نشد
                    </p>
                  </Card>
                )}
                {grantRecords?.data.length !== 0 &&
                  grantRecords?.data.map((item, index) => (
                    <Card
                      key={index}
                      color="info"
                      onClick={() => setSelectedItem(item.id)}
                      className={`flex w-full cursor-pointer flex-col gap-4 px-4 pb-5 pt-4 lg:flex-row lg:items-center lg:pb-4 ${selectedItem === item.id ? " border border-info bg-opacity-[3%]" : "bg-opacity-5"}`}
                    >
                      <div className="hidden w-[3%] pb-1 lg:block">
                        {/* checkbox for lg size */}
                        <input
                          type="checkbox"
                          color="primary"
                          name={`grant${index}`}
                          className="h-5 w-5 text-primary"
                          checked={selectedItem === item.id}
                          onChange={() => setSelectedItem(item.id)}
                        ></input>
                      </div>
                      <div className="flex w-full flex-col gap-[18px] lg:w-[52%]">
                        <span className="flex-grow overflow-hidden text-[15px] font-bold">
                          {item.title}
                        </span>
                        <div className="flex w-full flex-row flex-wrap justify-start overflow-hidden text-[14px]">
                          تاریخ انقضا:
                          <span className="mr-1 font-[500]">
                            {DateHandler.formatDate(item.expiration_date, {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 lg:w-[45%]">
                        <div className="flex w-full flex-row flex-wrap justify-end overflow-hidden px-4 text-[15px]">
                          {/* مبلغ گرنت: */}
                          <span className="font-bold text-typography-gray">
                            {Number(item.amount).toLocaleString()}
                            <span className="mr-1 text-[13px] font-[400]">
                              (ریال)
                            </span>
                          </span>
                        </div>
                        <div className="flex w-full flex-row items-center rounded-[8px] bg-background-paper-dark bg-opacity-70 px-4 py-2">
                          {/* checkbox for sizes smaller than lg */}

                          <input
                            type="checkbox"
                            name={`grant${index}`}
                            checked={selectedItem === item.id}
                            onChange={() => setSelectedItem(item.id)}
                            className="ml-2 h-5 w-5 lg:hidden"
                          ></input>
                          <div className="flex w-full flex-row flex-wrap items-center justify-between">
                            <h6 className="text-[14px] font-[400]">
                              مبلغ باقیمانده
                            </h6>
                            <span className={`text-[16px] font-[600]`}>
                              {Number(item.remaining_grant).toLocaleString()}
                              <span className="mr-1 text-[13px] font-[400]">
                                (ریال)
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="solid"
                  color="primary"
                  className="w-full sm:w-auto"
                  disabled={
                    !formik.isValid ||
                    selectedItem === 0 ||
                    Number(formik.values.requested_amount) >
                      Number(
                        grantRecords?.data?.find(
                          (type) => type.id === selectedItem,
                        )?.remaining_grant,
                      )
                  }
                  startIcon={
                    <SvgIcon
                      strokeColor={"white"}
                      className={"[&_svg]:h-[15px] [&_svg]:w-[15px]"}
                    >
                      <IcCheck />
                    </SvgIcon>
                  }
                >
                  تخصیص گرنت
                </Button>
              </div>
            </div>
          )}
        </FormHandler>
      </div>
    </Card>
  );
};

export default GrantSelfAssignment;
