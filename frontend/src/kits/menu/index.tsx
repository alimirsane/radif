import React, { useState } from "react";
import { MenuType } from "@kit/menu/type";
import { Popup } from "@kit/popup";

export const Menu = (props: MenuType) => {
  const { children, ...data } = props;

  return (
    <Popup {...data} backdrop>
      {children}
    </Popup>
  );
};
