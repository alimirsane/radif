import { NextRequest, NextResponse } from "next/server";
import { routes } from "@data/routes";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { UserType } from "@api/service/user/type/user-type";
import {
  AccessLevelModules,
  AccessLevelPermissions,
} from "@feature/dashboard/common/access-level/types";
import { routeModuleConvertor } from "@feature/dashboard/common/access-level/route-module-convertor";

const redirectTo = (
  request: NextRequest,
  redirectTo: string,
  forceRedirecting?: boolean,
) => {
  const url = request.nextUrl.clone();
  const force = forceRedirecting ?? false;
  url.pathname = redirectTo;
  if (force) return NextResponse.redirect(url);
  if (request.url.includes(redirectTo)) return NextResponse.next();
  return NextResponse.redirect(url);
};

const urlIncludes = (request: NextRequest, ...urls: Array<string>) => {
  return urls.some((urlItem) => request.url.includes(urlItem));
};

const hasAccessToPage = (
  currentUser: CurrentUserType,
  module: AccessLevelModules | undefined,
  permission: Array<AccessLevelPermissions> | undefined,
  operator?: "or" | "and",
) => {
  let access = false;
  if (!permission) return true;
  if (!module) return true;
  const modulePermissions = currentUser?.access_levels_dict?.[module];
  const logicalOperator = operator ?? "or";

  if (logicalOperator === "or") {
    access = false;
    modulePermissions?.forEach((permissionItem) => {
      if (permission?.includes(permissionItem)) {
        access = true;
        return;
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
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // check if token exist, if not then redirect to login page
  const token = request.cookies.get("token")?.value;
  if (!token) {
    if (urlIncludes(request, routes.signup())) {
      return redirectTo(request, routes.signup());
    } else if (urlIncludes(request, routes.resetPassword())) {
      return redirectTo(request, routes.resetPassword());
    } else if (urlIncludes(request, routes.sso())) {
      return redirectTo(request, routes.sso());
    } else {
      return redirectTo(request, routes.signIn());
    }
  }

  // check if token is correct by calling current-user service, if token is not valid then redirect to login page
  const currentUserFetch = await fetch(
    process.env.NEXT_PUBLIC_API_DOMAIN + "/accounts/current-user/",
    {
      headers: {
        Authorization: "Token " + token,
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    },
  );

  if (!currentUserFetch.ok) {
    const redirect = redirectTo(request, routes.signIn());
    redirect.cookies.delete("token");
    return redirect;
  }

  const currentUserResponse = await currentUserFetch.json();
  const currentUserData = currentUserResponse?.data as
    | CurrentUserType
    | undefined;

  if (!currentUserData) {
    return redirectTo(request, routes.signIn());
  } else {
    switch (currentUserData.user_type) {
      case UserType.STAFF:
        if (urlIncludes(request, routes.signIn(), routes.signup())) {
          return redirectTo(request, routes.operator());
        }
        break;
      case UserType.CUSTOMER:
        if (
          urlIncludes(
            request,
            routes.operator(),
            routes.signIn(),
            routes.signup(),
          )
        ) {
          return redirectTo(request, routes.customer());
        }
        break;
    }
  }

  // check access level by checking user-access-levels which is return from current-user service
  const accessLevel = routeModuleConvertor(request.nextUrl.pathname);
  const hasAccess = hasAccessToPage(
    currentUserData,
    accessLevel.module,
    accessLevel.permissions,
    accessLevel.operator,
  );
  if (!hasAccess) {
    switch (currentUserData.user_type) {
      case UserType.STAFF:
        if (urlIncludes(request, routes.customer())) {
          return redirectTo(request, routes.customer(), true);
        } else {
          return redirectTo(request, routes.operator(), true);
        }
      case UserType.CUSTOMER:
        return redirectTo(request, routes.customer(), true);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|v1|firebase-messaging-sw.js|_next/static|_next/image|favicon.ico).*)",
  ],
};
