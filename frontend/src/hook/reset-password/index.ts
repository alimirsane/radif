import { create } from "zustand";

type ResetPasswordType = {
  // steps
  phoneNumber: string | undefined;
  setPhoneNumber: (phoneNumber: string | undefined) => void;
};

export const useResetPasswordHandler = create<ResetPasswordType>()((set) => ({
  phoneNumber: undefined,
  setPhoneNumber: (phoneNumber) =>
    set(() => {
      return {
        phoneNumber: phoneNumber,
      };
    }),
}));

useResetPasswordHandler.subscribe((resetPasswordHandle) => {});
