import { create } from "zustand";

type GrantsHandlerType = {
  isResearchGrantSelected: boolean;
  setIsResearchGrantSelected: (isResearchGrantSelected: boolean) => void;
  resetIsResearchGrantSelected: () => void;
  isLabsnetGrantSelected: boolean;
  setIsLabsnetGrantSelected: (isLabsnetGrantSelected: boolean) => void;
  resetIsLabsnetGrantSelected: () => void;
  selectedResearchGrants: number[];
  setSelectedResearchGrants: (grantId: number[]) => void;
  resetSelectedResearchGrants: () => void;
  selectedLabsnetGrants: string[];
  setSelectedLabsnetGrants: (grantId: string[]) => void;
  resetSelectedLabsnetGrants: () => void;
};

export const useCustomerGrantsManagementHandler = create<GrantsHandlerType>()(
  (set) => ({
    isResearchGrantSelected: false,
    isLabsnetGrantSelected: false,
    selectedResearchGrants: [],
    selectedLabsnetGrants: [],
    setIsResearchGrantSelected: (isResearchGrantSelected) =>
      set(() => {
        return {
          isResearchGrantSelected: isResearchGrantSelected,
        };
      }),
    resetIsResearchGrantSelected: () =>
      set(() => {
        return {
          isResearchGrantSelected: false,
        };
      }),
    setIsLabsnetGrantSelected: (isLabsnetGrantSelected) =>
      set(() => {
        return {
          isLabsnetGrantSelected: isLabsnetGrantSelected,
        };
      }),
    resetIsLabsnetGrantSelected: () =>
      set(() => {
        return {
          isLabsnetGrantSelected: false,
        };
      }),
    setSelectedResearchGrants: (grantIds: number[]) =>
      set({ selectedResearchGrants: grantIds }),
    resetSelectedResearchGrants: () =>
      set(() => {
        return {
          selectedResearchGrants: [],
        };
      }),
    setSelectedLabsnetGrants: (grantIds: string[]) =>
      set({ selectedLabsnetGrants: grantIds }),
    resetSelectedLabsnetGrants: () =>
      set(() => {
        return {
          selectedLabsnetGrants: [],
        };
      }),
  }),
);

useCustomerGrantsManagementHandler.subscribe((GrantsHandlerType) => {});
