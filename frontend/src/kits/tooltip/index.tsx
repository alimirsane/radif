import React, { ReactNode } from "react";

interface TooltipProps {
  message: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ message, children }) => {
  return (
    <div className="group relative flex max-w-max flex-col items-center justify-center">
      {children}
      <div className="absolute bottom-5 left-1/2 ml-auto mr-auto min-w-max -translate-x-1/2 scale-0 transform rounded-lg px-3 py-2 transition-all duration-500 group-hover:scale-100">
        <div className="flex max-w-xs flex-col items-center">
          <div className="rounded bg-typography-secondary px-3 py-[7px] text-center text-[12px] leading-relaxed text-common-white">
            {message}
          </div>
          <div
            className="h-2 w-4 bg-typography-secondary"
            style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default Tooltip;
