import { routes } from "@data/routes";
import {
  AccessLevelModules,
  AccessLevelPermissions,
} from "@feature/dashboard/common/access-level/types";
import { RouteValues } from "@data/routes/type";

const withoutAccessLevel = {
  module: undefined,
  permissions: undefined,
};

export const routeModuleConvertor = (
  route: RouteValues,
): {
  module: AccessLevelModules | undefined;
  permissions: Array<AccessLevelPermissions> | undefined;
  operator?: "or" | "and";
} => {
  switch (route) {
    case "/":
      return withoutAccessLevel;
    case "/kits-sample":
      return withoutAccessLevel;
    case "/dashboard/operator":
      return withoutAccessLevel;
    case "/dashboard/operator/users":
      return {
        module: "user",
        permissions: ["create", "view"],
        operator: "and",
      };
    case "/dashboard/operator/reports":
      return withoutAccessLevel;
    case "/dashboard/operator/requests-list":
      return {
        module: "request",
        permissions: ["view"],
      };
    case "/dashboard/operator/laboratory":
      return withoutAccessLevel;
    case "/dashboard/operator/messages":
      return withoutAccessLevel;
    case "/dashboard/operator/grant-requests":
      return {
        module: "grantrequest",
        permissions: ["view"],
      };
    case "/dashboard/operator/grants":
      return {
        module: "grantrecord",
        permissions: ["create", "view"],
        operator: "and",
      };
    case "/dashboard/operator/transaction":
      return {
        module: "paymentrecord",
        permissions: ["view"],
      };
    case "/dashboard/operator/tickets":
      return withoutAccessLevel;
    case "/dashboard/customer":
      return withoutAccessLevel;
    case "/dashboard/customer/request":
      return {
        module: "request",
        permissions: ["create", "view"],
        operator: "and",
      };
    case "/dashboard/customer/list-requests":
      return {
        module: "request",
        permissions: ["view"],
      };
    case "/dashboard/customer/messages":
      return withoutAccessLevel;
    case "/dashboard/customer/payment":
      return withoutAccessLevel;
    // return {
    //   module: "paymentrecord",
    //   permissions: ["create"],
    // };
    case "/dashboard/customer/payment/confirm":
      return withoutAccessLevel;
    // return {
    //   module: "paymentrecord",
    //   permissions: ["create"],
    // };
    case "/dashboard/customer/profile":
      return withoutAccessLevel;
    case "/dashboard/customer/my-grant-requests":
      return {
        module: "grantrequest",
        permissions: ["create", "view"],
      };
    case "/dashboard/customer/wallet":
      return {
        module: "paymentrecord",
        permissions: ["create"],
      };
    case "/dashboard/customer/my-financial-report":
      return withoutAccessLevel;
    case "/auth/sign-in":
      return withoutAccessLevel;
    case "/auth/signup":
      return withoutAccessLevel;
    case "/auth/reset-password":
      return withoutAccessLevel;
    default:
      return withoutAccessLevel;
  }
};
