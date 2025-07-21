import { useQuery } from "@tanstack/react-query";
import { chartType } from "../type";
import { apiRequest } from "@api/service/request";
import { apiPaymentRecord } from "@api/service/payment-record";
import { apiGrantRecord } from "@api/service/grant-record";
import { apiGrantRequest } from "@api/service/grant-request";
import { GrantStatusType } from "@api/service/grant-request/type/grant-status-type";
import { useMemo } from "react";
import { apiUser } from "@api/service/user";
import { apiLaboratory } from "@api/service/laboratory";
import { apiDevice } from "@api/service/device";
import { apiExperiment } from "@api/service/experiment";
import { AccountType } from "@api/service/user/type/account-type";
type LaboratoryAmount = {
  id: number;
  name: string;
  totalAmount: number;
};
export const useChartData = () => {
  // *** If the chart is empty, it may be because we don't have a successful transaction. ***

  // DATA
  // fetch steps count
  const { data: steps, isLoading: stepsLoading } = useQuery(
    apiRequest().getAll({ step_counter: true }),
  );
  // fetch grant records
  const { data: grantRecords, isLoading: grantRecordsLoading } = useQuery(
    apiGrantRecord().getAll(),
  );
  // fetch grant requests
  const { data: grantRequests, isLoading: grantRequestsLoading } = useQuery(
    apiGrantRequest().getAll(),
  );
  // fetch laboratories
  const { data: laboratories, isLoading: laboratoriesLoading } = useQuery(
    apiLaboratory().getAll(),
  );
  // fetch devices
  const { data: devices, isLoading: devicesLoading } = useQuery(
    apiDevice().getAll(),
  );
  // fetch experiments
  const { data: experiments, isLoading: experimentsLoading } = useQuery(
    apiExperiment().getAll(),
  );
  // fetch users
  const { data: users } = useQuery({
    ...apiUser().getAllPublicStaffs({
      user_type: "staff",
    }),
  });
  // fetch customers
  const { data: customers } = useQuery({
    ...apiUser().getAllPublicCustomers({
      user_type: "customer",
    }),
  });
  // fetch business customers
  const { data: business_customers } = useQuery({
    ...apiUser().getAllPublicCustomers({
      user_type: "customer",
      account_type: AccountType.BUSINESS,
    }),
  });
  // fetch personal customers
  const { data: personal_customers } = useQuery({
    ...apiUser().getAllPublicCustomers({
      user_type: "customer",
      account_type: AccountType.PERSONAL,
    }),
  });

  // calculate amount of allocated grant of professors
  const professorsApprovedGrants = useMemo(() => {
    return grantRecords?.data?.reduce(
      (sum, grant) => sum + (grant.amount ?? 0),
      0,
    );
  }, [grantRecords]);

  // calculate amount of all grants of students
  const studentsAllGrants = useMemo(() => {
    return grantRequests?.data?.reduce(
      (sum, grant) => sum + Number(grant?.requested_amount),
      0,
    );
  }, [grantRequests]);

  // calculate amount of approved grant of students
  const studentsApprovedGrants = useMemo(() => {
    return grantRequests?.data
      ?.filter((grant) => grant.status === GrantStatusType.APPROVED)
      .reduce((sum, grant) => sum + grant.approved_amount, 0);
  }, [grantRequests]);

  // PROCESSED DATA
  // 1: labs overview
  const labsOverViewData = useMemo(() => {
    return [
      {
        label: "آزمایشگاه‌های فعال",
        count: laboratories?.data?.filter((lab) => lab.status === "active")
          ?.length,
      },
      {
        label: "آزمایشگاه‌های دارای ایزو",
        count: laboratories?.data?.filter((lab) => lab.has_iso_17025)?.length,
      },
      {
        label: "دستگاه‌های فعال",
        count: devices?.data?.filter((device) => device.status === "active")
          ?.length,
      },
      {
        label: "آزمون‌های فعال",
        count: experiments?.data?.filter(
          (experiment) => experiment.status === "active",
        )?.length,
      },
      {
        label: "آزمایشگاه‌های غیرفعال",
        count: laboratories?.data?.filter((lab) => lab.status === "inactive")
          ?.length,
      },
      {
        label: "آزمایشگاه‌های فاقد ایزو",
        count: laboratories?.data?.filter((lab) => !lab.has_iso_17025)?.length,
      },
      {
        label: "دستگاه‌های غیرفعال",
        count: devices?.data?.filter((device) => device.status === "inactive")
          ?.length,
      },
      {
        label: "آزمون‌های غیرفعال",
        count: experiments?.data?.filter(
          (experiment) => experiment.status === "inactive",
        )?.length,
      },
    ];
  }, [laboratories, experiments, devices]);
  // 2: users data
  const usersData = useMemo(() => {
    return [
      {
        label: "همکاران",
        count: users?.data?.length,
      },
      {
        label: "مشتریان",
        count: customers?.data?.length,
      },
      {
        label: "مشتریان حقیقی",
        count: personal_customers?.data?.length,
      },
      {
        label: "مشتریان حقوقی",
        count: business_customers?.data?.length,
      },
    ];
  }, [users, customers, personal_customers, business_customers]);
  // 4: research grant chart data
  const researchGrantData = useMemo(() => {
    return [
      {
        label: "گرنت‌ پژوهشی تخصیص داده شده به اساتید",
        data: [professorsApprovedGrants ?? 0],
        backgroundColor: "primary",
      },
      {
        label: "گرنت پژوهشی درخواستی دانشجویان",
        data: [studentsAllGrants ?? 0],
        backgroundColor: "success",
      },
      {
        label: "گرنت‌ پژوهشی تخصیص داده شده به دانشجویان",
        data: [studentsApprovedGrants ?? 0],
        backgroundColor: "warning",
      },
    ];
  }, [studentsAllGrants, professorsApprovedGrants, studentsApprovedGrants]);
  // 5: requests status chart data
  const requestStatus = useMemo(() => {
    return steps?.data?.map((step) => ({
      label: step.name,
      data: [Number(step.request_counter)],
      backgroundColor: step.step_color,
    }));
  }, [steps]);

  // loading
  // loading
  const labsOverviewIsFetching =
    laboratoriesLoading || devicesLoading || experimentsLoading;

  const isFetching =
    // requestsLoading ||
    // paymentsLoading ||
    stepsLoading ||
    grantRecordsLoading ||
    grantRequestsLoading ||
    laboratoriesLoading ||
    devicesLoading ||
    experimentsLoading;

  // OLD DATA
  // // fetch requets
  // const { data: requests, isLoading: requestsLoading } = useQuery(
  //   apiRequest().getAllList(),
  // );
  // // fetch payments
  // const { data: paymentsList, isLoading: paymentsLoading } = useQuery(
  //   apiPaymentRecord().getAllByOperator(),
  // );
  // // calculate amount of allocated grant of professors
  // const totalSuccessfulAmount = useMemo(() => {
  //   return paymentsList?.data?.results
  //     .filter((transaction) => transaction.successful)
  //     .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  // }, [paymentsList]);
  // // calculate laboratories with highest amount
  // const topLaboratories = useMemo(() => {
  //   if (!paymentsList?.data?.results) return [];
  //   // successful requests
  //   const successfulRequests = paymentsList?.data?.results?.filter(
  //     (payment) =>
  //       payment.successful &&
  //       payment.amount &&
  //       payment.request_obj?.experiment_obj?.laboratory_obj,
  //   );
  //   // initialize laboratoryAmountMap
  //   const laboratoryAmountMap: { [key: number]: LaboratoryAmount } = {};
  //   // count occurrences of each laboratory
  //   successfulRequests.forEach((payment) => {
  //     const lab = payment?.request_obj?.experiment_obj?.laboratory_obj;
  //     const labId = lab?.id;
  //     const labName = lab?.name || "";
  //     const amount = payment.amount || 0;

  //     if (labId) {
  //       if (!laboratoryAmountMap[labId]) {
  //         laboratoryAmountMap[labId] = {
  //           id: labId,
  //           name: labName,
  //           totalAmount: 0,
  //         };
  //       }
  //       laboratoryAmountMap[labId].totalAmount += Number(amount);
  //     }
  //   });
  //   // convert the amount map to an array and sort by the highest total amount
  //   return Object.values(laboratoryAmountMap).sort(
  //     (a, b) => b.totalAmount - a.totalAmount,
  //   );
  // }, [paymentsList]);
  // // ensure requests data is defined and has valid values
  // const validRequests = useMemo(() => {
  //   return (
  //     requests?.data?.results.filter(
  //       (req) => req?.experiment_obj?.laboratory,
  //     ) || []
  //   );
  // }, [requests]);
  // // create a count map to track the number of requests for each laboratory
  // const requestCounts = validRequests.reduce<Record<number, number>>(
  //   (acc, request) => {
  //     const labId = request.experiment_obj?.laboratory;
  //     if (labId) {
  //       acc[labId] = (acc[labId] || 0) + 1;
  //     }
  //     return acc;
  //   },
  //   {},
  // );
  // // add the request count to each lab of topLaboratories
  // const topLaboratoriesWithRequestCounts = useMemo(() => {
  //   return topLaboratories
  //     .map((lab) => {
  //       const labId = lab.id;

  //       return {
  //         ...lab,
  //         requestCount: requestCounts[labId] || 0,
  //       };
  //     })
  //     .slice(0, 3);
  // }, [topLaboratories, requestCounts]);
  // // pie chart data
  // const pieChartData = useMemo(() => {
  //   return [
  //     {
  //       label: "منابع",
  //       data: [
  //         laboratories?.data?.length ?? 0,
  //         devices?.data?.length ?? 0,
  //         experiments?.data?.length ?? 0,
  //       ],
  //       backgroundColor: ["primary", "secondary", "secondary-light"],
  //     },
  //   ];
  // }, [laboratories, devices, experiments]);
  // // financial chart data
  // const financialData = useMemo(() => {
  //   return [
  //     {
  //       label: "مبالغ دریافتی",
  //       data: [totalSuccessfulAmount ?? 0],
  //       backgroundColor: "success",
  //     },
  //     {
  //       label: "گرنت‌های تخصیص داده شده به اساتید",
  //       data: [professorsApprovedGrants ?? 0],
  //       backgroundColor: "primary",
  //     },
  //     {
  //       label: "گرنت‌های تخصیص داده شده به دانشجویان",
  //       data: [studentsApprovedGrants ?? 0],
  //       backgroundColor: "warning",
  //     },
  //   ];
  // }, [totalSuccessfulAmount, professorsApprovedGrants, studentsApprovedGrants]);
  // // laboratories chart data
  // const labData = useMemo(() => {
  //   return [
  //     {
  //       label: "مبلغ تراکنش‌ها(ریال)",
  //       data: topLaboratoriesWithRequestCounts.map((lab) => lab.totalAmount),
  //       backgroundColor: "primary",
  //     },
  //     {
  //       label: "تعداد درخواست‌ها",
  //       data: topLaboratoriesWithRequestCounts.map((lab) => lab.requestCount),
  //       backgroundColor: "warning",
  //       yAxisID: "y1",
  //     },
  //   ];
  // }, [topLaboratoriesWithRequestCounts]);

  const dataset: chartType[] = [
    {
      label: "آزمایشگاه xrd",
      data: [1, 5],
      backgroundColor: "warning",
    },
    {
      label: "آزمایشگاه fesem",
      data: [2, 1],
      backgroundColor: "info",
    },
    {
      label: "آزمایشگاه مقاومت مصالح",
      data: [1, 3],
      backgroundColor: "primary",
    },
    {
      label: "آزمایشگاه nmr",
      data: [2, 2],
      backgroundColor: "error",
    },
  ];

  return {
    // financialData,
    // labData,
    // topLaboratoriesWithRequestCounts,
    // pieChartData,
    //
    isFetching,
    labsOverviewIsFetching,
    requestStatus,
    labsOverViewData,
    usersData,
    researchGrantData,
    dataset,
  };
};
