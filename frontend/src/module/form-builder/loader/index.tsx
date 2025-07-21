import { FormBuilderCoreManagement } from "../form-handler";
import { FBElements } from "../type/element";
import React from "react";
import { FBInput } from "./input";
import { FBButton } from "./button";
import { FBSelect } from "./select";
import { FBRadio } from "./radio";
import { FBCheckbox } from "./checkbox";
import { FBFileInput } from "./fileInput";
import { FBElementProp } from "@module/form-builder/type/sample";
import { FBCollapse } from "./collapse";
import { FBInputElementType } from "../type/sample/input";
import { FBButtonElementType } from "../type/sample/button";
import { FBSelectElementType } from "../type/sample/select";
import { FBRadioElementType } from "../type/sample/radio";
import { FBCheckboxElementType } from "../type/sample/checkbox";
import { FBFileInputElementType } from "../type/sample/file";
import { FBCollapseElementType } from "../type/sample/collapse";
import { FBTextAreaElementType } from "../type/sample/textarea";
import { FBTextArea } from "./textarea";

type FBLoaderProps = {
  submitFB: (values: unknown) => void;
  jsonFB: FBElementProp[];
};

export const FBLoader: React.FC<FBLoaderProps> = ({ submitFB, jsonFB }) => {
  return (
    <>
      <FormBuilderCoreManagement
        formSchema={jsonFB}
        handleSubmit={(values) => {
          submitFB(values);
        }}
      >
        {(formik) => (
          <div className={"grid grid-cols-12 gap-4"}>
            {React.Children.toArray(
              jsonFB.map((jsonItem) => (
                // todo: to handle grid col option add this class to the classname of div element
                // ${jsonItem.grid}
                <div
                  className={`px-2 ${jsonItem.element === FBElements.BUTTON ? "place-self-end self-center" : "self-auto"}
                    col-span-12`}
                >
                  {jsonItem.element === FBElements.INPUT && (
                    <FBInput
                      formik={formik}
                      properties={jsonItem as FBInputElementType}
                    />
                  )}
                  {jsonItem.element === FBElements.TEXT_AREA && (
                    <FBTextArea
                      formik={formik}
                      properties={jsonItem as FBTextAreaElementType}
                    />
                  )}
                  {jsonItem.element === FBElements.BUTTON && (
                    <FBButton properties={jsonItem as FBButtonElementType} />
                  )}
                  {jsonItem.element === FBElements.SELECT_BOX && (
                    <FBSelect
                      formik={formik}
                      properties={jsonItem as FBSelectElementType}
                    />
                  )}
                  {jsonItem.element === FBElements.RADIO_GROUP && (
                    <FBRadio
                      formik={formik}
                      properties={jsonItem as FBRadioElementType}
                    />
                  )}
                  {jsonItem.element === FBElements.CHECKBOX_GROUP && (
                    <FBCheckbox
                      formik={formik}
                      properties={jsonItem as FBCheckboxElementType}
                    />
                  )}
                  {jsonItem.element === FBElements.FILE && (
                    <FBFileInput
                      formik={formik}
                      properties={jsonItem as FBFileInputElementType}
                    />
                  )}
                  {jsonItem.element === FBElements.COLLAPSE && (
                    <FBCollapse
                      properties={jsonItem as FBCollapseElementType}
                    />
                  )}
                </div>
              )),
            )}
          </div>
        )}
      </FormBuilderCoreManagement>
    </>
  );
};
