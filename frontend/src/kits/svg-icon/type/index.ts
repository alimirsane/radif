import { SVGAttributes } from "react";
import { ColorTypes } from "@kit/common/color-type";

export interface SvgIconTypes extends SVGAttributes<HTMLOrSVGElement> {
  strokeColor?: ColorTypes;
  fillColor?: ColorTypes;
}
