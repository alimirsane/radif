import { PopupType } from "@kit/popup/type";
import React, { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export const Popup = (props: PopupType) => {
  const {
    holder,
    onChange,
    open: forceOpen,
    backdrop,
    children,
    defaultOpen,
    keepOpen
  } = props;
  const [open, setOpen] = useState(defaultOpen ?? false);

  useEffect(() => {
    setOpen(forceOpen ?? false);
  }, [forceOpen]);

  const backdropBackground = useMemo(() => {
    if (backdrop ?? false) {
      return "bg-opacity-20";
    } else {
      return "bg-opacity-[5%]";
    }
  }, [backdrop]);

  return (
    <div className={"relative"}>
      {open && (
        <div
          className={`fixed inset-0 z-[1] m-auto h-[100vh] w-[100vw] bg-common-gray-dark ${backdropBackground}`}
          onClick={() => {
            setOpen(false);
            onChange?.(false);
          }}
        />
      )}
      {React.cloneElement(holder, {
        onClick: (event: any): any => {
          event.preventDefault();
          event.stopPropagation();
          onChange?.(!open);
          setOpen((prevState) => !prevState);
        },
        className: twMerge(holder.props.className, "z-[2]")
      })}
      {open && (
        <>
          {React.Children.map(children, (child) => {
            return React.cloneElement(child, {
              onClick: (event: any): any => {
                event.preventDefault();
                event.stopPropagation();
                !(keepOpen ?? false) && setOpen(false); // Close the menu when an item is clicked
                !(keepOpen ?? false) && onChange?.(false);
                child.props.onClick && child.props.onClick(event);
              },
              className: twMerge("z-[3] absolute", child.props.className)
            });
          })}
        </>
      )}
    </div>
  );
};
