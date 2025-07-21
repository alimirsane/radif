import * as yup from "yup";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IcCheck, IcChevronDown, IcClose } from "@feature/kits/common/icons";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { Input } from "@kit/input";
import { FormHandler } from "@utils/form-handler";
import { Button } from "@kit/button";
import { validation } from "@utils/form-handler/validation";
import { apiLaboratory } from "@api/service/laboratory";
import { apiUser } from "@api/service/user";
import { apiDevice } from "@api/service/device";
import { Select } from "@kit/select";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { CreateDeviceType } from "@api/service/device/type";
import { Switch } from "@kit/switch";
import { PersianCalendar } from "@kit/calendar";
import { TextArea } from "@kit/text-area";
// import { DateObject } from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";

const EditDevice = () => {
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
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get device details form modal
  const device = useModalHandler((state) => state.modalData);
  // status
  const [switchIsChecked, setChecked] = useState<boolean>(
    device.status === "active" ? true : false,
  );
  const initialValues = useMemo(() => {
    return {
      laboratory: device.laboratory.toString(),
      name: device.name,
      serial_number: device.serial_number,
      manufacturer: device.manufacturer,
      model: device.model,
      // commissioning_date: new DateObject(device.commissioning_date)
      //   .convert(persian, persian_fa)
      //   .format(),
      commissioning_date: new Date(device.commissioning_date).toISOString(),
      description: device.description,
      application: device.application,
      labsnet_device_id: device.labsnet_device_id,
      labsnet_model_id: device.labsnet_model_id,
      manufacturer_representation: device.manufacturer_representation,
      country_of_manufacture: device.country_of_manufacture,
      control_code: device.control_code,
      // manager: "",
      accuracy: device.accuracy,
      extra_status: device.extra_status,
    };
  }, [device]);
  const DeviceInfoValidationSchema = useMemo(() => {
    return yup.object({
      laboratory: validation.requiredInput,
      name: validation.requiredInput,
      serial_number: validation.requiredInput,
      manufacturer: validation.requiredInput,
      country_of_manufacture: validation.requiredInput,
      extra_status: validation.requiredInput,
      labsnet_device_id: validation.requiredInput,
      labsnet_model_id: validation.requiredInput,
      model: validation.englishInput,
      application: validation.requiredInput,
      commissioning_date: validation.requiredInput,
      // manager: validation.requiredInput,
      // manufacturer_representation: validation.requiredInput,
      // purchase_date: validation.requiredInput,
      // description: validation.requiredInput,
    });
  }, []);
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

  // device update api
  const { mutateAsync } = useMutation(
    apiDevice(true, {
      success: "ویرایش دستگاه موفقیت آمیز بود",
      fail: "ویرایش دستگاه انجام نشد",
      waiting: "در حال انتظار",
    }).update(device.id.toString()),
  );
  // submit device
  const submitDevice = (values: CreateDeviceType) => {
    // if (laboratoryId) {
    const data = {
      name: values.name,
      model: values.model,
      manufacturer: values.manufacturer,
      serial_number: values.serial_number,
      description: values.description,
      application: values.application,
      laboratory: values.laboratory,
      status: switchIsChecked ? "active" : "inactive",
      purchase_date: "",
      warranty_period: "1",
      country_of_manufacture: values.country_of_manufacture,
      commissioning_date:
        values.commissioning_date &&
        values.commissioning_date !== device.commissioning_date
          ? GetDate(values.commissioning_date)
          : GetDate(device.commissioning_date),
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
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiDevice().url],
        });
        hideModal();
      })
      .catch((err) => {});
    // }
    // else {
    //   return;
    // }
  };
  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] min-h-[95vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[80vw] xl:w-[60vw]"
    >
      <span className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">ویرایش دستگاه</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>

      <FormHandler
        validationSchema={DeviceInfoValidationSchema}
        initialValues={initialValues}
        handleSubmit={(values, utils) => {
          submitDevice(values);
        }}
      >
        {(formik) => (
          <div className="grid grid-cols-1 gap-8 pb-2 text-right md:grid-cols-2">
            <div className="flex md:hidden">
              <Switch
                checked={switchIsChecked}
                onChange={() => setChecked(!switchIsChecked)}
              >
                فعال
              </Switch>
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                label={"نام دستگاه"}
                name={"name"}
                formik={formik}
                autoComplete={"name"}
                placeholder="نام دستگاه خود را وارد کنید"
              />
            </div>
            <div className="hidden pt-4 md:block">
              <span className="flex justify-end">
                <Switch
                  checked={switchIsChecked}
                  onChange={() => setChecked(!switchIsChecked)}
                >
                  فعال
                </Switch>
              </span>
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
                label={"مدل(Model)"}
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
                placeholder="کد استاندارد را وارد کنید"
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
                // value={
                //   formik.values.commissioning_date ??
                //   formik.initialValues.commissioning_date
                // }
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
                      {activeItem?.name ?? "وضعیت دستگاه را انتخاب کنید"}
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
                ثبت تغییرات
              </Button>
            </div>
          </div>
        )}
      </FormHandler>
    </Card>
  );
};
export default EditDevice;
