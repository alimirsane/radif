import React, { useState } from "react";
import { FBCollapseElementType } from "@module/form-builder/type/sample/collapse";
import { Card } from "@kit/card";
import { Collapse } from "@kit/collapse";

interface FBCollapseProps {
  properties: FBCollapseElementType;
}

export const FBCollapse = (props: FBCollapseProps) => {
  const { properties } = props;

  const [expandItem, setExpandItem] = useState<Array<string>>([]);

  const handleClickOnCollapseItem = (id: string) => () => {
    if (expandItem.includes(id)) {
      setExpandItem((prevState) => prevState.filter((item) => item != id));
    } else {
      setExpandItem((prevState) => [...prevState, id]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {React.Children.toArray(
        properties.items.map((item, index) => (
          <>
            <div
              className={"cursor-pointer"}
              onClick={handleClickOnCollapseItem(item.id)}
            >
              <h6 className="px-3 pt-2 text-[18px] font-[700]">{item.label}</h6>
            </div>
            <Collapse
              open={
                (expandItem.length && expandItem.includes(item.id)) ||
                (!expandItem.length && properties.items.length - 1) === index
              }
            >
              <Card variant="outline" color={"white"} className={"p-2"}>
                <h1>{item.value}</h1>
              </Card>
            </Collapse>
          </>
        )),
      )}
    </div>
  );
};
