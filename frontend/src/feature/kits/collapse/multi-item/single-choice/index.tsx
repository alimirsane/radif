import React, { useMemo, useState } from "react";
import { Collapse } from "@kit/collapse";
import { Card } from "@kit/card";

export const CollapseMultiItemSingleChoiceLayout = () => {
  const [expandItem, setExpandItem] = useState<string | undefined>(undefined);

  const items = useMemo(() => {
    return [{ id: "1" }, { id: "2" }, { id: "3" }];
  }, []);

  const handleClickOnCollapseItem = (id: string) => () => {
    setExpandItem((prevState) => (prevState === id ? undefined : id));
  };

  return (
    <div className={"flex flex-col gap-1"}>
      {React.Children.toArray(
        items.map((item) => (
          <Card className={"flex flex-col gap-2 p-2"} color={"primary"}>
            <div
              className={"cursor-pointer"}
              onClick={handleClickOnCollapseItem(item.id)}
            >
              کلیک برای باز و بسته شدن
            </div>
            <Collapse open={expandItem == item.id}>
              <Card color={"warning"} className={"p-2"}>
                <h1>تست منو باز شده</h1>
              </Card>
            </Collapse>
          </Card>
        )),
      )}
    </div>
  );
};
