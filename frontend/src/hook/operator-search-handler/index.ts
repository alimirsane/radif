import { create } from "zustand";

type SearchHandlerType = {
  searchValue: string | undefined;
  setSearchValue: (labId: string | undefined) => void;
};

export const useOperatorSearchHandler = create<SearchHandlerType>()((set) => ({
  searchValue: undefined,
  setSearchValue: (searchValue) =>
    set(() => {
      return {
        searchValue: searchValue,
      };
    }),
}));

useOperatorSearchHandler.subscribe((searchHandler) => {
});
