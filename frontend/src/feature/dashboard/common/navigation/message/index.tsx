import { SvgIcon } from "@kit/svg-icon";
import React, { SVGAttributes, useMemo, useState } from "react";
import { Card } from "@kit/card";
import { StatusType } from "@kit/status/type";
import { statusTypes } from "@feature/dashboard/operator/component/template/type";
import { ColorTypes } from "@kit/common/color-type";
import { NotificationType } from "@api/service/notifications/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IcCheckedBox,
  IcCloseBox,
  IcInfoBox,
} from "@feature/kits/common/icons";
import { apiNotification } from "@api/service/notifications";
import { Collapse } from "@kit/collapse";
import { Button } from "@kit/button";
import { apiGrantRecord } from "@api/service/grant-record";
import { Status } from "@kit/status";

const Message = (props: NotificationType) => {
  const { title, type, is_read, content, id } = props;

  const clientQuery = useQueryClient();

  const { mutateAsync } = useMutation(
    apiNotification(false, {
      success: "",
      fail: "",
      waiting: "در حال انتظار",
    }).update(id.toString()),
  );

  const [hover, setHover] = useState(false);

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

  const handleMouseEnter = () => {
    if (is_read) return;
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };
  // map the status strings to the respective Status components
  const statusMap = {
    "در انتظار اپراتور": <Status color="paper">در انتظار اپراتور</Status>,
    "در ‌انتظار پذیرش": <Status color="secondary">در ‌انتظار پذیرش</Status>,
    "در انتظار پرداخت": <Status color="info">در انتظار پرداخت</Status>,
    "در ‌انتظار نمونه": <Status color="warning">در انتظار نمونه</Status>,
    "در حال انجام": <Status color="primary">در حال انجام</Status>,
    "تکمیل شده": <Status color="success">تکمیل شده</Status>,
    "رد شده": <Status color="error">رد شده</Status>,
  };

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
      <span className="flex flex-row items-center gap-1 whitespace-nowrap">
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

  const msg = useMemo(() => {
    switch (type) {
      case "success":
        return (
          <Card
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="mb-2 flex w-full cursor-pointer flex-col gap-2 rounded-lg p-3 last:mb-0 hover:bg-warning/5"
          >
            <div className={"flex flex-row gap-1"}>
              <SvgIcon
                className="[&_svg]:h-[20px] [&_svg]:w-[20px]"
                fillColor="success"
              >
                <IcCheckedBox />
              </SvgIcon>
              <div>
                <p className=" text-[14px] font-semibold ">{title}</p>
              </div>
            </div>
            <p className="mt-1 text-[12px]">{content}</p>
            <Collapse open={hover}>
              <Button
                color={"success"}
                className={"w-full"}
                onClick={readHandler}
              >
                خواندم
              </Button>
            </Collapse>
          </Card>
        );
      case "danger":
        return (
          <Card
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="mb-2 flex w-full cursor-pointer flex-col gap-2 rounded-lg p-3 last:mb-0 hover:bg-warning/5"
          >
            <div className={"flex flex-row gap-1"}>
              <SvgIcon
                className="[&_svg]:h-[20px] [&_svg]:w-[20px]"
                fillColor="error"
              >
                <IcCloseBox />
              </SvgIcon>
              <div>
                <p className=" text-[14px] font-semibold ">{title}</p>
              </div>
            </div>
            <p className="mt-1 text-[12px]">{content}</p>
            <Collapse open={hover}>
              <Button
                color={"error"}
                className={"w-full"}
                onClick={readHandler}
              >
                خواندم
              </Button>
            </Collapse>
          </Card>
        );
      case "info":
        return (
          <Card
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="mb-2 flex w-full cursor-pointer flex-col gap-2 rounded-lg p-3 last:mb-0 hover:bg-warning/5"
          >
            <div className={"flex flex-row gap-1"}>
              <SvgIcon
                className="[&_svg]:h-[20px] [&_svg]:w-[20px]"
                fillColor="info"
              >
                <IcInfoBox />
              </SvgIcon>
              <div>
                <p className=" text-[14px] font-semibold ">{title}</p>
              </div>
            </div>
            <p className="mt-1 text-[12px]">
              {replaceStatusesInContent(content ?? "")}
            </p>
            <Collapse open={hover}>
              <Button color={"info"} className={"w-full"} onClick={readHandler}>
                خواندم
              </Button>
            </Collapse>
          </Card>
        );
      case "warning":
        return (
          <Card
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="mb-2 flex w-full cursor-pointer flex-col gap-2 rounded-lg p-3 last:mb-0 hover:bg-warning/5"
          >
            <div className={"flex flex-row gap-1"}>
              <SvgIcon
                className="[&_svg]:h-[20px] [&_svg]:w-[20px]"
                fillColor="warning"
              >
                <IcInfoBox />
              </SvgIcon>
              <div>
                <p className=" text-[14px] font-semibold ">{title}</p>
              </div>
            </div>
            <p className="mt-1 text-[12px]">{content}</p>
            <Collapse open={hover}>
              <Button
                color={"warning"}
                className={"w-full"}
                onClick={readHandler}
              >
                خواندم
              </Button>
            </Collapse>
          </Card>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, hover]);

  return (
    <div className={"relative flex items-start justify-between"}>
      {msg}
      {!is_read && (
        <span
          className={"absolute left-4 top-5 h-2 w-2 rounded-xl bg-primary"}
        />
      )}
    </div>
  );
};

export default Message;
