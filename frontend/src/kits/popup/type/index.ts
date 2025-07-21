import { ReactElement, ReactNode } from "react";

export interface PopupType {
  children: ReactElement;
  holder: ReactElement;
  defaultOpen?: boolean;
  backdrop?: boolean;
  keepOpen?: boolean;
  open?: boolean;
  onChange?: (open: boolean) => void;
}
