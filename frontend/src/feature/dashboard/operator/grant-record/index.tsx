import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@kit/card";
import GrantsList from "./grants-list";
import { apiGrantRecord } from "@api/service/grant-record";

const GrantRecords = () => {
  const [displayLoadingOverlay, setDisplayLoadingOverlay] = useState(true);
  // get grant request data
  const {
    data: grantRecords,
    isLoading: grantRecordsLoading,
    refetch: refetchGrantRecords,
  } = useQuery(
    apiGrantRecord().getAll({
      useLoadingOverlay: displayLoadingOverlay,
    }),
  );
  // fetch data every 60 seconds
  useEffect(() => {
    setDisplayLoadingOverlay(false);
    const interval = setInterval(async () => {
      try {
        await refetchGrantRecords();
      } catch (err) {
        console.error(err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [refetchGrantRecords]);

  return (
    <Card
      className={"my-6 px-4 pb-10 pt-7 text-typography-main sm:px-10"}
      color={"white"}
      variant="outline"
    >
      <div className="flex flex-col">
        <h2 className="text-[18px] font-semibold">لیست گرنت‌ها</h2>
        <p className="py-2 text-[14px]">
          لیست گرنت‌های اعطا شده را می توانید در این بخش مشاهده کنید.{" "}
        </p>
      </div>
      <div className="mt-[16px]">
        <GrantsList grantRecords={grantRecords?.data ?? []} />
      </div>
    </Card>
  );
};

export default GrantRecords;
