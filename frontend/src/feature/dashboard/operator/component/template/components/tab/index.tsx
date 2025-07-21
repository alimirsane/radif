import { TabType } from "./type";
import { useMemo } from "react";
import { useRouter } from "next/router";

const Tab = (props: TabType) => {
  const router = useRouter();
  const { color, count, text, select, click } = props;
  const tabStyles = useMemo(() => {
    switch (color) {
      case "success":
        switch (select) {
          case "selected":
            return "bg-success/70 text-common-white";
          default:
            return "bg-success/10 text-success";
        }
      case "info":
        switch (select) {
          case "selected":
            return "bg-info/70 text-common-white";
          default:
            return "bg-info/10 text-info";
        }
      case "error":
        switch (select) {
          case "selected":
            return "bg-error/70 text-common-white";
          default:
            return "bg-error/10 text-error";
        }
      case "paper":
        switch (select) {
          case "selected":
            return "bg-common-gray/70 text-common-white";
          default:
            return "bg-common-gray/15 text-common-gray-dark";
        }
      case "primary":
        switch (select) {
          case "selected":
            return "bg-primary text-common-white";
          default:
            return "bg-primary-light/25 text-primary";
        }
      case "warning":
        switch (select) {
          case "selected":
            return "bg-warning text-common-white";
          default:
            return "bg-warning/15 text-warning";
        }
      case "secondary":
        switch (select) {
          case "selected":
            return "bg-secondary text-common-white";
          default:
            return "bg-secondary-light/25 text-secondary";
        }
      default:
        switch (select) {
          case "selected":
            return "bg-common-gray/30";
          default:
            return "bg-common-gray/15";
        }
    }
  }, [color, select]);

  return (
    <div
      className={`flex w-full cursor-pointer items-center gap-2 rounded-[8px] px-[10px] py-[15px] ${tabStyles}`}
      onClick={click}
    >
      <div className="flex h-[34px] w-[36px] items-center justify-center rounded-[6px] bg-common-white p-1 text-[16px] font-bold text-common-black">
        {count}
      </div>
      <p className="text-black text-[14px] font-bold">{text}</p>
    </div>
  );
};

export default Tab;
