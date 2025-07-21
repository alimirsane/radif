import { Card } from "@kit/card";
import { Status } from "@kit/status";
import Badge from "@feature/kits/badge";
import { useRouter } from "next/router";
import { DateHandler } from "@utils/date-handler";
import { ColorTypes } from "@kit/common/color-type";
import { RequestType } from "@api/service/request/type";
import { AccountType } from "@api/service/user/type/account-type";

const ListItem = (props: RequestType & { onClick: () => void }) => {
  const router = useRouter();
  const {
    onClick,
    created_at,
    id,
    owner_obj,
    experiment_obj,
    status,
    request_number,
    latest_status_obj,
    is_urgent,
    is_cancelled,
    is_sample_returned,
  } = props;
  return (
    <Card
      coverage
      color={"paper"}
      className={`
            cursor-pointer list-none rounded-[12px] border-[1px] border-r-[14px] bg-opacity-45 px-[16px] py-[12px]
            ${router.query.request_id === id?.toString() ? `border-${latest_status_obj?.step_obj.step_color}` : "border-none"}
        `}
      onClick={onClick}
    >
      <div className="flex flex-wrap items-center justify-between">
        <span className="text-black text-18 flex flex-row gap-2 font-semibold">
          {owner_obj?.account_type === AccountType.BUSINESS
            ? owner_obj?.company_name
            : `${owner_obj?.first_name} ${owner_obj?.last_name}`}
          {owner_obj?.account_type === AccountType.BUSINESS && (
            <Badge color="primary" className="py-[5px]">
              حقوقی
            </Badge>
          )}
        </span>
        <div className="mr-auto flex gap-2">
          {/* {is_urgent && (
            <Badge color="error" className={"bg-opacity-10 text-error"}>
              فوری
            </Badge>
          )} */}
          {is_sample_returned && (
            <Badge color="warning" className="bg-opacity-80 py-[5px]">
              عودت نمونه
            </Badge>
          )}
          <Status color={latest_status_obj?.step_obj.step_color as ColorTypes}>
            {/* {latest_status_obj?.step_obj.name} */}
            {latest_status_obj?.step_obj.name !== "رد شده"
              ? latest_status_obj?.step_obj.name
              : `${latest_status_obj?.step_obj.name} ${is_cancelled ? "توسط کاربر" : ""}`}
          </Status>
        </div>
      </div>
      {/* <div className="mt-[7px] items-center">
        <span className="text-[13px] font-semibold text-typography-secondary">
          {experiment_obj?.name}
        </span>
      </div> */}
      <div className="mt-3 flex w-full items-center justify-between">
        <span className="text-[14px] font-semibold text-typography-secondary">
          {request_number}
        </span>
        <span className="text-[14px] text-typography-main">
          {DateHandler.formatDate(created_at ?? "", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>
      </div>
    </Card>
  );
};

export default ListItem;
