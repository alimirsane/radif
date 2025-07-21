import * as yup from "yup";
import { useMemo, useState } from "react";

import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { Select } from "@kit/select";
import { SvgIcon } from "@kit/svg-icon";
import { IcCheck, IcChevronDown, IcImage } from "@feature/kits/common/icons";
import { apiLaboratory } from "@api/service/laboratory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import { CreateLaboratoryType } from "@api/service/laboratory/type";
import { useOperatorLabManagementStepHandler } from "@hook/operator-laboratory-management-steps";
import React from "react";
import { Switch } from "@kit/switch";
import { useRouter } from "next/router";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { TextArea } from "@kit/text-area";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import { Editor } from "@tinymce/tinymce-react";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { apiLabDepartment } from "@api/service/lab-department";

const AddLaboratory = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  const openModal = useModalHandler((state) => state.openModal);
  const labTypesList = useMemo(() => {
    return [
      { value: "4", name: "مقیم" },
      { value: "2", name: "همکار" },
      { value: "3", name: "مستقل" },
    ];
  }, []);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [switchIsChecked, setChecked] = useState<boolean>(true);
  const [isoApproval, setIsoApproval] = useState<boolean | undefined>(
    undefined,
  );

  const initialValues = useMemo(() => {
    return {
      name: "",
      name_en: "",
      technical_manager: undefined,
      operators: [],
      department: undefined,
      control_code: "",
      image: undefined,
      lab_type: undefined,
      address: "",
      response_hours: "",
      phone_number: "",
      telephone1: "",
      telephone2: "",
      add_telephone1: "",
      add_telephone2: "",
      // mobile: "",
      email: "",
      description: "",
      status: "active",
      device: undefined,
      economic_number: "",
      national_id: "",
      postal_code: "",
      fax: "",
    } as CreateLaboratoryType;
  }, []);

  const LabInfoValidationSchema = useMemo(() => {
    return yup.object({
      name: validation.requiredInput,
      name_en: validation.englishInput,
      technical_manager: validation.requiredInput,
      operators: yup
        .array()
        .of(yup.string().required("این فیلد اجباریست"))
        .min(1, "این فیلد اجباریست")
        .required("این فیلد اجباریست"),
      // operator: validation.requiredInput,
      department: validation.requiredInput,
      control_code: validation.requiredInput,
      image: validation.requiredInput,
      lab_type: validation.requiredInput,
      telephone1: validation.phone,
      address: validation.requiredInput,
      phone_number: validation.mobile,
      // mobile: validation.mobile,
      email: validation.email,
      description: validation.requiredInput,
      postal_code: validation.optionalPostalCode,
    });
  }, []);

  // get departments list
  const { data: departments, isLoading: departmentsLoading } = useQuery(
    apiLabDepartment().getAll(),
  );

  // get operators list
  const { data: operators, isLoading: operatorsLoading } = useQuery(
    apiUser().getAllPublicStaffs({ role: 7 }),
  );
  // get technicals list
  const { data: technicals, isLoading: technicalsLoading } = useQuery(
    apiUser().getAllPublicStaffs({ role: 6 }),
  );
  const departmentsList = useMemo(() => {
    return departments?.data.map(({ id, name }) => ({
      value: id.toString(),
      name,
    }));
  }, [departments?.data]);

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
  const technicalsList = useMemo(() => {
    return (
      technicals?.data
        ?.filter((technical) => technical?.user_type === "staff")
        ?.map(({ id, first_name, last_name }) => ({
          value: id.toString(),
          name: `${first_name} ${last_name}`,
        })) || []
    );
  }, [technicals]);
  // laboratory state management
  const setLaboratoryId = useOperatorLabManagementStepHandler(
    (state) => state.setLaboratoryId,
  );
  // operator state management
  const setOperatorId = useOperatorLabManagementStepHandler(
    (state) => state.setOperatorId,
  );
  // laboratory create api
  const { mutateAsync } = useMutation(
    apiLaboratory(true, {
      success: "ثبت آزمایشگاه موفقیت آمیز بود",
      fail: "ثبت آزمایشگاه انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
  );
  // submit laboratory
  const submitLaboratory = async (values: CreateLaboratoryType) => {
    const operatorsArray = Array.isArray(values.operators)
      ? values.operators.map((operator: any) => Number(operator))
      : [];

    const data = {
      name: values.name,
      name_en: values.name_en,
      status: switchIsChecked ? "active" : "inactive",
      address: values.address,
      response_hours: values.response_hours,
      phone_number: values.phone_number,
      telephone1: values.telephone1,
      telephone2: values.telephone2,
      add_telephone1: values.add_telephone1,
      add_telephone2: values.add_telephone2,
      description: values.description,
      // image: urlToFile(croppedImage, ""),
      image: values.image,
      technical_manager: Number(values.technical_manager),
      operators: `[${operatorsArray.join(",")}]`,
      // operators: values.operators.map((operator) => Number(operator)),
      department: Number(values.department),
      lab_type: Number(values.lab_type),
      economic_number: values.economic_number,
      national_id: values.national_id,
      postal_code: values.postal_code,
      fax: values.fax,
      email: values.email,
      control_code: values.control_code,
      has_iso_17025: isoApproval ? true : false,
    } as CreateLaboratoryType;
    if (croppedImage) {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "cropped_image.jpg", { type: blob.type });
      data.image = file as any;
    }
    mutateAsync(data)
      .then((res) => {
        setLaboratoryId(res?.data.id);
        setOperatorId(res?.data.operator);
        delete router.query.lab;
        router.push(router);
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiLaboratory().url],
        });
      })
      .catch((err) => {});
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  return (
    <>
      <Card className="border-2 border-info border-opacity-10 p-8 md:p-10">
        <FormHandler
          validationSchema={LabInfoValidationSchema}
          initialValues={initialValues}
          handleSubmit={(values, utils) => {
            submitLaboratory(values);
          }}
        >
          {(formik) => (
            <div className="grid grid-cols-1 gap-10 text-right md:grid-cols-2">
              <div className="col-span-2 md:col-span-1">
                <h6 className="text-[14px]">
                  اطلاعات آزمایشگاه خود را وارد کنید.
                </h6>
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
                  placeholder="نام آزمایشگاه خود را وارد کنید"
                  label={"نام آزمایشگاه"}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  name={"name_en"}
                  formik={formik}
                  autoComplete={"name_en"}
                  placeholder="نام آزمایشگاه خود را به انگلیسی وارد کنید"
                  label={"نام انگلیسی آزمایشگاه"}
                  style={{
                    direction: formik.values["name_en"] ? "ltr" : "rtl",
                  }}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Select
                  options={departmentsList ?? []}
                  name={"department"}
                  label={"نام دانشکده"}
                  formik={formik}
                  holder={(activeItem) => (
                    <Card
                      variant={"outline"}
                      className={
                        " mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
                      }
                    >
                      <span
                        className={
                          activeItem
                            ? "text-typography-main"
                            : "text-[13px] text-typography-secondary"
                        }
                      >
                        {activeItem?.name ?? "نام دانشکده را انتخاب کنید"}
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
                  options={labTypesList ?? []}
                  name={"lab_type"}
                  label={"نوع آزمایشگاه"}
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
                        {activeItem?.name ?? "نوع آزمایشگاه را انتخاب کنید"}
                      </span>
                      <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                        <IcChevronDown />
                      </SvgIcon>
                    </Card>
                  )}
                  // searchOn={"name"}
                  // placeholder="جستجو کنید"
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
              <div className="col-span-2 flex flex-row gap-4 md:col-span-1">
                <div className="w-2/3">
                  <Input
                    name={"telephone1"}
                    formik={formik}
                    autoComplete={"telephone1"}
                    placeholder="به عنوان مثال 02166160000"
                    label={"تلفن ۱"}
                    // type="number"
                    maxLength={50}
                    style={{
                      direction: formik.values["telephone1"] ? "ltr" : "rtl",
                    }}
                  />
                </div>
                <div className="w-1/3">
                  <Input
                    name={"add_telephone1"}
                    formik={formik}
                    autoComplete={"add_telephone1"}
                    placeholder="داخلی را وارد کنید"
                    label={"داخلی تلفن ۱"}
                    type="number"
                    maxLength={50}
                    style={{
                      direction: formik.values["add_telephone1"]
                        ? "ltr"
                        : "rtl",
                    }}
                  />
                </div>
              </div>
              <div className="col-span-2 flex flex-row gap-4 md:col-span-1">
                <div className="w-2/3">
                  <Input
                    name={"telephone2"}
                    formik={formik}
                    autoComplete={"telephone2"}
                    placeholder="به عنوان مثال 02166160000"
                    label={"تلفن ۲"}
                    type="number"
                    maxLength={50}
                    style={{
                      direction: formik.values["telephone2"] ? "ltr" : "rtl",
                    }}
                  />
                </div>
                <div className="w-1/3">
                  <Input
                    name={"add_telephone2"}
                    formik={formik}
                    autoComplete={"add_telephone2"}
                    placeholder="داخلی را وارد کنید"
                    label={"داخلی تلفن ۲"}
                    type="number"
                    maxLength={50}
                    style={{
                      direction: formik.values["add_telephone2"]
                        ? "ltr"
                        : "rtl",
                    }}
                  />
                </div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  name={"email"}
                  formik={formik}
                  autoComplete={"email"}
                  placeholder="ایمیل آزمایشگاه را وارد کنید"
                  label={"ایمیل"}
                  style={{
                    direction: formik.values["email"] ? "ltr" : "rtl",
                  }}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  name={"phone_number"}
                  formik={formik}
                  autoComplete={"phone_number"}
                  placeholder="شماره همراه را وارد کنید"
                  label={"شماره همراه"}
                  maxLength={11}
                  minLength={11}
                  type="number"
                  style={{
                    direction: formik.values["phone_number"] ? "ltr" : "rtl",
                  }}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Select
                  options={technicalsList ?? []}
                  name={"technical_manager"}
                  label={"مدیر فنی"}
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
                        {activeItem?.name ?? "مدیر فنی را انتخاب کنید"}
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
                  multiple
                  name={"operators"}
                  formik={formik}
                  options={operatorsList ?? []}
                  label={"اپراتور*"}
                  placeholder="جستجو کنید"
                  holder={(activeItem, reset, deleteItem) => (
                    <Card
                      variant={"outline"}
                      className={
                        "mt-2 flex w-full cursor-pointer items-center justify-between overflow-x-auto whitespace-nowrap px-2 py-2 text-sm"
                      }
                    >
                      <span
                        className={
                          !activeItem?.length
                            ? "py-[2px] text-[13px] text-typography-secondary"
                            : "text-typography-main"
                        }
                      >
                        {!activeItem?.length ? (
                          "اپراتور را انتخاب کنید"
                        ) : (
                          <div className={"flex flex-row gap-1"}>
                            {React?.Children?.toArray(
                              activeItem?.map((item) => (
                                <Button
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    deleteItem(item);
                                  }}
                                  endIcon={
                                    <SvgIcon
                                      className={
                                        "[&_svg]:h-[14px] [&_svg]:w-[14px]"
                                      }
                                    >
                                      <CloseIcon />
                                    </SvgIcon>
                                  }
                                  size={"tiny"}
                                  color={"primary"}
                                  variant={"outline"}
                                >
                                  {item?.name}
                                </Button>
                              )),
                            )}
                          </div>
                        )}
                      </span>
                      <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                        <IcChevronDown />
                      </SvgIcon>
                    </Card>
                  )}
                  searchOn={"name"}
                >
                  {(item, activeItem) => (
                    <Button
                      className={"w-full"}
                      variant={
                        activeItem
                          ?.map((activeIndexItem) => activeIndexItem?.value)
                          ?.includes(item?.value)
                          ? "solid"
                          : "text"
                      }
                      color={"primary"}
                    >
                      {item?.name}
                    </Button>
                  )}
                </Select>
                {/* <Select
                  options={operatorsList ?? []}
                  name={"operator"}
                  label={"اپراتور آزمایشگاه"}
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
                </Select> */}
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  name={"control_code"}
                  formik={formik}
                  autoComplete={"control_code"}
                  placeholder="کد کنترلی آزمایشگاه را وارد کنید"
                  label={"کد کنترلی آزمایشگاه"}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  name={"image"}
                  formik={formik}
                  placeholder="عکس آزمایشگاه را انتخاب کنید"
                  label={"عکس آزمایشگاه"}
                  type="file"
                  onChange={(event) => {
                    handleImageUpload(event);
                  }}
                />
                {/* {imagePreview && (
                  <span
                    className="mt-1 flex cursor-pointer flex-row gap-1 text-[12px] text-info"
                    onClick={() =>
                      openModal(ModalKeys.PREVIEW_LAB_IMAGE, imagePreview)
                    }
                  >
                    <SvgIcon
                      fillColor="info"
                      className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
                    >
                      <IcImage />
                    </SvgIcon>
                    مشاهده عکس بارگذاری شده
                  </span>
                )} */}
                {imagePreview && (
                  <span
                    className="mt-1 flex cursor-pointer flex-row gap-1 text-[12px] text-info"
                    onClick={() =>
                      openModal(ModalKeys.CROP_LAB_IMAGE, {
                        imagePreview: imagePreview,
                        onSave: (image: string) => {
                          setCroppedImage(image);
                        },
                      })
                    }
                  >
                    <SvgIcon
                      fillColor="info"
                      className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
                    >
                      <IcImage />
                    </SvgIcon>
                    مشاهده و ویرایش عکس بارگذاری شده
                  </span>
                )}
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  name={"economic_number"}
                  formik={formik}
                  autoComplete={"economic_number"}
                  placeholder="شماره اقتصادی آزمایشگاه را وارد کنید"
                  label={"شماره اقتصادی آزمایشگاه"}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  name={"national_id"}
                  formik={formik}
                  autoComplete={"national_id"}
                  placeholder="شناسه ملی آزمایشگاه را وارد کنید"
                  label={"شناسه ملی آزمایشگاه"}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  name={"fax"}
                  formik={formik}
                  autoComplete={"fax"}
                  placeholder="دورنگار آزمایشگاه را وارد کنید"
                  label={"دورنگار آزمایشگاه"}
                  style={{
                    direction: formik.values["fax"] ? "ltr" : "rtl",
                  }}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  name={"postal_code"}
                  formik={formik}
                  autoComplete={"postal_code"}
                  placeholder="کدپستی آزمایشگاه را وارد کنید"
                  label={"کدپستی آزمایشگاه"}
                  style={{
                    direction: formik.values["postal_code"] ? "ltr" : "rtl",
                  }}
                />
              </div>
              <div className="col-span-2">
                <Input
                  name={"address"}
                  formik={formik}
                  autoComplete={"address"}
                  placeholder="آدرس خود را وارد کنید"
                  label={"آدرس"}
                />
              </div>
              <div className="col-span-2">
                <Input
                  name={"response_hours"}
                  formik={formik}
                  autoComplete={"response_hours"}
                  placeholder="ساعت پاسخگویی را وارد کنید"
                  label={"ساعت پاسخگویی"}
                  maxLength={100}
                />
              </div>
              <div className="col-span-2">
                {/* <TextArea
                  name={"description"}
                  formik={formik}
                  autoComplete={"description"}
                  placeholder="متن مورد نظر خود را وارد کنید"
                  label={"شرح آزمایشگاه"}
                /> */}
                <div className="pb-2">
                  <label className="text-[13px] font-bold">
                    شرح آزمایشگاه*
                  </label>
                </div>
                <Editor
                  apiKey="tw1ipm3lvh59guq0j3xd7z1t3fn29hult2jfyvwbv7pciak7"
                  value={formik.values.description}
                  onEditorChange={(content) =>
                    formik.setFieldValue("description", content)
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
                    placeholder: "شرح آزمایشگاه را وارد کنید",
                  }}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="checkbox"
                  onChange={() => {
                    setIsoApproval(!isoApproval);
                  }}
                  name="isoApproval"
                  className={`accent-black h-3 w-3 `}
                ></input>
                <label
                  htmlFor="sharifEmailApproval"
                  className={`pr-2 text-[14px] font-medium`}
                >
                  آزمایشگاه دارای ایزو 17025 می‌باشد.
                </label>
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
                  ثبت آزمایشگاه
                </Button>
              </div>
            </div>
          )}
        </FormHandler>
      </Card>
    </>
  );
};

export default AddLaboratory;
