import { FormBuilderCoreManagement } from "../form-handler";
import { FBElements } from "../type/element";
import Container from "@feature/dashboard/common/container";
import React from "react";
import { FBElementProp } from "@module/form-builder/type/sample";
import { CHECKBOX_SEPARATOR } from "@kit/checkbox";

type FBLoaderProps = {
  jsonFB: FBElementProp[];
};

export const FBSimpleLoader: React.FC<FBLoaderProps> = ({ jsonFB }) => {
  return (
    <>
      {React.Children.toArray(
        jsonFB.map((jsonItem) => (
          <div className={"flex gap-[1px]"}>
            {jsonItem.element === FBElements.INPUT && "label" in jsonItem && (
              <p>
                <span className="whitespace-wrap text-[14px]">
                  {jsonItem.label}:
                </span>
                &nbsp;
                <span className="py-2 text-[14px] font-[700]">
                  {jsonItem.value ?? "-"}
                </span>
              </p>
            )}
            {jsonItem.element === FBElements.SELECT_BOX &&
              "label" in jsonItem &&
              "options" in jsonItem && (
                <p>
                  <span className="whitespace-wrap text-[14px]">
                    {jsonItem.label}:
                  </span>
                  &nbsp;
                  <span className="py-2 text-[14px] font-[700]">
                    {jsonItem.options
                      ? jsonItem.options.find(
                          (option) => option?.value === jsonItem.value,
                        )?.label ?? "-"
                      : jsonItem.value ?? "-"}
                  </span>
                </p>
              )}
            {jsonItem.element === FBElements.TEXT_AREA &&
              "label" in jsonItem && (
                <p>
                  <span className="whitespace-wrap text-[14px]">
                    {jsonItem.label}:
                  </span>
                  &nbsp;
                  <span className=" py-2 text-[14px] font-[700]">
                    {jsonItem.value ?? "-"}
                  </span>
                </p>
              )}
            {jsonItem.element === FBElements.RADIO_GROUP &&
              "label" in jsonItem && (
                <p>
                  <span className="whitespace-wrap text-[14px]">
                    {jsonItem.label}:
                  </span>
                  &nbsp;
                  <span className="py-2 text-[14px] font-[700]">
                    {jsonItem.value ?? "-"}
                  </span>
                </p>
              )}
            {jsonItem.element === FBElements.CHECKBOX_GROUP &&
              "label" in jsonItem && (
                <p>
                  <span className="whitespace-wrap text-[14px]">
                    {jsonItem.label}:
                  </span>
                  &nbsp;
                  <span className="py-2 text-[14px] font-[700]">
                    {/* sort the selected values based on the items order */}
                    {typeof jsonItem.value === "string"
                      ? jsonItem.items
                          .filter((item) =>
                            jsonItem.value
                              ?.split(CHECKBOX_SEPARATOR)
                              .includes(item.value ?? ""),
                          )
                          .map((item) => item.label)
                          .join("، ") ?? "-"
                      : "-"}
                    {/* {typeof jsonItem.value === "string"
                      ? jsonItem.value?.split(CHECKBOX_SEPARATOR).join(", ") ??
                        "---"
                      : "*"} */}
                  </span>
                </p>
              )}
            {/* {jsonItem.element === FBElements.TEXT_AREA && <></>} */}
            {/* {jsonItem.element === FBElements.RADIO_GROUP && <></>} */}
            {/* {jsonItem.element === FBElements.CHECKBOX_GROUP && <></>} */}
            {jsonItem.element === FBElements.FILE && <></>}
            {jsonItem.element === FBElements.COLLAPSE && <></>}
          </div>
        )),
      )}
    </>
  );
};
