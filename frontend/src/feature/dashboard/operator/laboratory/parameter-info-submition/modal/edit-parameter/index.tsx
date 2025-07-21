import * as yup from "yup";
import { useMemo, useState } from "react";
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
import { apiParameter } from "@api/service/parameter";
import { apiExperiment } from "@api/service/experiment";
import { Select } from "@kit/select";
import { CreateParameterType } from "@api/service/parameter/type";
import { Switch } from "@kit/switch";

const EditParameter = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // units types list
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "زمان (دقیقه)" },
      { value: "hour", name: "زمان (ساعت)" },
    ];
  }, []);
  // status
  const [switchIsChecked, setChecked] = useState<boolean>(true);
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get param details form modal
  const param = useModalHandler((state) => state.modalData);
  // form initial values
  const initialValues = useMemo(() => {
    return {
      name: param.name,
      name_en: param.name_en,
      unit_value: param.unit_value?.toString(),
      unit: param.unit.toString(),
      experiment: param.experiment.toString(),
      price: param.price,
      urgent_price: param.urgent_price === "0" ? "" : param.urgent_price,
      partner_price: param.partner_price,
      partner_urgent_price: param.partner_urgent_price,
    };
  }, [param]);

  const ParameterInfoValidationSchema = useMemo(() => {
    return yup.object({
      name: validation.requiredInput,
      name_en: validation.englishInput,
      unit_value: validation.requiredInput,
      // unit: validation.requiredInput,
      experiment: validation.requiredInput,
      price: validation.requiredInput,
      // urgent_price: validation.requiredInput,
    });
  }, []);
  // get experiments list
  const { data: experiments, isLoading: experimentsLoading } = useQuery(
    apiExperiment().getAll(),
  );
  const experimentsList = useMemo(() => {
    return experiments?.data.map(({ id, name }) => ({
      value: id?.toString(),
      name,
    }));
  }, [experiments?.data]);
  // parameter update api
  const { mutateAsync } = useMutation(
    apiParameter(true, {
      success: "ویرایش پارامتر با موفقیت انجام شد",
      fail: "ویرایش پارامتر انجام نشد",
      waiting: "در حال انتظار",
    }).update(param.id),
  );
  // submit parameter form
  const submitParameter = (values: CreateParameterType) => {
    // if (experimentId) {
    const data = {
      name: values.name,
      name_en: values.name_en,
      unit:
        unitsList.find(
          (unit) =>
            unit.value ===
              experiments?.data?.find(
                (experiment) =>
                  experiment.id?.toString() === values.experiment?.toString(),
              )?.test_unit_type ||
            unit.name ===
              experiments?.data?.find(
                (experiment) =>
                  experiment.id?.toString() === values.experiment?.toString(),
              )?.test_unit_type,
        )?.value ?? "",
      unit_value: values.unit_value,
      price: values.price,
      urgent_price: values.urgent_price || "0",
      experiment: values.experiment,
      partner_price: values.partner_price,
      partner_urgent_price: values.partner_urgent_price,
    };
    mutateAsync(data)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiParameter().url],
        });
        // close modal
        hideModal();
      })
      .catch((err) => {});
    // } else {
    //   return;
    // }
  };
  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[80vw] xl:w-[60vw]"
    >
      <span className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">ویرایش پارامتر</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <FormHandler
        validationSchema={ParameterInfoValidationSchema}
        className="overflow-y-auto"
        initialValues={initialValues}
        handleSubmit={(values, utils) => {
          submitParameter(values);
        }}
      >
        {(formik) => (
          <div className="grid grid-cols-1 gap-8 text-right md:grid-cols-2 ">
            {/* <div className="col-span-2 flex justify-end md:col-span-1">
              <Switch
                checked={switchIsChecked}
                onChange={() => setChecked(!switchIsChecked)}
              >
                فعال
              </Switch>
            </div> */}
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"name"}
                formik={formik}
                autoComplete={"name"}
                placeholder="نام پارامتر خود را وارد کنید"
                label={"نام پارامتر"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"name_en"}
                formik={formik}
                autoComplete={"name_en"}
                placeholder="نام انگلیسی پارامتر خود را وارد کنید"
                label={"نام انگلیسی پارامتر"}
                style={{
                  direction: formik.values["name_en"] ? "ltr" : "rtl",
                }}
              />
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"price"}
                formik={formik}
                autoComplete={"price"}
                placeholder="هزینه را وارد کنید"
                label={"هزینه"}
                type="number"
                style={{
                  direction: formik.values["price"] ? "ltr" : "rtl",
                }}
              />
              {formik.values.price && (
                <span className="text-[12px] text-typography-secondary">
                  {(Number(formik.values.price) / 10)?.toLocaleString()} تومان
                </span>
              )}
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"urgent_price"}
                formik={formik}
                autoComplete={"urgent_price"}
                placeholder="هزینه فوری را وارد کنید"
                label={"هزینه فوری"}
                type="number"
                style={{
                  direction: formik.values["urgent_price"] ? "ltr" : "rtl",
                }}
              />
              {formik.values.urgent_price && (
                <span className="text-[12px] text-typography-secondary">
                  {(Number(formik.values.urgent_price) / 10)?.toLocaleString()}{" "}
                  تومان
                </span>
              )}
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"partner_price"}
                formik={formik}
                autoComplete={"partner_price"}
                placeholder="هزینه مشتری همکار را وارد کنید"
                label={"هزینه مشتری همکار"}
                type="number"
                style={{
                  direction: formik.values["partner_price"] ? "ltr" : "rtl",
                }}
              />
              {formik.values.partner_price && (
                <span className="text-[12px] text-typography-secondary">
                  {(Number(formik.values.partner_price) / 10)?.toLocaleString()}{" "}
                  تومان
                </span>
              )}
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"partner_urgent_price"}
                formik={formik}
                autoComplete={"partner_urgent_price"}
                placeholder="هزینه فوری مشتری همکار را وارد کنید"
                label={"هزینه فوری مشتری همکار"}
                type="number"
                style={{
                  direction: formik.values["partner_urgent_price"]
                    ? "ltr"
                    : "rtl",
                }}
              />
              {formik.values.partner_urgent_price && (
                <span className="text-[12px] text-typography-secondary">
                  {(
                    Number(formik.values.partner_urgent_price) / 10
                  )?.toLocaleString()}{" "}
                  تومان
                </span>
              )}
            </div>
            <div className="col-span-2 md:col-span-1">
              <Select
                options={experimentsList ?? []}
                name={"experiment"}
                label={"آزمون"}
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
                      {activeItem?.name ?? "آزمون را انتخاب کنید"}
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
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                // formik={formik}
                // autoComplete={"unit"}
                name={"unit"}
                placeholder="واحد اندازه‌گیری را وارد کنید"
                label={"واحد اندازه‌گیری"}
                value={
                  unitsList.find(
                    (unit) =>
                      unit.value ===
                        experiments?.data?.find(
                          (experiment) =>
                            experiment.id.toString() ===
                            formik.values.experiment,
                        )?.test_unit_type ||
                      unit.name ===
                        experiments?.data?.find(
                          (experiment) =>
                            experiment.id.toString() ===
                            formik.values.experiment,
                        )?.test_unit_type,
                  )?.name
                }
                disabled
              />
              {/* <Select
                options={unitsList}
                name={"unit"}
                formik={formik}
                label={"واحد اندازه‌گیری"}
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
                      {activeItem?.name ?? "واحد اندازه‌گیری را وارد کنید"}
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
              </Select> */}
            </div>
            <div className={`col-span-2 md:col-span-1`}>
              <Input
                name={"unit_value"}
                formik={formik}
                autoComplete={"unit_value"}
                placeholder="مقدار واحد را وارد کنید"
                label={"مقدار واحد"}
                type="number"
                style={{
                  direction: formik.values["unit_value"] ? "ltr" : "rtl",
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
                ثبت تغییرات
              </Button>
            </div>
          </div>
        )}
      </FormHandler>
    </Card>
  );
};
export default EditParameter;
