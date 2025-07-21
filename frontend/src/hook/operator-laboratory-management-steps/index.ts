import { create } from "zustand";

type OperatorLabManagementStepType = {
  // steps
  stepId: number | undefined;
  setStepId: (stepId: number | undefined) => void;
  nextStep: (stepId: number | undefined) => void;
  prevStep: (stepId: number | undefined) => void;
  // laboratory
  laboratoryId: number | undefined;
  setLaboratoryId: (labId: number | undefined) => void;
  // operator
  operatorId: number | undefined;
  setOperatorId: (operatorId: number | undefined) => void;
  // experiment
  experimentId: number | undefined;
  setExperimentId: (experimentId: number | undefined) => void;
};

export const useOperatorLabManagementStepHandler =
  create<OperatorLabManagementStepType>()((set) => ({
    // steps
    stepId: undefined,
    setStepId: (stepId) =>
      set(() => {
        return {
          stepId: stepId,
        };
      }),
    nextStep: () =>
      set((state) => ({ stepId: Math.min(4, (state.stepId ?? 0) + 1) })),
    prevStep: () =>
      set((state) => ({ stepId: Math.max(0, (state.stepId ?? 0) - 1) })),
    // laboratory
    laboratoryId: undefined,
    setLaboratoryId: (laboratoryId) =>
      set(() => {
        return {
          laboratoryId: laboratoryId,
        };
      }),
    // operator
    operatorId: undefined,
    setOperatorId: (operatorId) =>
      set(() => {
        return {
          operatorId: operatorId,
        };
      }),
    // experiment
    experimentId: undefined,
    setExperimentId: (experimentId) =>
      set(() => {
        return {
          experimentId: experimentId,
        };
      }),
  }));

useOperatorLabManagementStepHandler.subscribe(
  (operatorLabManagementStepHandle) => {
  },
);
