import { create } from "zustand";
import { FBElementProp } from "@module/form-builder/type/sample";

type FBManufactureType = {
  form: Array<FBElementProp>;
  createCoreElement: (coreElement: FBElementProp, index?: number) => void;
  updateElement: (elementId: string, element: FBElementProp) => void;
  deleteElement: (elementId: string) => void;
  setInitForm: (form: Array<FBElementProp>) => void;
};

export const useFBManufacture = create<FBManufactureType>()((set, get) => ({
  form: [],
  setInitForm: (form) =>
    set(() => {
      return {
        form: [...form],
      };
    }),
  createCoreElement: (coreElement, index) =>
    set((state) => {
      return {
        form: [
          ...state.form.slice(0, index),
          coreElement,
          ...state.form.slice(index),
        ],
      };
    }),
  deleteElement: (elementId) => {
    set((state) => ({
      form: state.form.filter((formItem) => formItem.id !== elementId),
    }));
  },
  updateElement: (elementId, element) => {
    set((state) => {
      // const elementIndex = state.form.findIndex(formItem => formItem.id === elementId);
      // get().deleteElement(elementId)
      // get().createCoreElement(element, elementIndex)
      // return {
      //   form: state.form
      // }
      const updatedForm = state.form.map((formItem) =>
        formItem.id === elementId ? element : formItem,
      );
      return { form: updatedForm };
    });
  },
}));
