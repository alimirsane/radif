import { twMerge } from "tailwind-merge";
import { ContainerType } from "./type";

const Container = ({ children }: ContainerType) => (
  <div id="container" className="mx-auto max-w-[1308px] px-[15px] py-[24px]">
    {children}
  </div>
);

export default Container;
