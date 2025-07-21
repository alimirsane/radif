import { useEffect } from "react";
import { useRouter } from "next/router";

import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcArrowRight } from "@feature/kits/common/icons";
import { useOperatorLabManagementStepHandler } from "@hook/operator-laboratory-management-steps";

export const StepsNavigation = () => {
  const router = useRouter();
  // get current step id
  const { stepId, setStepId, nextStep, prevStep } =
    useOperatorLabManagementStepHandler();
  // set initial step value
  useEffect(() => {
    if (router.query.step) {
      setStepId(Number(router.query.step));
    } else {
      setStepId(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);
  // set next step
  const goToNextStep = () => {
    nextStep(stepId);
    router.query.step = ((stepId ?? 0) + 1).toString();
    router.push(router);
  };
  // set prev step
  const goToPrevStep = () => {
    prevStep(stepId);
    router.query.step = ((stepId ?? 0) - 1).toString();
    router.push(router);
  };

  return (
    <>
      <div className="flex flex-col justify-end sm:flex-row sm:py-7">
        <Button
          className="my-3 w-full sm:mx-5 sm:my-auto sm:w-auto"
          startIcon={
            <SvgIcon
              fillColor={"primary"}
              className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
            >
              <IcArrowRight />
            </SvgIcon>
          }
          variant="outline"
          onClick={() => {
            goToPrevStep();
          }}
          disabled={stepId === 1}
        >
          مرحله قبل
        </Button>
        <Button
          variant="solid"
          color="primary"
          className="w-full sm:w-auto"
          onClick={() => {
            goToNextStep();
          }}
          disabled={stepId === 6}
        >
          مرحله بعد
        </Button>
      </div>
    </>
  );
};
