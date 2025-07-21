import { useState } from "react";
import { FBElementProp } from "@module/form-builder/type/sample";
import { FBElements } from "@module/form-builder/type/element";

const useFormState = (element: FBElementProp, selectedTab: FBElements) => {
  const [checkboxOptions, setCheckboxOptions] = useState(
    "items" in element && element.element === FBElements.CHECKBOX_GROUP
      ? element.items
      : [],
  );
  const [newCheckboxOption, setNewCheckboxOption] = useState("");
  const [radioOptions, setRadioOptions] = useState(
    "items" in element && element.element === FBElements.RADIO_GROUP
      ? element.items
      : [],
  );
  const [newRadioOption, setNewRadioOption] = useState("");
  const [selectInputOptions, setSelectInputOptions] = useState(
    "options" in element && element.element === FBElements.SELECT_BOX
      ? element.options
      : [],
  );
  const [newSelectInputOption, setNewSelectInputOption] = useState("");
  const [textInput, setTextInput] = useState(
    "placeholder" in element && element.element === FBElements.INPUT
      ? element.placeholder
      : "",
  );
  const [paragraphInput, setParagraphInput] = useState(
    "placeholder" in element && element.element === FBElements.TEXT_AREA
      ? element.placeholder
      : "",
  );
  const [titleInput, setTitleInput] = useState(
    "label" in element ? element.label : "",
  );
  const [switchIsChecked, setChecked] = useState<boolean>(
    "validations" in element && element.validations?.length === 0
      ? false
      : true,
  );

  return {
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
  };
};

export default useFormState;
