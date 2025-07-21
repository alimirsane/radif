import { apiNotification } from "@api/service/notifications";
import { NotificationType } from "@api/service/notifications/type";
import {
  IcCheckedBox,
  IcCloseBox,
  IcInfoBox,
} from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { Status } from "@kit/status";
import { SvgIcon } from "@kit/svg-icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateHandler } from "@utils/date-handler";
import React, { useMemo, useState } from "react";

const List = ({ notifications }: { notifications: NotificationType[] }) => {
  const clientQuery = useQueryClient();

  const [messageId, setMessageId] = useState("");

  const { mutateAsync } = useMutation(
    apiNotification(false, {
      success: "",
      fail: "",
      waiting: "در حال انتظار",
    }).update(messageId),
  );

  const readHandler = () => {
    const data = {
      is_read: true,
    };
    mutateAsync(data)
      .then((res) => {
        clientQuery.invalidateQueries({
          queryKey: [apiNotification().url],
        });
      })
      .catch((err) => {});
  };
  // get icon based on message type
  const getIcon = (type: string | undefined, is_read: boolean | undefined) => {
    switch (type) {
      case "success":
        return (
          <SvgIcon
            className={`${is_read ? "opacity-60" : "opacity-100"} [&_svg]:h-[20px] [&_svg]:w-[20px]`}
            fillColor="success"
          >
            <IcCheckedBox />
          </SvgIcon>
        );
      case "danger":
        return (
          <SvgIcon
            className={`${is_read ? "opacity-60" : "opacity-100"} [&_svg]:h-[20px] [&_svg]:w-[20px]`}
            fillColor="error"
          >
            <IcCloseBox />
          </SvgIcon>
        );
      case "info":
        return (
          <SvgIcon
            className={`${is_read ? "opacity-60" : "opacity-100"} [&_svg]:h-[20px] [&_svg]:w-[20px]`}
            fillColor="info"
          >
            <IcInfoBox />
          </SvgIcon>
        );
      case "warning":
        return (
          <SvgIcon
            className={`${is_read ? "opacity-60" : "opacity-100"} [&_svg]:h-[20px] [&_svg]:w-[20px]`}
            fillColor="warning"
          >
            <IcInfoBox />
          </SvgIcon>
        );
    }
  };
  // map the status strings to the respective Status components
  const statusMap = useMemo(() => {
    return {
      "در انتظار اپراتور": (
        <span className="rounded-full bg-paper bg-opacity-10 px-2 py-1 text-common-gray">
          در انتظار اپراتور
        </span>
      ),
      "در ‌انتظار پذیرش": (
        <span className="rounded-full bg-secondary bg-opacity-10 px-2 py-1 text-secondary">
          در ‌انتظار پذیرش
        </span>
      ),
      "در انتظار پرداخت": (
        <span className="rounded-full bg-info bg-opacity-10 px-2 py-1 text-info">
          در انتظار پرداخت
        </span>
      ),
      "در ‌انتظار نمونه": (
        <span className="rounded-full bg-warning bg-opacity-10 px-2 py-1 text-warning">
          در انتظار نمونه
        </span>
      ),
      "در حال انجام": (
        <span className="rounded-full bg-primary bg-opacity-10 px-2 py-1 text-primary">
          در حال انجام
        </span>
      ),
      "تکمیل شده": (
        <span className="rounded-full bg-success bg-opacity-10 px-2 py-1 text-success">
          تکمیل شده
        </span>
      ),
      "رد شده": (
        <span className="rounded-full bg-error bg-opacity-10 px-2 py-1 text-error">
          رد شده
        </span>
      ),
    };
  }, []);
  // replace the status keywords in the message content
  const replaceStatusesInContent = (content: string) => {
    const statusKeys = Object.keys(statusMap);

    // Use regex to search for any of the status keys
    const regex = new RegExp(statusKeys.join("|"), "g");

    // Split the content by the statuses found in the content
    const parts = content.split(regex);

    // Find all the matches of the status keys in the content
    const matches = content.match(regex);

    return (
      <span className="flex flex-wrap items-center gap-2 md:flex-row">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {matches &&
              matches[index] &&
              statusMap[matches[index] as keyof typeof statusMap]}
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <ul className="mt-[16px]">
      {notifications.map((message, index) => (
        <li
          key={index}
          className="border-b-[1px] border-background-paper-dark py-[16px] last:border-none"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              {getIcon(message.type, message.is_read)}
              <h1
                className={`relative text-[16px] ${message.is_read ? "font-medium text-typography-gray" : "font-bold"}`}
              >
                {message.title}
                {!message.is_read && (
                  <span
                    className={
                      "absolute top-2 mx-2 h-2 w-2 rounded-xl bg-primary"
                    }
                  />
                )}
              </h1>
            </div>
            <span className="pl-[2px] text-[13px]">
              {DateHandler.formatDate(message.created_at, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </div>
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="mb-[6px] mt-[8px] px-2 text-[13px] md:px-7">
              {message.type === "info"
                ? replaceStatusesInContent(message.content ?? "")
                : message.content}
            </p>
            {!message.is_read && (
              <span className="flex w-full justify-end md:w-auto">
                <Button
                  color={"primary"}
                  onClick={() => {
                    setMessageId(message.id.toString());
                    readHandler();
                  }}
                >
                  خواندم
                </Button>
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default List;
