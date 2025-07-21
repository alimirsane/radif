import { Button } from "@kit/button";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Tabs = () => {
  const router = useRouter();
  const navigateHandler = (name: string) => {
    router.query.tab_msg = name;
    router.replace(router);
  };
  const tabList = useMemo(() => {
    return [
      {
        text: "همه پیام‌ها",
        name: "all-messages",
      },
      {
        text: "اطلاع رسانی",
        name: "news",
      },
      {
        text: "تراکنش‌ها",
        name: "transaction",
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div className="flex gap-[12px]">
      {tabList.map((tab, index) => (
        <div
          className={`
                            cursor-pointer rounded-3xl px-[16px] py-[8px] text-[12px] text-typography-main
                            ${
                              !router.query.tab_msg
                                ? tab.name === "all-messages"
                                  ? "border-[1px] border-primary"
                                  : "bg-background-paper-dark"
                                : router.query.tab_msg === tab.name
                                  ? "border-[1px] border-primary"
                                  : "bg-background-paper-dark"
                            }
                        `}
          key={index}
          onClick={() => navigateHandler(tab.name)}
        >
          {tab.text}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
