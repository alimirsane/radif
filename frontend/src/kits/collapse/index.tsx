import { CollapseType } from "./type";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export const Collapse = (props: CollapseType) => {
  const { open, className, ...data } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const [refHeight, setRefHeight] = useState<string | undefined>(undefined);
  const [maxHeight, setMaxHeight] = useState<string | undefined>(
    open ? refHeight : "0px",
  );
  const [displayStyle, setDisplayStyle] = useState<
    "hidden" | "inline-block" | undefined
  >(undefined);

  useEffect(() => {
    if (displayStyle) return;
    if (!refHeight) return;
    setDisplayStyle(open ? "inline-block" : "hidden");
  }, [displayStyle, open, refHeight]);

  useEffect(() => {
    const timeoutDisplay = setTimeout(
      () => setDisplayStyle(open ? "inline-block" : "hidden"),
      !open ? 525 : 0,
    );
    const timeoutHeight = setTimeout(
      () => setMaxHeight(open ? refHeight : "0px"),
      open ? 5 : 0,
    );
    return () => {
      clearTimeout(timeoutDisplay);
      clearTimeout(timeoutHeight);
    };
  }, [open, refHeight]);

  useEffect(() => {
    if (!ref.current?.scrollHeight) return;
    setRefHeight(ref.current?.scrollHeight + "px");
  }, [ref.current?.scrollHeight]);

  return (
    <div
      {...data}
      className={twMerge(
        className,
        displayStyle,
        "overflow-hidden transition-all duration-500",
      )}
      style={{
        maxHeight: maxHeight,
      }}
      ref={ref}
    />
  );
};
