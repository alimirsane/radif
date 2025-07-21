import React, { useState } from "react";
import { useRouter } from "next/router";

import { apiRequest } from "@api/service/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ReturnSample = ({ isReturned }: { isReturned: boolean | undefined }) => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  const [isSampleReturned, setIsSampleReturned] = useState<boolean>(
    isReturned ?? false,
  );
  // return sample api
  const { mutateAsync: returnSample } = useMutation(
    apiRequest(true, {
      success: "ثبت عودت نمونه موفقیت آمیز بود",
      fail: "ثبت عودت نمونه انجام نشد",
      waiting: "در حال انتظار",
    }).returnSample(Number(router.query.request)),
  );
  // set is sample returned on checkbox change
  const handleCheckboxChange = () => {
    const newIsSampleReturned = !isSampleReturned;

    setIsSampleReturned(newIsSampleReturned);

    const data = {
      is_sample_returned: newIsSampleReturned,
    };
    returnSample(data)
      .then(() => {
        clientQuery.invalidateQueries({
          queryKey: [apiRequest().url],
        });
      })
      .catch((err) => {});
  };
  return (
    <div className="flex items-center">
      <input
        checked={isSampleReturned}
        type="checkbox"
        id="isSampleReturned"
        onChange={handleCheckboxChange}
        name="isSampleReturned"
      ></input>
      <label
        htmlFor="isSampleReturned"
        className={`pr-2 text-[15px] font-[500]`}
      >
        درخواست عودت نمونه و فاکتور رسمی دارم.
        <span className="px-1 text-[13px] text-common-gray">
          (هزینه عودت نمونه 850,000 ریال می‌باشد.)
        </span>{" "}
      </label>
    </div>
  );
};

export default ReturnSample;
