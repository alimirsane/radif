import * as yup from "yup";
import { useRouter } from "next/router";
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
import { EditDeviceType } from "@api/service/device/type";
import { apiExperiment } from "@api/service/experiment";
import { CreateExperimentType } from "@api/service/experiment/type";
import { TextArea } from "@kit/text-area";
import { Switch } from "@kit/switch";
import { apiForm } from "@api/service/form";
import { Editor } from "@tinymce/tinymce-react";

const EditExperiment = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get device details form modal
  const experiment = useModalHandler((state) => state.modalData);
  // status
  const [switchIsChecked, setChecked] = useState<boolean>(
    experiment.status === "active" ? true : false,
  );
  const [needTurn, setNeedTurn] = useState<boolean>(experiment.need_turn);
  const samplesList = useMemo(() => {
    return [
      { value: "sample 1", name: "نمونه ۱" },
      { value: "sample 2", name: "نمونه ۲" },
      { value: "sample 3", name: "نمونه ۳" },
    ];
  }, []);
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "زمان (دقیقه)" },
      { value: "hour", name: "زمان (ساعت)" },
    ];
  }, []);
  const initialValues = useMemo(() => {
    return {
      laboratory: experiment.laboratory.toString(),
      device: experiment.device?.toString(),
      name: experiment.name,
      name_en: experiment.name_en,
      test_unit_type: experiment.test_unit_type,
      rules: experiment.rules,
      need_turn: experiment.need_turn,
      work_scope: experiment.work_scope,
      operator: experiment.operator?.toString(),
      form: experiment.form?.toString(),
      estimated_result_time: experiment.estimated_result_time,
      estimated_urgent_result_time: experiment.estimated_urgent_result_time,
      labsnet_experiment_id: experiment.labsnet_experiment_id,
      labsnet_test_type_id: experiment.labsnet_test_type_id,
      control_code: experiment.control_code,
      description: experiment.description,
      appointment_limit_hours: experiment.appointment_limit_hours,
      description_appointment: experiment.description_appointment,
      prepayment_amount: experiment.prepayment_amount,
    };
  }, [experiment]);

  const ExperimentInfoValidationSchema = useMemo(() => {
    return yup.object({
      // device: validation.requiredInput,
      laboratory: validation.requiredInput,
      form: validation.requiredInput,
      name: validation.requiredInput,
      name_en: validation.englishInput,
      labsnet_experiment_id: validation.requiredInput,
      labsnet_test_type_id: validation.requiredInput,
      control_code: validation.requiredInput,
      estimated_result_time: validation.positiveIntegers,
      estimated_urgent_result_time: validation.positiveIntegers,
      test_unit_type: validation.requiredInput,
      work_scope: validation.requiredInput,
      description: validation.requiredInput,
      rules: validation.requiredInput,
      prepayment_amount: needTurn
        ? validation.requiredInput
        : yup.string().nullable(),
    });
  }, [needTurn]);
  // get devices list
  const { data: devices, isLoading: devicesLoading } = useQuery(
    apiDevice().getAll(),
  );
  const devicesList = useMemo(() => {
    return devices?.data.map(({ id, name }) => ({
      value: id.toString(),
      name,
    }));
  }, [devices?.data]);

  // get laboratories list
  const { data: laboratories, isLoading: laboratoriesLoading } = useQuery(
    apiLaboratory().getAll(),
  );
  const laboratoriesList = useMemo(() => {
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
  // get forms list
  const { data: forms, isLoading: formsLoading } = useQuery(apiForm().getAll());
  const formsList = useMemo(() => {
    return forms?.data.map(({ id, title }) => ({
      value: id.toString(),
      name: title,
    }));
  }, [forms?.data]);
  // experiment update api
  const { mutateAsync } = useMutation(
    apiExperiment(true, {
      success: "ویرایش آزمون موفقیت آمیز بود",
      fail: "ویرایش آزمون انجام نشد",
      waiting: "در حال انتظار",
    }).update(experiment?.id.toString()),
  );
  // submit experiment
  const submitExperiment = (values: CreateExperimentType) => {
    const data = {
      name: values.name,
      name_en: values.name_en,
      test_unit_type: values.test_unit_type,
      work_scope: values.work_scope,
      rules: values.rules,
      need_turn: needTurn ? true : false,
      operator: Number(values.operator),
      laboratory: Number(values.laboratory),
      form: Number(values.form),
      device: Number(values.device),
      estimated_result_time: values.estimated_result_time,
      estimated_urgent_result_time: values.estimated_urgent_result_time,
      status: switchIsChecked ? "active" : "inactive",
      labsnet_experiment_id: values.labsnet_experiment_id,
      labsnet_test_type_id: values.labsnet_test_type_id,
      description: values.description,
      control_code: values.control_code,
      appointment_limit_hours: values.appointment_limit_hours,
      description_appointment: values.description_appointment,
      prepayment_amount: values.prepayment_amount?.length
        ? values.prepayment_amount
        : "0",
    };
    mutateAsync(data)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiExperiment().url],
        });
        hideModal();
      })
      .catch((err) => {});
  };
  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] min-h-[95vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[80vw] xl:w-[60vw]"
    >
      <span className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">ویرایش آزمون</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>

      <FormHandler
        validationSchema={ExperimentInfoValidationSchema}
        initialValues={initialValues}
        handleSubmit={(values, utils) => {
          submitExperiment({
            ...values,
            // need_turn: values.need_turn ? "True" : "False",
          });
        }}
      >
        {(formik) => (
          <div className="grid grid-cols-1 gap-8 p-2 text-right md:grid-cols-2">
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
                name={"name"}
                formik={formik}
                autoComplete={"name"}
                placeholder="نام آزمون خود را وارد کنید"
                label={"نام آزمون"}
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
              <Input
                name={"name_en"}
                formik={formik}
                autoComplete={"name_en"}
                placeholder="نام انگلیسی آزمون را وارد کنید"
                label={"نام انگلیسی آزمون"}
                style={{
                  direction: formik.values["name_en"] ? "ltr" : "rtl",
                }}
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
              <Select
                options={devicesList ?? []}
                name={"device"}
                label={"دستگاه"}
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
                      {activeItem?.name ?? "دستگاه را انتخاب کنید"}
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
                name={"labsnet_experiment_id"}
                formik={formik}
                autoComplete={"labsnet_experiment_id"}
                placeholder="شناسه آزمون شبکه راهبردی را وارد کنید"
                label={"شناسه آزمون شبکه راهبردی"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"labsnet_test_type_id"}
                formik={formik}
                autoComplete={"labsnet_test_type_id"}
                placeholder="شناسه نوع آزمون شبکه راهبردی را وارد کنید"
                label={"شناسه نوع آزمون شبکه راهبردی"}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"control_code"}
                formik={formik}
                autoComplete={"control_code"}
                placeholder="کد کنترلی آزمون را وارد کنید"
                label={"کد کنترلی آزمون"}
                // type="number"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Select
                options={unitsList}
                name={"test_unit_type"}
                formik={formik}
                label={"نوع واحد آزمون"}
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
                      {activeItem?.name ?? "نوع واحد آزمون را وارد کنید"}
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
              <Select
                options={formsList ?? []}
                name={"form"}
                label={"فرم آزمون"}
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
                      {activeItem?.name ?? "فرم آزمون را انتخاب کنید"}
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
            {/* <div className="col-span-2 md:col-span-1">
              <Select
                options={operatorsList ?? []}
                name={"operator"}
                label={"اپراتور"}
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
                          : "text-typography-secondary"
                      }
                    >
                      {activeItem?.name ?? "اپراتور را انتخاب کنید"}
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
            <div className={`relative col-span-2 items-center md:col-span-1`}>
              <Input
                name={"estimated_result_time"}
                formik={formik}
                autoComplete={"estimated_result_time"}
                placeholder="زمان انجام آزمون را وارد کنید"
                label={"زمان انتظار انجام آزمون (روز کاری)"}
                type="number"
                className="pl-[30px]"
              />
              <span className="absolute left-3 top-[48%] translate-y-1 text-[14px] text-typography-gray">
                روز کاری
              </span>
            </div>
            <div className={`relative col-span-2 items-center md:col-span-1`}>
              <Input
                name={"estimated_urgent_result_time"}
                formik={formik}
                autoComplete={"estimated_urgent_result_time"}
                placeholder="زمان انجام آزمون فوری را وارد کنید"
                label={"زمان انتظار انجام آزمون فوری (روز کاری)"}
                type="number"
                className="pl-[30px]"
              />
              <span className="absolute left-3 top-[48%] translate-y-1 text-[14px] text-typography-gray">
                روز کاری
              </span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <Input
                name={"work_scope"}
                formik={formik}
                autoComplete={"work_scope"}
                placeholder="گستره کاری را وارد کنید"
                label={"گستره کاری"}
              />
            </div>
            <div className="col-span-2">
              <TextArea
                name={"description"}
                formik={formik}
                autoComplete={"description"}
                placeholder="شرح آزمون را وارد کنید"
                label={
                  "شرح آزمون (نکات ضروری جهت نمایش به مشتری را به صورت خلاصه وارد نمایید.)"
                }
              />
            </div>
            <div className="col-span-2">
              {/* <div className="pb-2">
                <label className="text-[13px] font-bold">
                  قوانین و شرایط آزمون*
                </label>
              </div>
              <Editor
                apiKey="tw1ipm3lvh59guq0j3xd7z1t3fn29hult2jfyvwbv7pciak7"
                value={formik.values.rules}
                onEditorChange={(content) =>
                  formik.setFieldValue("rules", content)
                }
                init={{
                  plugins: ["autolink", "link", "lists", "searchreplace"],
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                  directionality: "rtl",
                  content_style: "body { font-size: 14px; }",
                  branding: false,
                  statusbar: false,
                  menubar: false,
                  placeholder: "قوانین موردنظر خود را وارد کنید",
                }}
              /> */}
              <TextArea
                name={"rules"}
                formik={formik}
                autoComplete={"rules"}
                rows={6}
                placeholder="قوانین موردنظر خود را وارد کنید"
                label={"قوانین و شرایط آزمون"}
              />
            </div>

            <div className="col-span-2">
              <input
                type="checkbox"
                checked={needTurn}
                onChange={() => {
                  setNeedTurn(!needTurn);
                }}
                name="need_turn"
                className={`accent-black h-3 w-3 `}
              ></input>
              <label
                htmlFor="need_turn"
                className={`pr-2 text-[14px] font-medium`}
              >
                آزمون دارای نوبت دهی می‌باشد.
              </label>
            </div>
            {needTurn && (
              <>
                <div
                  className={`relative col-span-2 items-center md:col-span-1`}
                >
                  <Input
                    name={"prepayment_amount"}
                    formik={formik}
                    autoComplete={"prepayment_amount"}
                    placeholder="مبلغ پیش پرداخت ثبت نوبت را وارد کنید"
                    label={"پیش پرداخت ثبت نوبت"}
                    type="number"
                    style={{
                      direction: formik.values["prepayment_amount"]
                        ? "ltr"
                        : "rtl",
                    }}
                  />
                  {formik.values.prepayment_amount && (
                    <span className="text-[12px] text-typography-secondary">
                      {(
                        Number(formik.values.prepayment_amount) / 10
                      )?.toLocaleString()}{" "}
                      تومان
                    </span>
                  )}
                </div>
                <div
                  className={`relative col-span-2 items-center md:col-span-1`}
                >
                  <Input
                    name={"appointment_limit_hours"}
                    formik={formik}
                    autoComplete={"appointment_limit_hours"}
                    placeholder="محدودیت اخذ نوبت برای هر کاربر را وارد کنید"
                    label={"محدودیت اخذ نوبت برای هر کاربر (ساعت)"}
                    type="number"
                    className="pl-[30px]"
                  />
                  <span className="absolute left-3 top-[35%] translate-y-1 text-[14px] text-typography-gray">
                    ساعت
                  </span>
                </div>
                <div className="col-span-2">
                  {/* <TextArea
                    name={"description_appointment"}
                    formik={formik}
                    autoComplete={"description_appointment"}
                    placeholder="توضیحات نوبت‌ دهی آزمون را وارد کنید"
                    label={"توضیحات نوبت‌ دهی"}
                  /> */}
                  <div className="pb-2">
                    <label className="text-[13px] font-bold">
                      توضیحات نوبت‌ دهی*
                    </label>
                  </div>
                  <Editor
                    apiKey="tw1ipm3lvh59guq0j3xd7z1t3fn29hult2jfyvwbv7pciak7"
                    value={formik.values.description_appointment}
                    onEditorChange={(content) =>
                      formik.setFieldValue("description_appointment", content)
                    }
                    init={{
                      plugins: ["autolink", "link", "lists", "searchreplace"],
                      toolbar:
                        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                      directionality: "rtl",
                      content_style: "body { font-size: 14px; }",
                      branding: false,
                      statusbar: false,
                      menubar: false,
                      placeholder: "توضیحات نوبت‌ دهی آزمون را وارد کنید",
                    }}
                  />
                </div>
              </>
            )}
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
export default EditExperiment;
