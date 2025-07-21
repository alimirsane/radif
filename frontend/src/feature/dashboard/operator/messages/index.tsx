import { Card } from "@kit/card";
import Tabs from "./tab";
import List from "./list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiNotification } from "@api/service/notifications";
import { Button } from "@kit/button";
import { useEffect, useMemo, useState } from "react";

const Messages = () => {
  const clientQuery = useQueryClient();
  const [displayLoadingOverlay, setDisplayLoadingOverlay] = useState(true);
  // fetch notifications
  const { data: notifications, refetch: refetchNotifications } = useQuery(
    apiNotification().getAllNotifs({
      useLoadingOverlay: displayLoadingOverlay,
    }),
  );
  // unread messages
  const unreadMessageCount = useMemo(() => {
    return notifications?.data?.results?.filter(
      (notification) => !notification.is_read,
    )?.length;
  }, [notifications]);
  // read all messages
  const { data: readAllNotifications, refetch } = useQuery({
    ...apiNotification(true, {
      success: "همه پیام‌ها با موفقیت خوانده شد",
      fail: "خواندن همه پیام‌ها انجام نشد",
      waiting: "در حال انتظار",
    }).readAll(),
    enabled: false,
  });

  // fetch data every 60 seconds
  useEffect(() => {
    setDisplayLoadingOverlay(false);
    const interval = setInterval(async () => {
      try {
        await refetchNotifications();
      } catch (err) {
        console.error(err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [refetchNotifications]);

  return !!notifications?.data?.results.length ? (
    <Card
      color={"white"}
      variant="outline"
      className={"my-[32px] px-4 pb-2 md:px-8 md:pt-5"}
    >
      <header className="flex w-full flex-col items-center justify-between border-b-[2px] border-background-paper-dark py-6 md:flex-row md:py-2">
        <span className="flex flex-col">
          <h6 className="text-[18px] font-bold">جزئیات پیام‌ها</h6>
          <p className="pb-6 pt-2 text-[14px]">
            در این بخش می‌توانید لیست همه پیام‌ها را مشاهده کنید.
          </p>
        </span>
        <Button
          variant={"outline"}
          disabled={unreadMessageCount === 0}
          onClick={async () => {
            // trigger the readAllNotifications query
            await refetch();
            clientQuery.invalidateQueries({
              queryKey: [apiNotification().url],
            });
          }}
        >
          خواندن همه پیام‌ها
        </Button>
      </header>
      {/* <Tabs /> */}
      <List notifications={notifications?.data?.results} />
    </Card>
  ) : (
    <Card
      color={"info"}
      className="mx-auto mt-[24px] w-[80%] rounded-[8px] p-[22px] text-center text-[14px]"
    >
      پیامی یافت نشد.
    </Card>
  );
};

export default Messages;
