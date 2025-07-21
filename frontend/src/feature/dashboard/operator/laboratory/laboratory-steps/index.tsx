import { useMemo } from "react";
import { useRouter } from "next/router";

import { Card } from "@kit/card";
import classes from "./styles.module.css";
import { StepType } from "./type";

export const LaboratorySteps = () => {
  const router = useRouter();
  const steps = useMemo(() => {
    return [
      {
        title: "ثبت آزمایشگاه",
        stepID: "1",
        value: StepType.LABORATORY,
      },
      {
        title: "ثبت دستگاه",
        stepID: "2",
        value: StepType.DEVICE,
      },
      {
        title: "ساخت فرم",
        stepID: "3",
        value: StepType.FORM,
      },
      {
        title: "ثبت آزمون",
        stepID: "4",
        value: StepType.EXPERIMENT,
      },
      {
        title: "ثبت پارامتر",
        stepID: "5",
        value: StepType.PARAMETER,
      },
    ];
  }, []);
  const getColor = (stepName: string) => {
    if (router.query.step) {
      if (stepName === router.query.step) {
        return "info";
      } else return "paper";
    } else if (!router.query.step && stepName === StepType.LABORATORY) {
      return "info";
    }
    return "paper";
  };
  const getCardBorder = (stepName: string) => {
    if (router.query.step) {
      if (stepName !== router.query.step) {
        return "border border-background-paper-dark";
      } else return "";
    } else if (!router.query.step && stepName !== StepType.LABORATORY) {
      return "border border-background-paper-dark";
    }
  };

  const getConnector = (stepName: string) => {
    if (
      (router.query.step && stepName === router.query.step) ||
      (!router.query.step && stepName === StepType.LABORATORY)
    ) {
      return `${classes.connector}`;
    }
  };

  const navigateToStep = (stepName: string) => {
    router.query = {
      // action: "add",
      step: stepName,
    };
    router.push(router);
  };
  // get lab id from state management
  // const laboratoryId = useOperatorLabManagementStepHandler(
  //   (state) => state.laboratoryId,
  // );
  // check laboratory id => back to first step if laboratoryId is undefined
  // useEffect(() => {
  //   if (router.query.step !== "1" && !laboratoryId) {
  //     router.query.step = "1";
  //     router.push(router);
  //   }
  // }, [laboratoryId, router.query.step]);
  return (
    <>
      <div className="flex flex-row items-center gap-4 overflow-y-hidden overflow-x-scroll px-[1px] pb-[20px] md:gap-5 lg:gap-8 lg:overflow-x-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="w-2/3 flex-shrink-0 md:w-2/5 lg:w-1/4 lg:flex-shrink"
          >
            <Card
              color={getColor(step.value)}
              onClick={() => {
                navigateToStep(step.value);
              }}
              className={`h-full w-full px-2 py-7 ${getConnector(step.value)} ${getCardBorder(step.value)} cursor-pointer`}
            >
              <div className=" flex flex-wrap-reverse justify-between text-center">
                <h6 className="grow text-[17px] font-medium">{step.title}</h6>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};
