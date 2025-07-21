import * as yup from "yup";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { Switch } from "@kit/switch";
import { SvgIcon } from "@kit/svg-icon";
import { apiDevice } from "@api/service/device";
import { IcCheck, IcChevronDown } from "@feature/kits/common/icons";
import { PersianCalendar } from "../../../../../../kits/calendar";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { useOperatorLabManagementStepHandler } from "@hook/operator-laboratory-management-steps";
import { Select } from "@kit/select";
import { apiLaboratory } from "@api/service/laboratory";
import { Card } from "@kit/card";
import { apiUser } from "@api/service/user";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { CreateDeviceType } from "@api/service/device/type";
import { TextArea } from "@kit/text-area";

const DeviceInformation = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  const deviceStatesList = useMemo(() => {
    return [
      { value: "operational", name: "سالم" },
      { value: "under_repair", name: "در حال تعمیر" },
      { value: "commissioning", name: "در حال راه‌اندازی" },
      { value: "calibration", name: "در حال کالیبراسیون" },
      { value: "awaiting_budget", name: "در انتظار بودجه برای تعمیر" },
      { value: "decommissioned", name: "به طور کامل از کار افتاده" },
    ];
  }, []);
  const [switchIsChecked, setChecked] = useState<boolean>(true);
  const initialValues = useMemo(() => {
    return {
      laboratory: undefined,
      name: "",
      serial_number: "",
      manufacturer: "",
      country_of_manufacture: "",
      // manager: "",
      commissioning_date: "",
      extra_status: "",
      labsnet_device_id: "",
      labsnet_model_id: "",
      manufacturer_representation: "",
      model: "",
      // purchase_date: "",
      description: "",
      application: "",
      control_code: "",
      accuracy: "",
      // device_code: "",
    };
  }, []);

  const DeviceInfoValidationSchema = useMemo(() => {
    return yup.object({
      laboratory: validation.requiredInput,
      name: validation.requiredInput,
      serial_number: validation.requiredInput,
      manufacturer: validation.requiredInput,
      country_of_manufacture: validation.requiredInput,
      // manager: validation.requiredInput,
      extra_status: validation.requiredInput,
      labsnet_device_id: validation.requiredInput,
      labsnet_model_id: validation.requiredInput,
      model: validation.englishInput,
      application: validation.requiredInput,
      commissioning_date: validation.requiredInput,
      // manufacturer_representation: validation.requiredInput,
      // purchase_date: validation.requiredInput,
      // description: validation.requiredInput,
    });
  }, []);
  // get lab id from state management
  const laboratoryId = useOperatorLabManagementStepHandler(
    (state) => state.laboratoryId,
  );
  // get laboratories list
  const { data: laboratories, isLoading: laboratoriesLoading } = useQuery(
    apiLaboratory().getAll(),
  );
  const laboratoriesList = useMemo(() => {
    // Pick<LaboratoryType, "id" | "name" >
    return laboratories?.data.map(({ id, name }) => ({
      value: id?.toString(),
      name,
    }));
  }, [laboratories?.data]);

  // get operators list
  const { data: operators, isLoading: operatorsLoading } = useQuery(
    apiUser().getAllPublicStaffs({ role: 7 }),
  );

  const operatorsList = useMemo(() => {
    return (
      operators?.data
        ?.filter((operator) => operator?.user_type === "staff")
        ?.map(({ id, first_name, last_name }) => ({
          value: id.toString(),
          name: `${first_name} ${last_name}`,
        })) || []
    );
  }, [operators]);
  // convert date
  const GetDate = (dateInput: string) => {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // device create api
  const { mutateAsync } = useMutation(
    apiDevice(true, {
      success: "ثبت دستگاه انجام شد",
      fail: "ثبت دستگاه انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
  );
  // submit device
  const submitDevice = (values: CreateDeviceType) => {
    // if (laboratoryId) {
    const data = {
      name: values.name,
      model: values.model,
      manufacturer: values.manufacturer,
      purchase_date: "",
      warranty_period: "1",
      serial_number: values.serial_number,
      description: values.description,
      application: values.application,
      status: switchIsChecked ? "active" : "inactive",
      laboratory: values.laboratory,
      country_of_manufacture: values.country_of_manufacture,
      commissioning_date: values.commissioning_date
        ? GetDate(values.commissioning_date)
        : "",
      extra_status: values.extra_status,
      labsnet_device_id: values.labsnet_device_id,
      labsnet_model_id: values.labsnet_model_id,
      manufacturer_representation: values.manufacturer_representation,
      control_code: values.control_code,
      accuracy: values.accuracy,
      // manager: values.manager,
    };
    mutateAsync(data)
      .then((res) => {
        delete router.query.device;
        router.push(router);
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiDevice().url],
        });
      })
      .catch((err) => {});
    // }
    // else {
    //   return;
    // }
  };
  return (
    <>
      <FormHandler
        validationSchema={DeviceInfoValidationSchema}
        initialValues={initialValues}
        handleSubmit={(values, utils) => {
          submitDevice(values);
        }}
      >
        {(formik) => (
          <div className="grid grid-cols-1 gap-10 text-right md:grid-cols-2 md:p-2">
            <div className="col-span-2 md:col-span-1">
              <h6 className="text-[14px]">اطلاعات دستگاه خود را وارد کنید.</h6>
            </div>
            <div className="col-span-2 flex md:col-span-1 md:justify-end">
              <Switch
                checked={switchIsChecked}
                onChange={() => setChecked(!switchIsChecked)}
              >
                فعال
              </Switch>
            </div>

            <div className="col-span-2 md:col-span-1">
              <Input
                name={"name"}
                formik={formik}
                autoComplete={"name"}
                placeholder="نام دستگاه خود را وارد کنید"
                label={"نام دستگاه"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Select
                options={laboratoriesList ?? []}
                name={"laboratory"}
                label={"آزمایشگاه"}
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
                      {activeItem?.name ?? "آزمایشگاه را انتخاب کنید"}
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
                name={"labsnet_device_id"}
                formik={formik}
                autoComplete={"labsnet_device_id"}
                placeholder="شناسه نوع دستگاه در شبکه راهبردی را وارد کنید"
                label={"شناسه نوع دستگاه در شبکه راهبردی"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"labsnet_model_id"}
                formik={formik}
                autoComplete={"labsnet_model_id"}
                placeholder="شناسه مدل دستگاه در شبکه راهبردی را وارد کنید"
                label={"شناسه مدل دستگاه در شبکه راهبردی"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"manufacturer"}
                formik={formik}
                autoComplete={"manufacturer"}
                placeholder="شرکت سازنده را وارد کنید"
                label={"شرکت سازنده(برند)"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"manufacturer_representation"}
                formik={formik}
                autoComplete={"manufacturer_representation"}
                placeholder="نام نمایندگی شرکت سازنده را وارد کنید"
                label={"نمایندگی شرکت سازنده"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"model"}
                formik={formik}
                autoComplete={"model"}
                placeholder="مدل دستگاه را وارد کنید"
                label={"مدل(model)"}
                style={{
                  direction: formik.values["model"] ? "ltr" : "rtl",
                  // textAlign: "right",
                }}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"country_of_manufacture"}
                formik={formik}
                autoComplete={"country_of_manufacture"}
                placeholder="کشور سازنده را وارد کنید"
                label={"کشور سازنده"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"serial_number"}
                formik={formik}
                autoComplete={"serial_number"}
                placeholder="کد استاندارد دستگاه را وارد کنید"
                label={"کد استاندارد دستگاه"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"control_code"}
                formik={formik}
                autoComplete={"control_code"}
                placeholder="کد کنترلی دستگاه را وارد کنید"
                label={"کد کنترلی دستگاه"}
              />
            </div>
            {/* <div className="col-span-2 md:col-span-1">
              <Select
                options={operatorsList ?? []}
                name={"manager"}
                label={"نام مسئول"}
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
                      {activeItem?.name ?? "مسئول دستگاه را انتخاب کنید"}
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
            </div> */}
            <div className="col-span-2 md:col-span-1">
              <PersianCalendar
                name={"commissioning_date"}
                formik={formik}
                autoComplete={"commissioning_date"}
                placeholder="تاریخ راه اندازی دستگاه را وارد کنید"
                label={"تاریخ راه اندازی دستگاه"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Select
                options={deviceStatesList ?? []}
                name={"extra_status"}
                label={"وضعیت عملکرد دستگاه"}
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
                      {activeItem?.name ?? "وضعیت عملکرد دستگاه را انتخاب کنید"}
                    </span>

                    <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                      <IcChevronDown />
                    </SvgIcon>
                  </Card>
                )}
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
                name={"accuracy"}
                formik={formik}
                autoComplete={"accuracy"}
                placeholder="دقت دستگاه را وارد کنید"
                label={"دقت دستگاه"}
              />
            </div>
            <div className="col-span-2">
              <TextArea
                name={"application"}
                formik={formik}
                autoComplete={"application"}
                placeholder="کاربرد دستگاه را وارد کنید"
                label={"کاربرد"}
              />
            </div>
            <div className="col-span-2">
              <TextArea
                name={"description"}
                formik={formik}
                autoComplete={"description"}
                placeholder="شرح خدمات دستگاه را وارد کنید"
                label={"شرح خدمات"}
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
                ثبت دستگاه
              </Button>
            </div>
          </div>
        )}
      </FormHandler>
    </>
  );
};

export default DeviceInformation;
