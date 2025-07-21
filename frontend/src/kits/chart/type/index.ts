import { ColorTypes } from "@kit/common/color-type";

export interface chartType {
  title: string;
  labels: string[];
  type: "bar" | "pie";
  options: any;
  data_obj: {
    label: string;
    data: number[];
    backgroundColor: any;
    //   | ColorTypes
    //   | "#ffffff"
    //   | "#000000"
    //   | "#FF0000"
    //   | "#0D6DF2"
    //   | "#F6F6F6"
    //   | "#4E46B4"
    //   | "#9747FF"
    //   | "#E1CAFF"
    //   | "#07A570"
    //   | "#C68F00";
    stack?: string;
  }[];
}
