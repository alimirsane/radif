import React, { ReactNode } from "react";

interface BreadcrumbProps {
  children: ReactNode[];
}

export function Breadcrumb(props: BreadcrumbProps) {
  const { children } = props;

  return (
    <div id="print-hidden" className={"flex items-center gap-2"}>
      {React.Children.toArray(
        children.map((value, index) => {
          return (
            <>
              {value}
              <p className={"text-typography-gray text-xs"}>{index != children.length - 1 && "/"}</p>
            </>
          );
        }),
      )}
    </div>
  );
}