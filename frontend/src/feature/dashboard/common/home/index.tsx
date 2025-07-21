import { Card } from "@kit/card";
import Link from "next/link";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import React, { ReactNode, useMemo } from "react";
import {
  AccessLevelModules,
  AccessLevelPermissions,
} from "@feature/dashboard/common/access-level/types";
import { SvgIcon } from "@kit/svg-icon";
import { IcArrowLeft, IcCardList } from "@feature/kits/common/icons";
import { ColorTypes } from "@kit/common/color-type";

export interface HomeItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  route: string;
  module?: AccessLevelModules;
  permission?: Array<AccessLevelPermissions>;
  operator?: "and" | "or";
}

interface HomeProps {
  items: Array<HomeItemProps>;
}

const Home = (props: HomeProps) => {
  const { items } = props;
  const colors = useMemo(() => {
    return ["info", "secondary", "warning", "success"];
  }, []);
  return (
    <Card
      color={"white"}
      className={
        "grid gap-[16px] px-[20px] py-[30px] sm:grid-cols-2 md:grid-cols-3 md:gap-[32px] lg:grid-cols-3"
      }
    >
      {React.Children.toArray(
        items.map((item, index) => (
          <AccessLevel
            module={item.module}
            permission={item.permission}
            operator={item.operator}
          >
            <Link
              href={item.route}
              target={item.title === "نظرسنجی" ? "_blank" : "_self"}
              key={index}
            >
              <div className="flex h-full flex-col">
                {/* <Card
                  coverage
                  color={"white"}
                  variant={"outline"}
                  className={
                    "flex-grow border-primary px-[16px] py-[26px] transition-all duration-500 hover:bg-primary-light hover:bg-opacity-20 [&>h3]:text-[18px] [&>h3]:font-bold [&>p]:mt-[10px] [&>p]:text-[14px]"
                  }
                >
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </Card> */}
                <Card
                  coverage
                  color="white"
                  className="flex flex-grow flex-col border border-paper border-opacity-10 shadow-sm transition-all duration-500 hover:shadow-lg [&>div]:duration-500 [&>div]:hover:bg-opacity-15"
                >
                  <div
                    className={`flex flex-row items-center gap-[6px] rounded-t-lg bg-${colors[index % 4] ?? "primary"} bg-opacity-5 px-4 py-3 `}
                  >
                    <SvgIcon
                      className="[&_svg]:h-[22px] [&_svg]:w-[22px]"
                      fillColor={(colors[index % 4] as ColorTypes) ?? "primary"}
                    >
                      {item.icon ?? <IcCardList />}
                    </SvgIcon>
                    <h2
                      className={`text-[20px] font-semibold text-${colors[index % 4] ?? "primary"}`}
                    >
                      {item.title}
                    </h2>
                  </div>
                  <div className="flex h-full w-full flex-col justify-between gap-2 px-5 pb-4 pt-5">
                    <p className="text-[14px] leading-6 text-common-gray">
                      {item.description}
                    </p>
                    <div className="flex flex-row items-center justify-end gap-2">
                      <span
                        className={`text-[13px] text-${colors[index % 4] ?? "primary"}`}
                      >
                        مشاهده
                      </span>
                      <SvgIcon
                        className="[&_svg]:h-[10px] [&_svg]:w-[10px]"
                        fillColor={
                          (colors[index % 4] as ColorTypes) ?? "primary"
                        }
                      >
                        <IcArrowLeft />
                      </SvgIcon>
                    </div>
                  </div>
                </Card>
              </div>
            </Link>
          </AccessLevel>
        )),
      )}
    </Card>
  );
};

export default Home;
