import { useRouter } from "next/router";
import { useMemo } from "react";

import Container from "@feature/dashboard/common/container";
import { LaboratorySteps } from "../laboratory-steps";
import Laboratory from "..";
import ExperimentInformation from "../experiment-info-submition";
import ParameterInformation from "../parameter-info-submition";
import DeviceInfoSubmition from "../device-info-submition";
import LaboratoryForm from "../lab-form";
import { StepType } from "../laboratory-steps/type";

const NewLaboratory = () => {
  const router = useRouter();
  const step = useMemo(() => {
    return router.query.step ?? StepType.LABORATORY;
  }, [router]);
  return (
    <>
      <Container>
        <LaboratorySteps />
        {!step || (step === StepType.LABORATORY && <Laboratory />)}
        {step === StepType.DEVICE && <DeviceInfoSubmition />}
        {step === StepType.FORM && <LaboratoryForm />}
        {step === StepType.EXPERIMENT && <ExperimentInformation />}
        {step === StepType.PARAMETER && <ParameterInformation />}
        {/* <StepsNavigation /> */}
      </Container>
    </>
  );
};

export default NewLaboratory;
