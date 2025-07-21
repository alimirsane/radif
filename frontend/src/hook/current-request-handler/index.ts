import { create } from "zustand";

type RequestHandlerType = {
  requestId: number | undefined;
  setRequestId: (requestId: number | undefined) => void;
  resetRequestId: () => void;
  childRequestId: number | undefined;
  setChildRequestId: (parentRequestId: number | undefined) => void;
  isPartner: boolean | undefined;
  setIsPartner: (isPartner: boolean | undefined) => void;
  experimentId: number | undefined;
  setExperimentId: (experimentId: number | undefined) => void;
};

export const useCurrentRequestHandler = create<RequestHandlerType>()((set) => ({
  requestId: undefined,
  childRequestId: undefined,
  isPartner: undefined,
  experimentId: undefined,
  setRequestId: (requestId) =>
    set(() => {
      return {
        requestId: requestId,
      };
    }),
  setChildRequestId: (childRequestId) =>
    set(() => {
      return {
        childRequestId: childRequestId,
      };
    }),
  resetRequestId: () =>
    set(() => {
      return {
        requestId: undefined,
      };
    }),
  setIsPartner: (isPartner) =>
    set(() => {
      return {
        isPartner: isPartner,
      };
    }),
  setExperimentId: (experimentId) =>
    set(() => {
      return {
        experimentId: experimentId,
      };
    }),
}));

useCurrentRequestHandler.subscribe((requestHandler) => {});
