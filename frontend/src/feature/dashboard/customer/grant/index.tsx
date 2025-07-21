import { useQuery } from "@tanstack/react-query";

import List from "./list";
import { Card } from "@kit/card";
import CreateGrantRequest from "./create-grant-request";
import { apiGrantRequest } from "@api/service/grant-request";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { useEffect, useState } from "react";

const Grant = () => {
  const [displayLoadingOverlay, setDisplayLoadingOverlay] = useState(true);
  // get grant request data
  const {
    data: grantRequests,
    isLoading: grantRequestsLoading,
    refetch: refetchGrantRequests,
  } = useQuery(
    apiGrantRequest().getAll({
      useLoadingOverlay: displayLoadingOverlay,
    }),
  );

  // fetch data every 60 seconds
  useEffect(() => {
    setDisplayLoadingOverlay(false);
    const interval = setInterval(async () => {
      try {
        await refetchGrantRequests();
      } catch (err) {
        console.error(err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [refetchGrantRequests]);

  return (
    <>
      <Card color={"white"} className={"px-3 py-2 lg:px-6"}>
        <AccessLevel module={"grantrequest"} permission={["create"]}>
          <Card color={"white"} variant="outline" className={"mb-7 p-5 lg:p-8"}>
            <h2 className="text-[18px] font-bold">درخواست گرنت از اساتید</h2>
            <p className="pt-2 text-[14px]">
              در صورتی که می‌خواهید از گرنت استفاده کنید، می‌توانید از استاد خود
              برای دریافت گرنت درخواست کنید.
            </p>
            <CreateGrantRequest />
            <Card
              color={"info"}
              className="mt-7 flex w-full flex-row justify-center gap-3 px-5 py-6 text-[16px] font-semibold "
            >
              <h6>اعتبار باقیمانده کل:</h6>
              <span className="font-bold text-info-dark">
                {Number(
                  grantRequests?.data?.reduce(
                    (sum, grant) => sum + Number(grant.remaining_amount),
                    0,
                  ),
                ).toLocaleString()}
                <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
              </span>
            </Card>
          </Card>
        </AccessLevel>
        <AccessLevel module={"grantrequest"} permission={["view"]}>
          <List grantRequests={grantRequests?.data ?? []} />
        </AccessLevel>
      </Card>
    </>
  );
};

export default Grant;
