import React, { useEffect, useMemo, useState } from "react";
import { Menu as MenuPopup } from "@kit/menu";
import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { IcClose, IcEnvelope } from "@feature/kits/common/icons";
import Message from "@feature/dashboard/common/navigation/message";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiNotification } from "@api/service/notifications";
import { SvgIcon } from "@kit/svg-icon";
import { useRouter } from "next/router";
import { routes } from "@data/routes";
import Link from "next/link";

const NotificationMessages = () => {
  const router = useRouter();
  const { data: notifications, refetch: refetchNotificationsList } = useQuery(
    apiNotification().getAllNotifs(),
  );

  const { data: readAllNotifications, refetch } = useQuery({
    ...apiNotification(true, {
      success: "همه پیام‌ها با موفقیت خوانده شد",
      fail: "خواندن همه پیام‌ها انجام نشد",
      waiting: "در حال انتظار",
    }).readAll(),
    enabled: false,
  });

  const [open, setOpen] = useState(false);
  const clientQuery = useQueryClient();

  const unreadMessageCount = useMemo(() => {
    return notifications?.data?.results?.filter(
      (notification) => !notification.is_read,
    )?.length;
  }, [notifications]);

  useEffect(() => {
    const currentPath = router.asPath;
    const customerRequestsListPath = routes.customerRequestsList();
    if (currentPath === customerRequestsListPath) {
      clientQuery.invalidateQueries({
        queryKey: [apiNotification().url],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // fetch data every 60 seconds
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       await refetchNotificationsList();
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, [refetchNotificationsList]);

  return (
    <MenuPopup
      onChange={(open) => setOpen(open)}
      open={open}
      keepOpen
      holder={
        <div>
          <div className="hidden lg:block">
            <Button className="relative flex w-full items-center justify-between rounded-[8px] bg-error/5 px-[6px] py-[6px] text-[16px] text-typography-main md:px-[16px] md:py-[11px]">
              <span className="pl-2 text-common-black md:pl-5">پیام‌ها</span>
              <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-error/10 text-error md:h-[34px] md:w-[34px]">
                {unreadMessageCount ?? 0}
              </span>
              {!!unreadMessageCount && unreadMessageCount !== 0 && (
                <div
                  className=" absolute right-[-4px] top-[-4px] h-[8px] w-[8px] rounded-full bg-error
           outline outline-[4px] outline-background-default"
                ></div>
              )}
            </Button>
          </div>
          <div className="relative flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-error/15 lg:hidden">
            <SvgIcon
              className={
                "text-common-gray-dark [&_svg]:h-[16px] [&_svg]:w-[18px]"
              }
            >
              <IcEnvelope />
            </SvgIcon>
            {!!unreadMessageCount && unreadMessageCount !== 0 && (
              <div
                className=" absolute right-[-4px] top-[-4px] h-[8px] w-[8px] rounded-full bg-error
           outline outline-[4px] outline-background-default"
              ></div>
            )}
          </div>
        </div>
      }
    >
      <Card
        className="fixed bottom-0 left-0 right-0 h-[100vh] max-h-[70vh] overflow-auto px-2 md:absolute md:bottom-auto md:right-auto md:h-fit md:w-fit md:min-w-[240px]"
        color="white"
      >
        <div className="mb-3 flex items-center justify-between gap-10 px-3 pt-5">
          <p className="text-[16px] font-bold">پیام‌ها</p>

          <div className={"flex items-center gap-2"}>
            <Fab
              color={"white"}
              variant="outline"
              size="small"
              onClick={() => setOpen(false)}
            >
              <IcClose />
            </Fab>
          </div>
        </div>
        {(!notifications?.data?.results ||
          notifications?.data?.results.length === 0) && (
          <p className="px-3 pb-5 text-[13px]">
            شما هنوز پیامی دریافت نکرده‌اید.
          </p>
        )}
        {notifications?.data?.results.length !== 0 &&
          unreadMessageCount === 0 && (
            <p className="px-3 pb-5 text-[13px]">
              پیام خوانده نشده‌ای یافت نشد.
            </p>
          )}
        {notifications?.data?.results?.length !== 0 &&
          notifications?.data?.results
            ?.filter((notification) => !notification.is_read)
            .map((msg, index) => <Message key={index} {...msg} />)}
        <div className="flex w-full flex-row justify-center gap-3 px-3 pb-5">
          {!!unreadMessageCount && unreadMessageCount !== 0 && (
            <Button
              variant={"outline"}
              className="w-1/2"
              onClick={async () => {
                // trigger the readAllNotifications query
                await refetch();
                setOpen(false);
                clientQuery.invalidateQueries({
                  queryKey: [apiNotification().url],
                });
              }}
            >
              <p className={"whitespace-nowrap"}>خواندن همه پیام‌ها</p>
            </Button>
          )}
          <span
            className={`${!!unreadMessageCount && unreadMessageCount !== 0 ? "w-1/2" : "w-full"}`}
          >
            <Link
              href={
                router.asPath.includes(routes.operator())
                  ? routes.operatorMessages()
                  : routes.customerMessages()
              }
            >
              <Button
                variant={"outline"}
                className="w-full"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <p className={"whitespace-nowrap"}>مشاهده همه پیام‌ها</p>
              </Button>
            </Link>
          </span>
        </div>
      </Card>
    </MenuPopup>
  );
};

export default NotificationMessages;
