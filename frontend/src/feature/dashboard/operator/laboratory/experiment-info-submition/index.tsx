import { useRouter } from "next/router";
import React from "react";

import { Card } from "@kit/card";
import { useQuery } from "@tanstack/react-query";
import ExperimentsList from "./experiments-list";
import ExperimentInformation from "./create-experiment";
import { apiExperiment } from "@api/service/experiment";
import ExperimentAppointments from "./appointments";

const ExperimentInfoSubmition = () => {
  const router = useRouter();

  // get experiments list
  const { data: experiments, isLoading: experimentsLoading } = useQuery(
    apiExperiment().getAll({ search: router.query.search_experiment }),
  );

  return (
    <>
      <Card className="border-2 border-info border-opacity-10 p-5 md:p-8">
        {!router.query.experiment && (
          <ExperimentsList experimentsList={experiments?.data} />
        )}
        {router.query.experiment === "new" && <ExperimentInformation />}
        {router.query.experiment === "appointment" && (
          <ExperimentAppointments />
        )}
      </Card>
    </>
  );
};

export default ExperimentInfoSubmition;
