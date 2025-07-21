import { create } from "zustand";
import { TransactionType, TransactioLitType } from "../type";
import { ResultType } from "@api/service/payment-record/type";

type TransactionHandlerType = {
  transaction: ResultType | undefined;
  setTransaction: (sample: ResultType | undefined) => void;
};

export const useTransactionHandler = create<TransactionHandlerType>()(
  (set) => ({
    transaction: undefined,
    setTransaction: (transaction) =>
      set(() => {
        return {
          transaction: transaction,
        };
      }),
  }),
);

useTransactionHandler.subscribe((transaction) => {});
