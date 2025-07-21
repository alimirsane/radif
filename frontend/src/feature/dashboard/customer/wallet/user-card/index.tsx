import { useState } from "react";

import { Card } from "@kit/card";
import { apiUser } from "@api/service/user";
import { useQuery } from "@tanstack/react-query";
import { SvgIcon } from "@kit/svg-icon";
import { IcCreditCard } from "@feature/kits/common/icons";

const UserWalletCard = () => {
  // get current user data
  const { data: user } = useQuery({
    ...apiUser().me(),
  });
  return (
    <Card color="primary" className="pt-4 text-primary-dark">
      <div className="flex justify-end px-5">
        <SvgIcon className={"[&_svg]:h-[30px] [&_svg]:w-[30px]"}>
          <IcCreditCard />
        </SvgIcon>
      </div>
      <h6 className="px-5 pb-16 pt-10 text-[16px] font-bold">
        موجودی کیف پول شما{" "}
        {user?.data.balance === 0 ? "صفر" : user?.data.balance} می‌باشد.
      </h6>
      <h6 className="rounded-b-lg bg-primary bg-opacity-10 px-5 py-4 text-[14px] font-semibold">
        {`${user?.data.first_name} ${user?.data.last_name}`}
      </h6>
    </Card>
  );
};

export default UserWalletCard;
