import { create } from "zustand";
import { RequestTypeForm } from "@api/service/request/type";

type SampleHandlerType = {
  sample: RequestTypeForm | undefined;
  setSample : (sample: RequestTypeForm | undefined) => void;
};

export const useShowSampleHandler = create<SampleHandlerType>()((set) => ({
  sample: undefined,
  setSample: (sample) =>
    set(() => {
      return {
        sample: sample,
      };
    }),
}));

useShowSampleHandler.subscribe((sample) => {
});