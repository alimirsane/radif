import * as yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { apiUser } from "@api/service/user";
import { PersianCalendar } from "../../../../../../kits/calendar";
import { useModalHandler } from "@utils/modal-handler/config";
import { IcClose, IcCheck, IcChevronDown } from "@feature/kits/common/icons";
import { apiGrantRequest } from "@api/service/grant-request";
import { validation } from "@utils/form-handler/validation";
import { FormHandler } from "@utils/form-handler";
import { Input } from "@kit/input";
import { useRouter } from "next/router";
import { apiGrantRecord } from "@api/service/grant-record";
import { Select } from "@kit/select";
import { DateHandler } from "@utils/date-handler";

interface GrantRequestFormType {
  approved_amount: number | undefined;
  grantId: string;
}

const Granted = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // close modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get grant request details from modal
  const grantRequest = useModalHandler((state) => state.modalData);
  // get current user data
  const { data: user } = useQuery({
    ...apiUser().me(),
  });
  // form initial values
  const initialValues = useMemo(() => {
    return {
      // grantId: "",
      approved_amount: grantRequest.requested_amount,
    };
  }, [grantRequest]);
  // form validation
  const grantValidationSchema = useMemo(() => {
    return yup.object({
      // grantId: validation.requiredInput,
      // approved_amount: validation.requiredInput,
      approved_amount: yup
        .number()
        .required("این فیلد اجباریست")
        .positive("مبلغ باید عددی مثبت باشد")
        .min(0, "مبلغ باید عددی مثبت باشد")
        .integer("مبلغ باید یک عدد صحیح باشد"),
    });
  }, []);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const GetDate = (expiration_date: string) => {
    const date = new Date(expiration_date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
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
  const grantRecordsList = useMemo(() => {
    return grantRecords?.data.map(({ id, title }) => ({
      value: id.toString(),
      name: title,
    }));
  }, [grantRecords?.data]);
  // approve grant request api
  const { mutateAsync } = useMutation(
    apiGrantRequest(true, {
      success: "اعطای گرنت موفقیت آمیز بود",
      fail: "اعطای گرنت انجام نشد",
      waiting: "در حال انتظار",
    }).approveGrant(grantRequest.id),
  );
  // POST
  const submitGrantRequest = (values: { approved_amount: number }) => {
    const data = {
      approved_amount: values.approved_amount ?? 0,
      approved_grant_record: selectedItem,
      // approved_grant_record: Number(values.grantId),
      // expiration_date: values.expiration_date
      //   ? GetDate(values.expiration_date)
      //   : grantRequest.expiration_date,
    };
    mutateAsync(data)
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
      className="flex max-h-[95vh] w-[95vw] flex-col overflow-y-auto px-8 py-4 md:w-[65vw] lg:max-h-[90vh] lg:w-[75vw] lg:pb-10 lg:pt-8"
    >
      <div className="flex flex-row items-center justify-between lg:mb-5">
        <h6 className="text-[22px] font-[700]">اعطای گرنت</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      {/* <Card
        color={"paper"}
        className={
          "my-8 p-[24px] text-center text-[16px] font-semibold text-typography-main"
        }
      >
        گرنت شما:
        {user?.data.research_grant !== undefined
          ? ` ${user?.data.research_grant.toLocaleString()}`
          : " -"}
        <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
      </Card> */}

      <div className="grid gap-5 overflow-y-auto py-5 lg:grid-cols-2">
        <p className="text-[13px] font-bold lg:col-span-2">
          گرنت موردنظر خود را انتخاب کنید.
        </p>
        {grantRecords?.data.length === 0 && (
          <Card color={"info"} className="w-full">
            <p className="p-[16px] text-center text-[14px]">گرنتی یافت نشد</p>
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
                    <span className="mr-1 text-[13px] font-[400]">(ریال)</span>
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
                    <h6 className="text-[14px] font-[400]">مبلغ باقیمانده</h6>
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
      <div className="flex flex-col pt-6">
        <FormHandler
          validationSchema={grantValidationSchema}
          initialValues={initialValues}
          handleSubmit={(values, utils) => {
            submitGrantRequest(values);
          }}
        >
          {(formik) => (
            <div className="grid grid-cols-2 items-center">
              <p className="col-span-2 mb-4 text-[13px] font-bold lg:col-span-2">
                مبلغ گرنت اعطایی را وارد کنید. (می‌توانید مقدار گرنت را تغییر
                دهید.)
              </p>
              <div className={`col-span-2 lg:col-span-1`}>
                <Input
                  name={"approved_amount"}
                  formik={formik}
                  autoComplete={"approved_amount"}
                  placeholder="مقدار گرنت اعطایی را وارد کنید"
                  label={"مقدار گرنت"}
                  type="number"
                  style={{
                    direction: formik.values["approved_amount"] ? "ltr" : "rtl",
                  }}
                />
                {formik.values.approved_amount && (
                  <span className="text-[12px] text-typography-secondary">
                    {(
                      Number(formik.values.approved_amount) / 10
                    )?.toLocaleString()}{" "}
                    تومان
                  </span>
                )}
                {/* <p className="mt-[8px] text-[12px] text-typography-secondary">
                  * شما می‌توانید مبلغ گرنت اعطایی را تغییر دهید.
                </p> */}
              </div>
              {/* <div className={`col-span-2 lg:col-span-1`}> */}
              {/* <PersianCalendar
                name={"expiration_date"}
                formik={formik}
                autoComplete={"expiration_date"}
                placeholder="حداکثر تاریخ قابل استفاده برای دانشجو را وارد کنید"
                label={"تاریخ انقضا گرنت"}
              /> */}
              {/* <Select
                options={grantRecordsList ?? []}
                name={"grantId"}
                label={"نام گرنت"}
                formik={formik}
                holder={(activeItem) => (
                  <Card
                    variant={"outline"}
                    className={
                      "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
                    }
                  >
                    <span
                      className={
                        activeItem
                          ? "text-typography-main"
                          : "text-[13px] text-typography-secondary"
                      }
                    >
                      {activeItem?.name ?? "گرنت را انتخاب کنید"}
                    </span>

                    <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                      <IcChevronDown />
                    </SvgIcon>
                  </Card>
                )}
                searchOn={"name"}
                placeholder="جستجو کنید"
              >
                {(item, activeItem) => (
                  <Button
                    className={"w-full"}
                    variant={
                      item?.value === activeItem?.value ? "solid" : "text"
                    }
                    color={"primary"}
                  >
                    {item?.name}
                  </Button>
                )}
              </Select> */}
              {/* </div> */}
              <div className="col-span-2 flex justify-end lg:col-span-1">
                <Button
                  type="submit"
                  variant="solid"
                  color="primary"
                  className="w-full sm:w-auto"
                  disabled={
                    !formik.isValid ||
                    selectedItem === 0 ||
                    Number(formik.values.approved_amount) >
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
                  اعطای گرنت
                </Button>
              </div>

              {Number(formik.values.approved_amount) >
                Number(
                  grantRecords?.data?.find((type) => type.id === selectedItem)
                    ?.remaining_grant,
                ) && (
                <p className="mt-2 text-[12px] text-error">
                  مبلغ گرنت درخواستی بیشتر از مبلغ باقیمانده گرنت انتخابی
                  می‌باشد.
                </p>
              )}
            </div>
          )}
        </FormHandler>
      </div>
    </Card>
  );
};

export default Granted;
