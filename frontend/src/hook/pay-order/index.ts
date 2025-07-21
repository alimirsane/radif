import { create } from "zustand";

type PayOrderType = {
  requestId: string | undefined;
  price: string | undefined;
  setOrder: (requestId: string | undefined, price: string | undefined) => void;
};

export const usePayOrder = create<PayOrderType>()((set) => ({
  price: undefined,
  requestId: undefined,
  setOrder: (requestId, price) => {
    set((state) => {
      return {
        requestId: requestId,
        price: price,
      };
    });
  },
}));
