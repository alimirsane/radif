import { twMerge } from "tailwind-merge";
import { ModalType } from "@kit/modal/type";
import { useMemo } from "react";
import { useModalHandler } from "../../utils/modal-handler/config";

export const Modal = (props: ModalType) => {
  const { dismissOutside, children, fullscreen, className, ...data } = props;
  const hideModal = useModalHandler((state) => state.hideModal);
  const handleClickOnBackdrop = () => {
    if (!dismissOutside) return;
    hideModal();
  };

  const fullscreenStyle = useMemo(() => {
    switch (fullscreen) {
      case "xs":
        return "[&>*]:max-xs:w-full [&>*]:max-xs:h-full";
      case "sm":
        return "[&>*]:max-sm:w-full [&>*]:max-sm:h-full";
      case "md":
        return "[&>*]:max-md:w-full [&>*]:max-md:h-full";
      case "lg":
        return "[&>*]:max-lg:w-full [&>*]:max-lg:h-full";
      case "xl":
        return "[&>*]:max-xl:w-full [&>*]:max-xl:h-full";
      default:
        return "";
    }
  }, [fullscreen]);

  return (
    <div
      {...data}
      onClick={handleClickOnBackdrop}
      className={twMerge("modal-wrapper", fullscreenStyle, className)}
    >
      <div onClick={(event) => event.stopPropagation()}>{children}</div>
    </div>
  );
};
