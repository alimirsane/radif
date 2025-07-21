import * as yup from "yup";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { SvgIcon } from "@kit/svg-icon";
import { IcCheck, IcChevronDown } from "@feature/kits/common/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDevice } from "@api/service/device";
import { Select } from "@kit/select";
import { apiExperiment } from "@api/service/experiment";
import { useOperatorLabManagementStepHandler } from "@hook/operator-laboratory-management-steps";
import { Switch } from "@kit/switch";
import { apiLaboratory } from "@api/service/laboratory";
import { CreateExperimentType } from "@api/service/experiment/type";
import { apiForm } from "@api/service/form";
import { TextArea } from "@kit/text-area";
import { Editor } from "@tinymce/tinymce-react";

const ExperimentInformation = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  const [switchIsChecked, setChecked] = useState<boolean>(true);
  const [needTurn, setNeedTurn] = useState<boolean>(false);
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "زمان (دقیقه)" },
      { value: "hour", name: "زمان (ساعت)" },
    ];
  }, []);
  const initialValues = useMemo(() => {
    return {
      laboratory: undefined,
      form: undefined,
      device: "",
      need_turn: false,
      name: "",
      name_en: "",
      labsnet_experiment_id: "",
      labsnet_test_type_id: "",
      control_code: undefined,
      estimated_result_time: NaN,
      estimated_urgent_result_time: NaN,
      test_unit_type: "",
      work_scope: "",
      description: "",
      rules: "",
      appointment_limit_hours: undefined,
      description_appointment: "",
      prepayment_amount: "",
    };
  }, []);

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
  // get forms list
  const { data: forms, isLoading: formsLoading } = useQuery(apiForm().getAll());
  const formsList = useMemo(() => {
    return forms?.data.map(({ id, title }) => ({
      value: id.toString(),
      name: title,
    }));
  }, [forms?.data]);
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
  // get lab id from state management
  const laboratoryId = useOperatorLabManagementStepHandler(
    (state) => state.laboratoryId,
  );
  // get operator id from state management
  const operatorId = useOperatorLabManagementStepHandler(
    (state) => state.operatorId,
  );
  // experiment state management
  const setExperimentId = useOperatorLabManagementStepHandler(
    (state) => state.setExperimentId,
  );

  // get current step id
  const { stepId, setStepId, nextStep, prevStep } =
    useOperatorLabManagementStepHandler();

  // experiment create api
  const { mutateAsync } = useMutation(
    apiExperiment(true, {
      success: "ثبت آزمون با موفقیت انجام شد",
      fail: "ثبت آزمون انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
  );
  // submit experiment form
  const submitExperiment = (values: CreateExperimentType) => {
    // if (laboratoryId) {
    const data = {
      name: values.name,
      name_en: values.name_en,
      work_scope: values.work_scope,
      test_unit_type: values.test_unit_type,
      rules: values.rules,
      status: switchIsChecked ? "active" : "inactive",
      laboratory: values.laboratory,
      form: values.form,
      operator: operatorId,
      need_turn: needTurn ? true : false,
      estimated_result_time: values.estimated_result_time,
      estimated_urgent_result_time: values.estimated_urgent_result_time,
      device: Number(values.device),
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
        // set experiment id state
        setExperimentId(res?.data.id);
        // set router query to back to list
        delete router.query.experiment;
        router.push(router);
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiExperiment().url],
        });
      })
      .catch((err) => {});
    // } else {
    //   return;
    // }
  };
  return (
    <>
      {/* <div className="text-[14px]">
        <h6>اطلاعات آزمون خود را وارد کنید.</h6>
        <Card color="info" className="my-5 w-full p-7 text-center">
          <p>
            ابتدا باید دستگاه‌هایی که نیاز است را انتخاب کنید. درصورتی که دستگاه
            شما در لیست دستگاه‌ها نیست باید از صفحه{" "}
            <span
              onClick={() => {
                router.query.step = "device";
                router.push(router);
              }}
              className=" cursor-pointer text-info underline underline-offset-4"
            >
              ثبت دستگاه
            </span>{" "}
            اقدام به ثبت کنید.
          </p>
        </Card>
      </div> */}
      <FormHandler
        validationSchema={ExperimentInfoValidationSchema}
        initialValues={initialValues}
        handleSubmit={(values, utils) => {
          submitExperiment(values);
          // submitExperiment({
          //   ...values,
          //   need_turn: values.need_turn ? "True" : "False",
          // });
        }}
      >
        {(formik) => (
          <div className="grid grid-cols-1 gap-10 text-right md:grid-cols-2 md:p-2">
            <div className="col-span-2 md:col-span-1">
              <h6 className="text-[14px]">اطلاعات آزمون خود را وارد کنید.</h6>
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
                placeholder="نام آزمون خود را وارد کنید"
                label={"نام آزمون"}
              />
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
            {/* <div className={`col-span-5 md:col-span-2`}>
              <Select
                options={samplesList}
                name={"sample"}
                label={"نمونه آزمون"}
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
                      {activeItem?.name ?? "نمونه آزمون را انتخاب کنید"}
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
            {/* <div className={`col-span-5 md:col-span-2`}>
              <Input
                name={"state"}
                formik={formik}
                autoComplete={"state"}
                placeholder="وضعیت را وارد کنید"
                label={"وضعیت"}
              />
            </div> */}

            <div className="col-span-2 md:col-span-1">
              <Input
                name={"work_scope"}
                formik={formik}
                autoComplete={"work_scope"}
                placeholder="گستره کاری را وارد کنید"
                label={"گستره کاری"}
              />
            </div>
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
              <TextArea
                name={"rules"}
                formik={formik}
                autoComplete={"rules"}
                rows={6}
                placeholder="قوانین موردنظر خود را وارد کنید"
                label={"قوانین و شرایط آزمون"}
              />
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
              {/* <div className="my-4">
                <h2 className="font-bold">Preview:</h2>
                <div
                  className="rounded border p-4"
                  dangerouslySetInnerHTML={{
                    __html: formik.values.rules,
                  }} // Render the HTML from TinyMCE
                />
              </div> */}
            </div>
            <div className="col-span-2">
              <input
                type="checkbox"
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
                    label={"پیش پرداخت ثبت نوبت*"}
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
                  <span className="absolute left-3 top-[37%] translate-y-1 text-[14px] text-typography-gray">
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

                  <div className="col-span-2 pb-2">
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
            {/* <div className={`col-span-2 md:col-span-1`}>
              <Switch>
                <span>دریافت گواهی آزمون</span>
              </Switch>
            </div>  */}
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
                ثبت آزمون
              </Button>
            </div>
          </div>
        )}
      </FormHandler>
    </>
  );
};

export default ExperimentInformation;
