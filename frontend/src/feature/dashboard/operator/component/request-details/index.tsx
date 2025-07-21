import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import Template from "../template";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@api/service/request";
import { apiWorkflow } from "@api/service/workflow";

const RequestDetails = () => {
  const router = useRouter();

  const currentPage = useMemo(() => {
    return parseInt((router.query.page as string) ?? "1");
  }, [router.query.page]);

  const [displayLoadingOverlay, setDisplayLoadingOverlay] = useState(true);
  const {
    data: requests,
    isLoading: isLoadingRequests,
    refetch: refetchRequests,
  } = useQuery(
    apiRequest().getAllList({
      page: currentPage,
      ordering: router.query.ordering ?? "-created_at",
      request_status: router.query.request_status,
      request_number: router.query.request_number,
      experiment_name: router.query.experiment_name,
      owner_fullname: router.query.owner_fullname,
      owner_national_id: router.query.owner_national_id,
      useLoadingOverlay: displayLoadingOverlay,
    }),
  );

  // Fetching requests with refetch every 15 seconds
  // const { data: requests, isLoading: isLoadingRequests } = useQuery({
  //   queryKey: [[apiRequest().url], currentPage, router.query],
  //   queryFn: () =>
  //     apiRequest().getAllList({
  //       page: currentPage,
  //       ordering: router.query.ordering ?? "-created_at",
  //       request_status: router.query.request_status,
  //       request_number: router.query.request_number,
  //       experiment_name: router.query.experiment_name,
  //       owner_fullname: router.query.owner_fullname,
  //       owner_national_id: router.query.owner_national_id,
  //     }),
  //   refetchInterval: 15000, // Refetch every 15 seconds
  //   refetchOnWindowFocus: true, // Ensure refetch when the window is focused
  // });

  // const getSamplesFlattenedForms = useCallback(() => {
  //   return requests?.data?.results?.filter(
  //     (request) =>
  //       request.latest_status_obj?.step_obj.name !== "در ‌انتظار پذیرش" &&
  //       request.latest_status_obj?.step_obj.name !== "در انتظار پرداخت",
  //   );
  // }, [requests?.data]);

  // get steps count
  const { data: steps, refetch: refetchSteps } = useQuery(
    apiRequest().getAll({
      step_counter: true,
      useLoadingOverlay: displayLoadingOverlay,
    }),
  );
  // get steps count, id, name and color
  const { data: workflow, refetch: refetchWorkflow } = useQuery(
    apiWorkflow().getAll({
      useLoadingOverlay: displayLoadingOverlay,
    }),
  );
  // update the workflow array with request_counter
  const requestCounterMap = useMemo(() => {
    const validStepsData = Array.isArray(steps?.data) ? steps?.data : [];
    return new Map(
      validStepsData.map((status) => [status.id, status.request_counter]),
    );
  }, [steps?.data]);

  const updatedWorkflowArray = useMemo(() => {
    return workflow?.data[0].steps_objs?.map((workflow) => ({
      ...workflow,
      request_counter: requestCounterMap.get(workflow.id) ?? "0",
    }));
  }, [workflow?.data, requestCounterMap]);

  // fetch data every 60 seconds
  useEffect(() => {
    let isFetching = false;
    setDisplayLoadingOverlay(false);

    const interval = setInterval(async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        await refetchRequests();
        await refetchSteps();
        await refetchWorkflow();
      } catch (err) {
        console.error(err);
      } finally {
        isFetching = false;
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [refetchRequests, refetchSteps, refetchWorkflow]);

  return (
    <Template
      steps_objs={updatedWorkflowArray}
      paginateData={requests?.data}
      isLoadingRequests={isLoadingRequests}
    />
  );
};
export default RequestDetails;
