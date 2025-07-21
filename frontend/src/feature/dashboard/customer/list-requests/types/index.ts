import { HTMLAttributes } from "react";
import { RequestType } from "@api/service/request/type";

export interface StatusType {
  status:
    | "complete-application"
    | "waiting-payment"
    | "waiting-sample"
    | "doing"
    | "request-rejection"
    | "waiting-review"
    | "new"
}

export interface ListItemType extends HTMLAttributes<HTMLDivElement> {
  item: RequestType;
  expandItem: number[];
}

// export interface requestType {
//   request: {
//     id?: number;
//     created_at?: string;
//     delivery_date?: string;
//     experiment?: number;
//     parameter?: number[];
//     status?: string;
//     description?: string;
//     experiment_obj: object;
//   };
// }
