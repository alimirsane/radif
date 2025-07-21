import React from "react";
import Link from "next/link";

import { IcTelephoneForward } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { AccountType } from "@api/service/user/type/account-type";

const CustomerProfile = (props: { customerData: CurrentUserType }) => {
  const { customerData } = props;
  return (
    <div id="CustomerProfile">
      <h3 className="back-gray pb-[8px] pt-[24px] text-[18px] font-bold text-typography-gray">
        مشخصات مشتری
      </h3>
      <div className="flex w-full flex-col flex-wrap gap-[16px] rounded-[8px] bg-background-paper-light px-4 py-[16px] md:flex-row md:items-center md:gap-[32px] md:px-[24px]">
        {customerData?.account_type === AccountType.BUSINESS && (
          <div className="flex flex-row gap-[4px] md:flex-col">
            <span className="text-[16px] font-bold text-typography-main">
              نام سازمان{" "}
            </span>
            <span className="pr-[6px] text-[14px] text-typography-main md:pr-[1px]">
              {customerData?.company_name ?? "---"}
            </span>
          </div>
        )}
        <div className="flex flex-row gap-[4px] md:flex-col">
          <span className="text-[16px] font-bold text-typography-main">
            نام و نام خانوادگی
            {customerData?.account_type === AccountType.BUSINESS &&
              " نماینده"}{" "}
          </span>
          <span className="pr-[6px] text-[14px] text-typography-main md:pr-[1px]">
            {!customerData?.first_name && !customerData?.last_name
              ? "---"
              : customerData?.first_name + " " + customerData?.last_name}
          </span>
        </div>
        <Link
          href={`tel:${customerData?.username}`}
          className="flex flex-row gap-[4px] md:flex-col"
        >
          <span className="text-[16px] font-bold text-typography-main">
            شماره همراه{" "}
          </span>
          <span
            className="flex items-center gap-[4px] pr-[6px] text-[14px] text-info md:pr-[1px]"
            dir="ltr"
          >
            <SvgIcon
              fillColor={"info"}
              className={"[&_svg]:h-[18x] [&_svg]:w-[18px]"}
            >
              <IcTelephoneForward />
            </SvgIcon>
            {customerData?.account_type === AccountType.BUSINESS
              ? !!customerData?.linked_users_objs?.length &&
                customerData?.linked_users_objs[0]?.username
                ? `0${customerData?.linked_users_objs[0]?.username.slice(3, customerData?.linked_users_objs[0].username.length)}`
                : ""
              : `0${customerData?.username?.slice(3, customerData?.username.length)}`}
          </span>
        </Link>
        {customerData?.email && (
          <div className="flex flex-row gap-[4px] md:flex-col">
            <span className="text-[16px] font-bold text-typography-main">
              ایمیل{" "}
            </span>
            <span className="pr-[6px] text-[14px] text-typography-main md:pr-[1px]">
              {customerData?.email ? customerData?.email : "---"}
            </span>
          </div>
        )}
        {customerData?.account_type === AccountType.PERSONAL ? (
          <div className="flex flex-row gap-[4px] md:flex-col">
            <span className="text-[16px] font-bold text-typography-main">
              کد ملی
            </span>
            <span className="pr-[6px] text-[14px] text-typography-main md:pr-[1px]">
              {customerData?.national_id}
            </span>
          </div>
        ) : (
          <div className="flex flex-row gap-[4px] md:flex-col">
            <span className="text-[16px] font-bold text-typography-main">
              شناسه ملی سازمان
            </span>
            <span className="pr-[6px] text-[14px] text-typography-main md:pr-[1px]">
              {customerData?.company_national_id}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
