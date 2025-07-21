import ListItem from "./list-item";

import { Card } from "@kit/card";
import { useQuery } from "@tanstack/react-query";
import { apiLaboratory } from "@api/service/laboratory";
import Filter from "../filter";
import { useRouter } from "next/router";
import { useCustomerGrantsManagementHandler } from "@hook/customer-grants-management";
import { useEffect } from "react";

const TestRequest = () => {
  const router = useRouter();

  const {
    data: laboratories,
    isLoading: laboratoriesLoading,
    refetch,
  } = useQuery(
    apiLaboratory().getAllPublic({
      search: router.query.search_lab,
      search_department: router.query.search_college,
    }),
  );

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    resetIsLabsnetGrantSelected,
    resetIsResearchGrantSelected,
    resetSelectedLabsnetGrants,
    resetSelectedResearchGrants,
  } = useCustomerGrantsManagementHandler();

  useEffect(() => {
    resetIsLabsnetGrantSelected();
    resetIsResearchGrantSelected();
    resetSelectedLabsnetGrants();
    resetSelectedResearchGrants();
  }, [
    resetIsLabsnetGrantSelected,
    resetIsResearchGrantSelected,
    resetSelectedLabsnetGrants,
    resetSelectedResearchGrants,
  ]);
  return (
    <Card color="info" className="mb-3 w-full p-[24px]">
      <p className=" mb-[24px] text-[14px] text-typography-main">
        کاربر گرامی می‌توانید از فهرست آزمایشگاه‌های زیر برای درخواست خود اقدام
        کنید.
      </p>
      <Filter />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-[32px]">
        {laboratories?.data.length !== 0 &&
          laboratories?.data.map((laboratory, index: number) => (
            <ListItem laboratory={laboratory} key={index} />
          ))}
        {laboratories?.data.length === 0 && <p>موردی یافت نشد.</p>}
      </div>
    </Card>
  );
};

export default TestRequest;
