import * as yup from "yup";

import { Card } from "@kit/card";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import {
  IcChevronDown,
  IcChevronUp,
  IcClose,
  IcImage,
} from "@feature/kits/common/icons";
import { Input } from "@kit/input";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { useEffect, useMemo, useState } from "react";
import { EditLabType, LaboratoryType } from "@api/service/laboratory/type";
import { Switch } from "@kit/switch";
import { apiUser } from "@api/service/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Select } from "@kit/select";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { Button } from "@kit/button";
import { IcCheck } from "@feature/kits/common/icons";
import { apiLaboratory } from "@api/service/laboratory";
import { useRouter } from "next/router";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import React from "react";
import { TextArea } from "@kit/text-area";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";
import { apiLabDepartment } from "@api/service/lab-department";
import CropLabImage from "../../../lab-info-submition/create-laboratory/modal/crop-lab-image";

const EditLab = () => {
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
  const hideModal = useModalHandler((state) => state.hideModal);
  const [cropImagePreview, setCropImagePreview] = useState<boolean>(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const lab: LaboratoryType = useModalHandler((state) => state.modalData);
  // status
  const [switchIsChecked, setChecked] = useState<boolean>(
    lab.status === "active" ? true : false,
  );
  // iso
  const [isoApproval, setIsoApproval] = useState<boolean | undefined>(
    lab.has_iso_17025,
  );
  const { mutateAsync } = useMutation(
    apiLaboratory(true, {
      success: "ویرایش آزمایشگاه موفقیت آمیز بود",
      fail: "ویرایش آزمایشگاه انجام نشد",
      waiting: "در حال انتظار",
    }).update(lab.id?.toString()),
  );
  // get departments list
  const { data: departments, isLoading: departmentsLoading } = useQuery(
    apiLabDepartment().getAll(),
  );

  // get operators list
  const { data: operators, isLoading: operatorsLoading } = useQuery(
    apiUser().getAllPublicStaffs({ role: 7 }),
  );

  // get technical_manager list
  const { data: technicalManagers, isLoading: technicalManagersLoading } =
    useQuery(apiUser().getAllPublicStaffs({ role: 6 }));

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

  const technicalManagersList = useMemo(() => {
    return (
      technicalManagers?.data
        ?.filter((technicalManager) => technicalManager?.user_type === "staff")
        ?.map(({ id, first_name, last_name }) => ({
          value: id.toString(),
          name: `${first_name} ${last_name}`,
        })) || []
    );
  }, [technicalManagers]);

  const initialValues = useMemo(() => {
    return {
      name: lab.name,
      name_en: lab.name_en,
      // status: lab.status,
      address: lab.address,
      response_hours: lab.response_hours,
      phone_number: lab.phone_number,
      telephone1: lab.telephone1 ?? "---",
      telephone2: lab.telephone2 ?? "---",
      add_telephone1: lab.add_telephone1 ?? "-",
      add_telephone2: lab.add_telephone2 ?? "-",
      description: lab.description,
      image: lab.image,
      technical_manager: lab.technical_manager?.toString(),
      operators:
        lab.operators_obj?.map((operator) => operator.id.toString()) ?? [],
      department: lab.department?.toString(),
      lab_type: lab.lab_type?.toString(),
      email: lab.email ?? "---",
      economic_number: lab.economic_number ?? "---",
      national_id: lab.national_id ?? "---",
      postal_code: lab.postal_code ?? "---",
      fax: lab.fax ?? "---",
      control_code: lab.control_code ?? "---",
    };
  }, [lab]);
  const validationValue = useMemo(() => {
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
      telephone1: validation.requiredInput,
      address: validation.requiredInput,
      phone_number: validation.mobile,
      // mobile: validation.mobile,
      email: validation.email,
      description: validation.requiredInput,
      postal_code: validation.optionalPostalCode,
    });
  }, []);
  const handlerSubmit = async (data: EditLabType) => {
    const operatorsArray = Array.isArray(data.operators)
      ? data.operators.map((operator: any) => Number(operator))
      : [];
    data.status = switchIsChecked ? "active" : "inactive";
    data.has_iso_17025 = isoApproval ? true : false;
    data.operators = `[${operatorsArray.join(",")}]`;
    if (croppedImage) {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "cropped_image.jpg", { type: blob.type });
      data.image = file as any;
    }
    const { image, ...newData } = data;
    mutateAsync(data.image === lab.image ? newData : data)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiLaboratory().url],
        });
        hideModal();
      })
      .catch((err) => {});
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // if (file) {
    //   const previewUrl = URL.createObjectURL(file);
    //   setImageSrc(previewUrl);
    // }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string; // convert to data url
        setImageSrc(previewUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  async function fetchImageAsDataURL(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl, { mode: "cors" });
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  useEffect(() => {
    if (lab.image) {
      fetchImageAsDataURL(lab.image)
        .then((dataUrl) => setImageSrc(dataUrl))
        .catch((err) =>
          console.error("Error converting image to data URL", err),
        );
    }
  }, [lab.image]);
  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] min-h-[95vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[80vw] xl:w-[60vw]"
    >
      <div className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">ویرایش آزمایشگاه</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      {cropImagePreview ? (
        <CropLabImage
          imagePreview={imageSrc ?? lab.image}
          onSave={(image: string) => {
            setCroppedImage(image);
            setCropImagePreview(false);
          }}
          onCancel={() => {
            setCropImagePreview(false);
          }}
        />
      ) : (
        <FormHandler
          initialValues={initialValues}
          validationSchema={validationValue}
          handleSubmit={(values: any) => handlerSubmit(values)}
        >
          {(formik) => (
            <div className="grid grid-cols-1 gap-10 text-right md:grid-cols-2">
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
                  name="name"
                  placeholder="نام آزمایشگاه خود را وارد کنید"
                  label="نام آزمایشگاه"
                  formik={formik}
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
              {/* <Input
                name={"lab_type"}
                formik={formik}
                autoComplete={"lab_type"}
                placeholder="کد استاندارد آزمایشگاه را وارد کنید"
                label={"کد استاندارد آزمایشگاه"}
                type="number"
              /> */}

              <div className="col-span-2 md:col-span-1">
                <Input
                  name={"control_code"}
                  formik={formik}
                  autoComplete={"control_code"}
                  placeholder="کد کنترلی آزمایشگاه را وارد کنید"
                  label={"کد کنترلی آزمایشگاه"}
                />
              </div>
              <div className="col-span-2 flex flex-row gap-2 md:col-span-1">
                <div className="w-2/3">
                  <Input
                    name={"telephone1"}
                    formik={formik}
                    autoComplete={"telephone1"}
                    placeholder="به عنوان مثال 02166160000"
                    label={"تلفن ۱"}
                    type="number"
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
              <div className="col-span-2 flex flex-row gap-2 md:col-span-1">
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
                  options={technicalManagersList ?? []}
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
                            : "text-typography-secondary"
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
                {lab.image && (
                  <div>
                    {/* 
                    <div className="relative mt-6 h-[20vh] max-h-[30vh] w-full">
                      <Image
                        src={imageSrc ?? lab.image}
                        alt="Laboratory image preview"
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  */}
                    <span
                      className="mt-1 flex cursor-pointer flex-row gap-1 text-[12px] text-info"
                      onClick={() => {
                        setCropImagePreview(true);
                      }}
                    >
                      <SvgIcon
                        fillColor="info"
                        className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
                      >
                        <IcImage />
                      </SvgIcon>
                      مشاهده و ویرایش عکس بارگذاری شده
                    </span>
                  </div>
                )}
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
                  checked={isoApproval}
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
      )}
    </Card>
  );
};

export default EditLab;
