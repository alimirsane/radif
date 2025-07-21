import { Button } from "@kit/button";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Tabs = () => {
  const router = useRouter();

  const tabList = useMemo(() => {
    return [
      {
        text: "همه پیام‌ها",
        click: () => {
          router.query.tab_msg = "all";
          router.replace(router);
        },
        name: "all",
      },
      {
        text: "اطلاع رسانی",
        click: () => {
          router.query.tab_msg = "news";
          router.replace(router);
        },
        name: "news",
      },
      {
        text: "تراکنش‌ها",
        click: () => {
          router.query.tab_msg = "transaction";
          router.replace(router);
        },
        name: "transaction",
      },
    ];
  }, [router]);

  return (
    <div className="flex gap-[12px]">
      {tabList.map((tab, index) => (
        <div
          className={`cursor-pointer rounded-3xl px-[16px] py-[8px] text-[12px] text-typography-main
                            ${router.query.tab_msg === tab.name ? "border-[1px] border-primary" : "bg-background-paper-dark"}
                        `}
          key={index}
          onClick={tab.click}
        >
          {tab.text}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
