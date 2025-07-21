import React from "react";
import { HTMLAttributes } from "react";

export interface ContainerType extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
