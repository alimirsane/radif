import { MouseEventHandler, ReactNode } from "react";

export interface ParamCostType {
  price: number;
  paramsCount: number;
  isUrgent: boolean;
  estimatedResultTime: string | number;
  estimatedResultTimeUrgent: string | number;
  children: React.ReactNode;
  testUnitType: string;
}
