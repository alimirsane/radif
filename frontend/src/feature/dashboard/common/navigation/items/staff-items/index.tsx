import NavLink from "@feature/dashboard/common/navigation/nav-link";
import { routes } from "@data/routes";
import { useRouter } from "next/router";
import { convertRouteToName } from "@data/routes/convert-to-name";

export const StaffNavItems = () => {
  const router = useRouter();

  return (
    <>
      {/*<NavLink href="/" active>*/}
      {/*  صفحه اصلی*/}
      {/*</NavLink>*/}
      <NavLink active={router.asPath === routes.operator()} href="/">
        میز کار
      </NavLink>

      {router.asPath !== routes.operator() &&
        <NavLink
          active={true}
          href={router.asPath}
        >
          {convertRouteToName(router.asPath)}
        </NavLink>
      }
    </>
  );
};
