import React from "react";
import { NavItems } from "@feature/dashboard/common/navigation/items";

const Drawer = () => {
  return (
    <div
      className={`absolute right-0 w-full border-t-[1px] border-t-typography-secondary/40 bg-common-white p-[32px] shadow-lg lg:hidden`}
    >
      <div className="flex flex-col gap-[32px]">
        <NavItems />
      </div>
    </div>
  );
};

export default Drawer;
