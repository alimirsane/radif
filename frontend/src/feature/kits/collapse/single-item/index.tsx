import React, { useState } from "react";
import { Collapse } from "@kit/collapse";
import { Card } from "@kit/card";

export const CollapseSingleItemLayout = () => {
  const [open, setOpen] = useState(false);

  const handleClickOnCollapseItem = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <div>
      <Card className={"flex flex-col gap-2 p-2"} color={"primary"}>
        <div className={"cursor-pointer"} onClick={handleClickOnCollapseItem}>
          کلیک برای باز و بسته شدن
        </div>
        <Collapse open={open}>
          <Card color={"warning"} className={"p-2"}>
            <h1>تست منو باز شده</h1>
          </Card>
        </Collapse>
      </Card>
    </div>
  );
};
