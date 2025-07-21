import { useRouter } from "next/router";
import React from "react";

import { Card } from "@kit/card";
import { useQuery } from "@tanstack/react-query";
import { apiDevice } from "@api/service/device";
import DevicesList from "./devices-list";
import DeviceInformation from "./create-device";

const DeviceInfoSubmition = () => {
  const router = useRouter();
  // get devices data
  const { data: devices, isLoading: devicesLoading } = useQuery(
    apiDevice().getAll({ search: router.query.search_device }),
  );

  return (
    <>
      <Card className="border-2 border-info border-opacity-10 p-5 md:p-8">
        {!router.query.device && <DevicesList devicesList={devices?.data} />}
        {router.query.device === "new" && <DeviceInformation />}
      </Card>
    </>
  );
};

export default DeviceInfoSubmition;
