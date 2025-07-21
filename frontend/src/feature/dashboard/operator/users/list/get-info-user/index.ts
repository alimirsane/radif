import { create } from "zustand";

interface setType {
  first_name: string | undefined;
  last_name: string | undefined;
  position: string | undefined;
  access_level: string | undefined;
  id: string | undefined;
  password: string | undefined;
}

type UserHandlerType = {
  first_name: string | undefined;
  last_name: string | undefined;
  position: string | undefined;
  access_level: string | undefined;
  id: string | undefined;
  username: string | undefined;
  national_id: string | undefined;
  password?: string | undefined;
  setUserEditHandler: (props: setType) => void;
};

type reloadUsersType = {
  reload: boolean;
  setReloadUsers: (reload: boolean) => void;
};

export const useUserEditHandler = create<UserHandlerType>()((set) => ({
  first_name: undefined,
  last_name: undefined,
  position: undefined,
  access_level: undefined,
  id: undefined,
  username: undefined,
  national_id: undefined,
  password: undefined,
  setUserEditHandler: (value) =>
    set(() => {
      return {
        first_name: value.first_name,
        last_name: value.last_name,
        position: value.position,
        access_level: value.access_level,
        id: value.id,
        password: value.password,
      };
    }),
}));

export const useReloadUsers = create<reloadUsersType>()((set) => ({
  reload: false,
  setReloadUsers: (value: boolean) => {
    set(() => {
      return {
        reload: value,
      };
    });
  },
}));

useUserEditHandler.subscribe((userEditHandler) => {});
