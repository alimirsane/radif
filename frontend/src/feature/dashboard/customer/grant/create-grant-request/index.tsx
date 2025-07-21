import React, { useMemo, useState } from "react";
import * as yup from "yup";
import { FormHandler } from "@utils/form-handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Select } from "@kit/select";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcCheck, IcChevronDown } from "@feature/kits/common/icons";
import { validation } from "@utils/form-handler/validation";
import { apiUser } from "@api/service/user";
import { apiGrantRequest } from "@api/service/grant-request";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { GrantStatusType } from "@api/service/grant-request/type/grant-status-type";

interface GrantRequestFormType {
  requested_amount: string | undefined;
  receiver: number | undefined;
}
const CreateGrantRequest = () => {
  const clientQuery = useQueryClient();
  // form initial values
  const initialValues = useMemo(() => {
    return {
      receiver: undefined,
      requested_amount: "",
    };
  }, []);
  // form validation
  const ParameterInfoValidationSchema = useMemo(() => {
    return yup.object({
      receiver: validation.requiredInput,
      requested_amount: validation.requiredInput,
    });
  }, []);

  // get professors list
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
      professors?.data?.map(({ id, first_name, last_name }) => ({
        value: id.toString(),
        name: `${first_name} ${last_name}`,
      })) || []
    );
  }, [professors]);

  // get current user data
  const { data: user } = useQuery({
    ...apiUser().me(),
  });

  // current date
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return `${year}-${month}-${day}`;
  };
  // create grant request api
  const { mutateAsync } = useMutation(
    apiGrantRequest(true, {
      success: "ثبت درخواست گرنت موفقیت آمیز بود",
      fail: "درخواست گرنت انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
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
      receiver: Number(values.receiver),
    };
    mutateAsync(data)
      .then((res) => {
        // refetch grant requests list
        clientQuery.invalidateQueries({
          queryKey: [apiGrantRequest().url],
        });
      })
      .catch((err) => {});
  };
  return (
    <FormHandler
      validationSchema={ParameterInfoValidationSchema}
      className="pt-7"
      initialValues={initialValues}
      handleSubmit={(values, utils) => {
        utils.resetForm();
        createGrantRequest(values);
      }}
    >
      {(formik) => (
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className={`w-full lg:w-[41%]`}>
            <Input
              name={"requested_amount"}
              formik={formik}
              autoComplete={"requested_amount"}
              placeholder="میزان اعتبار درخواستی خود را وارد کنید"
              label={"میزان اعتبار"}
              type="number"
              style={{
                direction: formik.values["requested_amount"] ? "ltr" : "rtl",
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
          </div>
          <div className={`w-full lg:w-[41%]`}>
            <Select
              options={professorsList ?? []}
              name={"receiver"}
              label={"نام استاد"}
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
                    {activeItem?.name ?? "استاد موردنظر خود را انتخاب کنید"}
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
                  variant={item?.value === activeItem?.value ? "solid" : "text"}
                  color={"primary"}
                >
                  {item?.name}
                </Button>
              )}
            </Select>
          </div>
          <div className="w-full pt-2 lg:w-[18%] lg:pt-8">
            <Button
              type="submit"
              variant="solid"
              color="primary"
              className="w-full"
              disabled={!formik.isValid}
              startIcon={
                <SvgIcon
                  strokeColor={"white"}
                  className={"[&_svg]:h-[15px] [&_svg]:w-[15px]"}
                >
                  <IcCheck />
                </SvgIcon>
              }
            >
              ثبت درخواست گرنت
            </Button>
          </div>
        </div>
      )}
    </FormHandler>
  );
};

export default CreateGrantRequest;
