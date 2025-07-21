import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";

import {
  IcCheck,
  IcDelete,
  IcFileUpload,
  IcIcSingleCheckBox,
  IcMultiCheckBox,
  IcParagraphInput,
  IcSelectInput,
  IcTextInput,
} from "@feature/kits/common/icons";
import { Input } from "@kit/input";
import { Switch } from "@kit/switch";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { TextArea } from "@kit/text-area";
import { useFBManufacture } from "@module/form-builder/manufacturer";
import { FBElements } from "@module/form-builder/type/element";
import { FBElementProp } from "@module/form-builder/type/sample";
import { FBInputElementType } from "@module/form-builder/type/sample/input";
import { FBRadioElementType } from "@module/form-builder/type/sample/radio";
import { FBSelectElementType } from "@module/form-builder/type/sample/select";
import { FBFileInputElementType } from "@module/form-builder/type/sample/file";
import { FBCheckboxElementType } from "@module/form-builder/type/sample/checkbox";
import { FBTextAreaElementType } from "@module/form-builder/type/sample/textarea";
import useFormState from "./states";
import OptionsForm from "./options";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";

type ExtractedFBElement = Extract<
  FBElements,
  | FBElements.INPUT
  | FBElements.TEXT_AREA
  | FBElements.CHECKBOX_GROUP
  | FBElements.RADIO_GROUP
  | FBElements.SELECT_BOX
  // | FBElements.FILE
>;

const tabIconsMapping: Record<ExtractedFBElement, ReactElement> = {
  [FBElements.INPUT]: <IcTextInput />,
  [FBElements.TEXT_AREA]: <IcParagraphInput />,
  [FBElements.CHECKBOX_GROUP]: <IcMultiCheckBox />,
  [FBElements.RADIO_GROUP]: <IcIcSingleCheckBox />,
  [FBElements.SELECT_BOX]: <IcSelectInput />,
  // [FBElements.FILE]: <IcFileUpload />,
};

const tabTitlesMapping: Record<ExtractedFBElement, string> = {
  [FBElements.INPUT]: "متنی",
  [FBElements.TEXT_AREA]: "توضیحاتی",
  [FBElements.CHECKBOX_GROUP]: "انتخاب چند گزینه‌",
  [FBElements.RADIO_GROUP]: "انتخاب یک گزینه‌",
  [FBElements.SELECT_BOX]: "انتخاب از لیست",
  // [FBElements.FILE]: "اضافه کردن فایل",
};

