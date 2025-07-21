import NavLink from "@feature/dashboard/common/navigation/nav-link";
import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import { useMemo } from "react";
import { routes } from "@data/routes";
import { useRouter } from "next/router";
import { UserType } from "@api/service/user/type/user-type";
import { StaffNavItems } from "@feature/dashboard/common/navigation/items/staff-items";
import { CustomerNavItems } from "@feature/dashboard/common/navigation/items/customer-items";

export const NavItems = () => {
  const { data: me } = useQuery(apiUser().me());

  const router = useRouter();

  const isStaff = useMemo(() => {
    return me?.data.user_type === UserType.STAFF;
  }, [me]);

  const isCustomerRoute = useMemo(() => {
    return router.asPath.includes(routes.customer());
  }, [router.asPath]);

  const isStaffRoute = useMemo(() => {
    return router.asPath.includes(routes.operator());
  }, [router.asPath]);

  if (isStaff) {
    if (isCustomerRoute) return <CustomerNavItems />;
    if (isStaffRoute) return <StaffNavItems />;
    else return <></>;
  } else {
    return <CustomerNavItems />;
  }
};
