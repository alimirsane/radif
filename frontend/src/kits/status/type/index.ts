import { HTMLAttributes } from "react";
import { CardType } from "@kit/card/type";

export interface StatusType
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    Pick<CardType, "color"> {}
