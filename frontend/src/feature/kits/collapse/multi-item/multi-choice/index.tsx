import React, { useMemo, useState } from "react";
import { Collapse } from "@kit/collapse";
import { Card } from "@kit/card";

export const CollapseMultiItemMultiChoiceLayout = () => {
  const [expandItem, setExpandItem] = useState<Array<string>>([]);

  const items = useMemo(() => {
    return [{ id: "4" }, { id: "5" }, { id: "6" }];
  }, []);

  const handleClickOnCollapseItem = (id: string) => () => {
    if (expandItem.includes(id)) {
      setExpandItem((prevState) => prevState.filter((item) => item != id));
    } else {
      setExpandItem((prevState) => [...prevState, id]);
    }
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
            <Collapse open={expandItem.includes(item.id)}>
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
