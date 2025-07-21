import { PopupType } from "@kit/popup/type";

export interface MenuType extends Omit<PopupType, "backdrop"> {}
