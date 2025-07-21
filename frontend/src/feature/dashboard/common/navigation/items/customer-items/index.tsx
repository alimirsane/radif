import NavLink from "@feature/dashboard/common/navigation/nav-link";
import { routes } from "@data/routes";
import { useRouter } from "next/router";
import { convertRouteToName } from "@data/routes/convert-to-name";

export const CustomerNavItems = () => {
  const router = useRouter();

  return (
    <>
      {/*<NavLink href="/" active>*/}
      {/*  صفحه اصلی*/}
      {/*</NavLink>*/}
      <NavLink
        active={router.asPath === routes.customer()}
        href={routes.customer()}
      >
        میز کار
      </NavLink>

      {router.asPath !== routes.customer() &&
        <NavLink
          active={true}
          href={router.asPath}
        >
          {convertRouteToName(router.asPath)}
        </NavLink>
      }

      {/*<NavLink*/}
      {/*  active={router.asPath.includes(routes.customerRequestsList())}*/}
      {/*  href={routes.customerRequestsList()}*/}
      {/*>*/}
      {/*  لیست درخواست‌ها*/}
      {/*</NavLink>*/}
      {/*<NavLink*/}
      {/*  active={router.asPath.includes(routes.customerRequest())}*/}
      {/*  href={routes.customerRequest()}*/}
      {/*>*/}
      {/*  ایجاد درخواست‌ جدید*/}
      {/*</NavLink>*/}
    </>
  );
};
