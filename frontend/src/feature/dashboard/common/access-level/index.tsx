import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import React, { ReactElement, useMemo } from "react";
import {
  AccessLevelModules,
  AccessLevelPermissions,
} from "@feature/dashboard/common/access-level/types";

interface AccessLevelProps {
  module: AccessLevelModules | undefined;
  permission: Array<AccessLevelPermissions> | undefined;
  children: ReactElement;
  operator?: "or" | "and";
}

export const AccessLevel = (props: AccessLevelProps) => {
  const { module, operator, children, permission } = props;

  const { data: currentUser, isLoading: currentUserLoading } = useQuery(
    apiUser().me(),
  );
  const modulePermissions = useMemo(() => {
    if (!module) return undefined;
    return currentUser?.data?.access_levels_dict?.[module];
  }, [currentUser?.data?.access_levels_dict, module]);

  const logicalOperator = useMemo(() => {
    return operator ?? "or";
  }, [operator]);

  const hasAccess = useMemo(() => {
    let access = false;
    if (!permission) return true;
    if (!module) return true;
    if (!modulePermissions) return false;

    if (logicalOperator === "or") {
      modulePermissions?.forEach((modulePermissionItem) => {
        if (permission?.includes(modulePermissionItem)) {
          access = true;
        }
      });
    }
    if (logicalOperator === "and") {
      access = true;
      permission?.forEach((permissionItem) => {
        if (!modulePermissions?.includes(permissionItem)) {
          access = false;
          return;
        }
      });
    }

    return access;
  }, [logicalOperator, module, modulePermissions, permission]);

  if (currentUserLoading) return <></>;
  if (hasAccess) return <>{children}</>;

  return <></>;
};