const Form = ({
  formId,
  element,
  closeCollapse,
}: {
  formId: string | undefined;
  element: FBElementProp;
  closeCollapse: (id: string | undefined) => void;
}) => {
  //  ****** manufacture ******
  // state management -> update core element
  const updateElement = useFBManufacture((state) => state.updateElement);
  // state management -> delete element
  const deleteElement = useFBManufacture((state) => state.deleteElement);
  //  ****** end manufacture ******

  // Tabs
  const [selectedTab, setSelectedTab] = useState<FBElements>(
    element.element ?? FBElements.INPUT,
  );
  // States
  const {
    checkboxOptions,
    setCheckboxOptions,
    newCheckboxOption,
    setNewCheckboxOption,
    radioOptions,
    setRadioOptions,
    newRadioOption,
    setNewRadioOption,
    selectInputOptions,
    setSelectInputOptions,
    newSelectInputOption,
    setNewSelectInputOption,
    titleInput,
    setTitleInput,
    textInput,
    setTextInput,
    paragraphInput,
    setParagraphInput,
    switchIsChecked,
    setChecked,
  } = useFormState(element, selectedTab);

  // Add checkbox or radio or select options
  const handleAddOption = () => {
    // Check the selected tab and add the option
    if (selectedTab === FBElements.CHECKBOX_GROUP) {
      if (newCheckboxOption.trim() !== "") {
        setCheckboxOptions([
          ...checkboxOptions,
          { label: newCheckboxOption, value: newCheckboxOption },
        ]);
        setNewCheckboxOption("");
      }
    } else if (selectedTab === FBElements.RADIO_GROUP) {
      if (newRadioOption.trim() !== "") {
        setRadioOptions([
          ...radioOptions,
          { label: newRadioOption, value: newRadioOption },
        ]);
        setNewRadioOption("");
      }
    } else if (selectedTab === FBElements.SELECT_BOX) {
      if (newSelectInputOption.trim() !== "") {
        setSelectInputOptions([
          ...selectInputOptions,
          { label: newSelectInputOption, value: newSelectInputOption },
        ]);
        setNewSelectInputOption("");
      }
    }
  };
  // Delete checkbox or radio options
  const handleDeleteOption = (index: number) => {
    // Check the selected tab and delete the option
    if (selectedTab === FBElements.CHECKBOX_GROUP) {
      const updatedOptions = [...checkboxOptions];
      updatedOptions.splice(index, 1);
      setCheckboxOptions(updatedOptions);
    } else if (selectedTab === FBElements.RADIO_GROUP) {
      const updatedOptions = [...radioOptions];
      updatedOptions.splice(index, 1);
      setRadioOptions(updatedOptions);
    } else if (selectedTab === FBElements.SELECT_BOX) {
      const updatedOptions = [...selectInputOptions];
      updatedOptions.splice(index, 1);
      setSelectInputOptions(updatedOptions);
    }
  };
  // Create JSON elements
  const getElement = useCallback(
    (label: string | undefined) => {
      const commonProps = {
        id: formId,
        grid: "col-span-12 md:col-span-12",
        name: `${selectedTab}_${formId}`,
        label: label ?? "",
        readonlyRole: [],
        validations: switchIsChecked
          ? [{ type: "required", params: [`${label ?? ""} الزامیست`] }]
          : [],
      };
      switch (selectedTab) {
        case FBElements.CHECKBOX_GROUP:
          return {
            ...commonProps,
            element: FBElements.CHECKBOX_GROUP,
            items: checkboxOptions,
            selectedValues: [],
          } as FBCheckboxElementType;

        case FBElements.RADIO_GROUP:
          return {
            ...commonProps,
            element: FBElements.RADIO_GROUP,
            items: radioOptions,
          } as FBRadioElementType;

        case FBElements.SELECT_BOX:
          return {
            ...commonProps,
            element: FBElements.SELECT_BOX,
            options: selectInputOptions,
            hint: `${label ?? ""} را انتخاب کنید`,
            searchOn: "label",
            placeholder: "جستجو",
          } as FBSelectElementType;

        case FBElements.FILE:
          return {
            ...commonProps,
            element: FBElements.FILE,
            type: "file",
            placeholder: "فایل مورد نظر را انتخاب کنید",
          } as FBFileInputElementType;

        case FBElements.INPUT:
          return {
            ...commonProps,
            element: FBElements.INPUT,
            type: "string",
            placeholder:
              textInput?.length !== 0
                ? textInput
                : `${label ?? ""} را وارد کنید`,
            validationType: "string",
          } as FBInputElementType;

        case FBElements.TEXT_AREA:
          return {
            ...commonProps,
            element: FBElements.TEXT_AREA,
            placeholder:
              paragraphInput?.length !== 0
                ? paragraphInput
                : `${label ?? ""} را وارد کنید`,
            validationType: "string",
          } as FBTextAreaElementType;

        default:
          return { id: formId };
      }
    },
    [
      checkboxOptions,
      formId,
      paragraphInput,
      radioOptions,
      selectInputOptions,
      selectedTab,
      switchIsChecked,
      textInput,
    ],
  );
  // Add button -> update element
  const handleUpdateElement = (label: string | undefined) => {
    const elements = getElement(label);
    updateElement(formId ?? "", elements);
    closeCollapse(formId);
  };

  // Delete button -> delete element
  const handleDeleteElement = () => {
    // state management -> delete element json
    deleteElement(formId ?? "");
  };

  const formValidationSchema = useMemo(() => {
    return yup.object({
      label: validation.requiredInput,
    });
  }, []);

  return (
    <>
      <FormHandler
        validationSchema={formValidationSchema}
        initialValues={{ label: titleInput }}
        handleSubmit={(values, utils) => {
          handleUpdateElement((values as any).label);
        }}
      >
        {(formik) => (
          <>
            {/* step 1 */}
            <div className="flex flex-row items-center">
              <div className="pl-2 md:px-6">
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-info bg-opacity-15 text-[18px] font-bold text-info md:h-[50px] md:w-[50px]">
                  ۱
                </span>
              </div>
              <div className="w-full md:w-1/3">
                <Input
                  placeholder="مثلا: نوع نمونه یا جنس نمونه یا ..."
                  label="عنوان سوال"
                  name={"label"}
                  formik={formik}
                  autoComplete={"label"}
                />
              </div>
            </div>
            {/* step 2 */}
            <div className="mt-10 flex flex-row items-center">
              <div className="pl-2 md:px-6">
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-info bg-opacity-15 text-[18px] font-bold text-info md:h-[50px] md:w-[50px]">
                  ۲
                </span>
              </div>
              <div>
                <h6 className="text-[18px] font-bold">انتخاب نوع پاسخ کاربر</h6>
                <p className="pt-2 text-[14px]">
                  برای دریافت پاسخ سوال از مشتری، هر کدام از انواع ورودی‌های زیر
                  که نیاز است را انتخاب کنید.
                </p>
              </div>
            </div>
            {/* tabs */}
            <div className="my-8 flex flex-row flex-nowrap gap-6 overflow-x-auto whitespace-nowrap md:gap-10 md:px-[100px]">
              {(Object.keys(tabIconsMapping) as Array<ExtractedFBElement>).map(
                (tab) => (
                  <div
                    key={tab}
                    className={`flex cursor-pointer flex-row gap-1 md:gap-2 ${
                      selectedTab === tab ? "border-b-2" : ""
                    } border-info pb-2`}
                    onClick={() => {
                      // if (tab === "file") return;
                      setSelectedTab(tab);
                    }}
                  >
                    <SvgIcon
                      fillColor={`${selectedTab === tab ? "info" : "black"}`}
                      className={`[&_svg]:h-[20px] [&_svg]:w-[20px]`}
                      // ${tab === "file" ? "opacity-30" : ""}
                    >
                      {tabIconsMapping[tab]}
                    </SvgIcon>
                    <h6
                      className={`text-[14px]`}
                      // ${tab === "file" ? "opacity-40" : ""}
                    >
                      {tabTitlesMapping[tab]}
                    </h6>
                  </div>
                ),
              )}
            </div>
            {/* tabs content */}
            {selectedTab === FBElements.CHECKBOX_GROUP && (
              <OptionsForm
                newOption={newCheckboxOption}
                setNewOption={setNewCheckboxOption}
                handleAddOption={handleAddOption}
                options={checkboxOptions}
                iconName="square"
                handleDeleteOption={handleDeleteOption}
              />
            )}

            {selectedTab === FBElements.RADIO_GROUP && (
              <OptionsForm
                newOption={newRadioOption}
                setNewOption={setNewRadioOption}
                handleAddOption={handleAddOption}
                options={radioOptions}
                iconName="circle"
                handleDeleteOption={handleDeleteOption}
              />
            )}

            {selectedTab === FBElements.SELECT_BOX && (
              <OptionsForm
                newOption={newSelectInputOption}
                setNewOption={setNewSelectInputOption}
                handleAddOption={handleAddOption}
                options={selectInputOptions}
                iconName="dash-square"
                handleDeleteOption={handleDeleteOption}
              />
            )}
            <div className="flex flex-row gap-4 md:px-[100px]">
              <div className="w-full md:w-2/5">
                {selectedTab === FBElements.INPUT && (
                  <Input
                    placeholder="متن جایگزین ورودی"
                    label="متن جایگزین"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                )}
                {selectedTab === FBElements.TEXT_AREA && (
                  <TextArea
                    placeholder="متن جایگزین ورودی"
                    label="متن جایگزین"
                    value={paragraphInput}
                    onChange={(e) => {
                      setParagraphInput(e.target.value);
                    }}
                  />
                )}
                {selectedTab === FBElements.FILE && (
                  <Input
                    placeholder="فایل مورد نظر را انتخاب کنید"
                    label="متن جایگزین"
                    disabled
                  />
                )}
              </div>
            </div>

            <div className="my-8 md:px-6">
              <h6 className="pb-2 text-[18px] font-bold">تنظیمات</h6>
              <Switch checked={switchIsChecked} onChange={setChecked}>
                <span className="text-[14px] md:text-[16px]">
                  دریافت ورودی از کاربر اجباری باشد
                </span>{" "}
              </Switch>
            </div>
            {/* form actions */}
            <div className="flex flex-row justify-center gap-4 sm:justify-end md:px-6">
              <Button
                variant="outline"
                color="info"
                className="text-info"
                onClick={handleDeleteElement}
                startIcon={
                  <SvgIcon
                    fillColor={"info"}
                    className={"[&_svg]:h-[18px] [&_svg]:w-[18px]"}
                  >
                    <IcDelete />
                  </SvgIcon>
                }
              >
                حذف سوال
              </Button>
              <Button
                variant="solid"
                color="info"
                startIcon={
                  <SvgIcon
                    fillColor={"white"}
                    className={"[&_svg]:h-[18px] [&_svg]:w-[18px]"}
                  >
                    <IcCheck />
                  </SvgIcon>
                }
                type={"submit"}
                disabled={!formik.isValid}
              >
                ثبت سوال
              </Button>
            </div>
          </>
        )}
      </FormHandler>
    </>
  );
};

export default Form;
