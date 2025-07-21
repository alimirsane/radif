import { useRouter } from "next/router";

import Container from "@feature/dashboard/common/container";
import TestRequest from "./test-selection";
import ApprovalRules from "./approval-rules";
import SampleDataEntry from "./sample-data-entry";
import { FinalApprovalStep } from "./final-approval-step";
import { RequestSteps } from "@feature/dashboard/customer/request/request-steps";
import { TestSelectionStep } from "@feature/dashboard/customer/request/test-selection-step";
import { useMemo } from "react";
import SubRequests from "./view-sub-requests";
import ParameterSelectionStep from "./parameter-selection-step";

const Request = () => {
  const router = useRouter();
  const step = useMemo(() => {
    return router.query.step ?? "1";
  }, [router]);
  return (
    <>
      <Container>
        <RequestSteps />
        {Number(step) === 1 && !router.query.lab && <TestRequest />}
        {Number(step) === 1 && router.query.lab && <TestSelectionStep />}
        {Number(step) === 2 && <ParameterSelectionStep />}
        {Number(step) === 3 && <ApprovalRules />}
        {Number(step) === 4 && <SampleDataEntry />}
        {Number(step) === 5 && <FinalApprovalStep />}
        {Number(step) === 6 && <SubRequests />}
      </Container>
    </>
  );
};

export default Request;
