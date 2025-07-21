import React, { useEffect, useMemo, useRef, useState } from "react";
import { ButtonType } from "./type";
import { twMerge } from "tailwind-merge";

export const Button = (props: ButtonType) => {
  const {
    size,
    variant,
    children,
    endIcon,
    startIcon,
    color,
    className,
    shadow,
    ...data
  } = props;

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const typeStyle = useMemo(() => {
    switch (variant) {
      case "text":
        switch (color) {
          case "paper":
            return "btn-transparent text-main";
          case "black":
            return "btn-transparent text-common-black";
          case "warning":
            return "btn-transparent text-warning";
          case "info":
            return "btn-transparent text-info";
          case "secondary-light":
            return "btn-transparent text-secondary-dark";
          case "secondary":
            return "btn-transparent text-secondary";
          case "success":
            return "btn-transparent text-success";
          case "error":
            return "btn-transparent text-error";
          case "primary":
            return "btn-transparent text-primary";
          case "pending":
            return "btn-transparent text-pending";
          default:
            return "btn-transparent";
        }
      case "outline":
        switch (color) {
          case "paper":
            return "btn-outline-primary border-background-paper text-typography-main";
          case "black":
            return "btn-outline-primary border-common-black text-typography-common-white";
          case "warning":
            return "btn-outline-primary border-warning text-typography-warning-constraint";
          case "info":
            return "btn-outline-primary border-info text-typography-info-constraint";
          case "secondary-light":
            return "btn-outline-primary border-secondary-light text-secondary-dark";
          case "secondary":
            return "btn-outline-primary border-secondary text-typography-secondary-constraint";
          case "success":
            return "btn-outline-primary border-success text-typography-success-constraint";
          case "error":
            return "btn-outline-primary border-error text-typography-error-constraint";
          case "pending":
            return "btn-outline-pending border-pending text-typography-pending-constraint";
          case "white":
            return "btn-outline-primary border-common-white text-typography-common-black";
          default:
            return "btn-outline-primary ";
        }
      default:
        switch (color) {
          case "paper":
            return "btn-solid-primary bg-background-paper text-typography-main";
          case "black":
            return "btn-solid-primary bg-common-black text-typography-common-white";
          case "warning":
            return "btn-solid-primary bg-warning text-typography-warning-constraint";
          case "info":
            return "btn-solid-primary bg-info text-typography-info-constraint";
          case "secondary-light":
            return "btn-solid-primary bg-secondary-light text-secondary-dark";
          case "secondary":
            return "btn-solid-primary bg-secondary text-typography-secondary-constraint";
          case "success":
            return "btn-solid-primary bg-success text-typography-success-constraint";
          case "error":
            return "btn-solid-primary bg-error text-typography-error-constraint";
          case "pending":
            return "btn-solid-pending bg-pending text-typography-pending-constraint";
          case "white":
            return "btn-solid-primary bg-common-white text-typography-common-black";
          default:
            return "btn-solid-primary";
        }
    }
  }, [variant, color]);

  const sizeStyle = useMemo(() => {
    switch (size) {
      case "tiny":
        return "px-[3px] py-[1.5px]";
      case "small":
        return "px-[8px] py-[4px]";
      case "large":
        return "px-[32px] py-[16px]";
      default:
        return "px-[16px] py-[8px]";
    }
  }, [size]);

  const [scaleDownPercent, setScaleDownPercent] = useState("100%");

  const handleActive = (mouseDown: boolean) => (event: any) => {
    if (buttonRef.current?.contains(event.target) && mouseDown) {
      setScaleDownPercent(
        ((buttonRef.current?.scrollWidth - 7.5) * 100) /
          buttonRef.current?.scrollWidth +
          "%",
      );
    } else {
      setScaleDownPercent("100%");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleActive(true));
    document.addEventListener("mouseup", handleActive(false));
    return () => {
      document.removeEventListener("mousedown", handleActive(true));
      document.removeEventListener("mouseup", handleActive(false));
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        {...data}
        className={twMerge(
          sizeStyle,
          typeStyle,
          className,
          shadow ? "shadow-sm shadow-background-paper-dark" : "",
          variant === "text"
            ? "hover:shadow-sm hover:shadow-background-paper-dark active:shadow-inner"
            : "",
        )}
        style={{
          transform: `scale(${scaleDownPercent})`,
        }}
      >
        {startIcon && <>{startIcon}</>}
        {children}
        {endIcon && <>{endIcon}</>}
      </button>
    </>
  );
};
