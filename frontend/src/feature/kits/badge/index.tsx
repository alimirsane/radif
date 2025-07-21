import React, { useMemo } from "react";
import { BadgeType } from "./type";

const Badge = (props: BadgeType) => {
  const { color, className, children } = props;
  const colorBadge = useMemo(() => {
    switch (color) {
      case "error":
        return "bg-error";
      case "info":
        return "bg-info";
      case "secondary":
        return "bg-secondary";
      case "success":
        return "bg-success";
      case "primary":
        return "bg-primary";
      case "warning":
        return "bg-warning";
      case "pending":
        return "bg-pending";
    }
  }, [color]);
  return (
    <div
      className={`h-fit w-fit rounded-full  px-2 py-1 text-[12px] text-common-white ${className} ${colorBadge}`}
    >
      {children}
    </div>
  );
};

export default Badge;
