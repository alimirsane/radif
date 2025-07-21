import { create } from "zustand";

type CertificateHandlerType = {
  certificate: any;
  setCertificate: (experiment: any) => void;
};

export const useCertificateHandler = create<CertificateHandlerType>()(
  (set) => ({
    certificate: undefined,
    setCertificate: (experiment) =>
      set(() => {
        return {
          certificate: experiment,
        };
      }),
  }),
);

useCertificateHandler.subscribe((experiment) => {});
