import { create } from "zustand";

type SampleType = {
  sample_id: number;
  count: number;
};

type CopySampleType = {
  samples: SampleType[];
  setSampleCount: (sample_id: number, count: number) => void;
  addSample: (sample: SampleType) => void;
  updateSample: (sample_id: number, count: number) => void;
  deleteSample: (sample_id: number) => void;
  clearSamples: () => void;
};

export const useCopySampleHandler = create<CopySampleType>()((set) => ({
  samples: [],

  // set sample count by updating the existing sample or adding a new one
  setSampleCount: (sample_id: number, count: number) =>
    set((state) => {
      const existingSample = state.samples.find(
        (sample) => sample.sample_id === sample_id,
      );

      if (existingSample) {
        // Update existing sample count
        return {
          samples: state.samples.map((sample) =>
            sample.sample_id === sample_id ? { ...sample, count } : sample,
          ),
        };
      } else {
        // Add new sample
        return {
          samples: [...state.samples, { sample_id, count }],
        };
      }
    }),

  // add a sample
  addSample: (sample: SampleType) =>
    set((state) => ({
      samples: [...state.samples, sample],
    })),

  // update the count of an existing sample
  updateSample: (sample_id: number, count: number) =>
    set((state) => ({
      samples: state.samples.map((sample) =>
        sample.sample_id === sample_id ? { ...sample, count } : sample,
      ),
    })),

  // delete a sample by its sample_id
  deleteSample: (sample_id: number) =>
    set((state) => ({
      samples: state.samples.filter((sample) => sample.sample_id !== sample_id),
    })),
  // reset the samples array
  clearSamples: () =>
    set(() => ({
      samples: [],
    })),
}));

useCopySampleHandler.subscribe((CopySampleHandler) => {
  // console.log("Sample store updated", CopySampleHandler.samples);
});
