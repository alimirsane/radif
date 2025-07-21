import * as yup from "yup";
import { useMemo } from "react";
import { useRouter } from "next/router";

import { IcCheck, IcChevronDown, IcClose } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { Input } from "@kit/input";
import { SvgIcon } from "@kit/svg-icon";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { useModalHandler } from "@utils/modal-handler/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Select } from "@kit/select";
import { apiGrantRecord } from "@api/service/grant-record";
import { apiUser } from "@api/service/user";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { UserType } from "@api/service/user/type/user-type";
import { GrantRecordType } from "@api/service/grant-record/type";
import { PersianCalendar } from "@kit/calendar";

const CreateGrant = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // form initial values
  const initialValues = useMemo(() => {
    return {
      title: "",
      amount: undefined,
      receiver: undefined,
      expiration_date: "",
    };
  }, []);
  const GrantInfoValidationSchema = useMemo(() => {
    return yup.object({
      title: validation.requiredInput,
      amount: validation.requiredInput,
      receiver: validation.requiredInput,
      expiration_date: validation.requiredInput,
    });
  }, []);
  // convert date
  const GetDate = (expiration_date: string) => {
    const date = new Date(expiration_date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  // current date
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${year}-${month}-${day}`;
  };
  // const { data: professors } = useQuery({
  //   ...apiUser().getAllPublicStaffs({
  //     role: 10,
  //   }),
  // });
  const { data: professors } = useQuery({
    ...apiUser().getAllTeachers(),
  });
  const professorsList = useMemo(() => {
    return (
      professors?.data
        // ?.filter((customer) => customer?.user_type === UserType.CUSTOMER)
        ?.map(({ id, first_name, last_name, national_id }) => ({
          value: id.toString(),
          name: `${first_name} ${last_name} - ${national_id}`,
        })) || []
    );
  }, [professors]);

  // grant create api
  const { mutateAsync } = useMutation(
    apiGrantRecord(true, {
      success: "ثبت گرنت موفقیت آمیز بود",
      fail: "افزودن گرنت انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
  );
  // submit grant form
  const submitGrant = (
    values: Pick<
      GrantRecordType,
      "title" | "amount" | "receiver" | "expiration_date"
    >,
  ) => {
    const data = {
      title: values.title,
      amount: values.amount,
      receiver: values.receiver,
      created_at: `${getCurrentDate()}T00:00:00+03:30`,
      expiration_date: values.expiration_date
        ? GetDate(values.expiration_date)
        : getCurrentDate(),
      // expiration_date: `${getCurrentDate()}`,
    };
    mutateAsync(data)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiGrantRecord().url],
        });
        // close modal
        hideModal();
      })
      .catch((err) => {});
  };
  return (
    <Card
      color={"white"}
      className="flex max-h-[95vh] w-[95vw] flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[60vw]"
    >
      <div className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[18px] font-bold">افزودن گرنت</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <FormHandler
        validationSchema={GrantInfoValidationSchema}
        className="overflow-y-auto"
        initialValues={initialValues}
        handleSubmit={(values, utils) => {
          submitGrant(values);
        }}
      >
        {(formik) => (
          <div className="grid grid-cols-1 gap-10 text-right md:grid-cols-2">
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"title"}
                formik={formik}
                autoComplete={"title"}
                placeholder="نام گرنت خود را وارد کنید"
                label={"نام گرنت"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Select
                options={professorsList ?? []}
                name={"receiver"}
                label={"دریافت کننده"}
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
                      {activeItem?.name ?? "دریافت کننده را انتخاب کنید"}
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
              </Select>
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"amount"}
                formik={formik}
                autoComplete={"amount"}
                placeholder="مقدار گرنت را وارد کنید"
                label={"مقدار"}
                type="number"
                style={{
                  direction: formik.values["amount"] ? "ltr" : "rtl",
                }}
              />
              {formik.values.amount && (
                <span className="text-[12px] text-typography-secondary">
                  {(Number(formik.values.amount) / 10)?.toLocaleString()} تومان
                </span>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <PersianCalendar
                name={"expiration_date"}
                formik={formik}
                autoComplete={"expiration_date"}
                placeholder="تاریخ انقضا گرنت را وارد کنید"
                label={"تاریخ انقضا"}
                calendarOptions={{
                  minDate: Date.now(),
                }}
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <Button
                type="submit"
                variant="solid"
                color="primary"
                className="w-full sm:w-auto"
                disabled={!formik.isValid}
                startIcon={
                  <SvgIcon
                    strokeColor="white"
                    className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
                  >
                    <IcCheck />
                  </SvgIcon>
                }
              >
                ثبت گرنت
              </Button>
            </div>
          </div>
        )}
      </FormHandler>
    </Card>
  );
};
export default CreateGrant;
