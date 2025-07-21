import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Container from "@feature/dashboard/common/container";
import { Breadcrumb } from "@feature/dashboard/common/breadcrumb";

export const RouteBreadcrumb = () => {
  const router = useRouter();
  const { pathname, query } = router;

  const translateSegment = (segment: string) => {
    const translations: { [key: string]: string } = {
      ["customer"]: "میز کار مشتری",
      ["operator"]: "میز کار همکار",
      ["requests-list"]: "مدیریت درخواست‌ها",
      ["laboratory"]: "مدیریت آزمایشگاه‌ها",
      ["customers"]: "مشتریان سامانه",
      ["transaction"]: "مدیریت مالی",
      ["users"]: "کاربران همکار",
      ["reports"]: "گزارش‌های مدیریتی",
      ["tickets"]: "مدیریت تیکت",
      ["request"]: "ثبت درخواست جدید",
      ["list-requests"]: "درخواست‌های ثبت‌ شده",
      ["grants"]: "مدیریت گرنت‌ها",
      ["iso"]: "وضعیت استاندارد آزمایشگاه‌ها",
      ["appointments"]: "نوبت دهی",
      ["grant-requests"]: "بررسی درخواست‌های گرنت",
      ["grant-requests-management"]: "بررسی درخواست‌های گرنت",
      ["my-grant-requests"]: "پیگیری گرنت‌ها",
      ["financial-report"]: "گزارش مالی",
      ["my-financial-report"]: "سوابق مالی",
      ["my-appointments"]: "نوبت‌های ثبت‌ شده",
      ["wallet"]: "کیف پول",
      ["messages"]: "پیام‌ها",
      ["profile"]: "حساب کاربری",
      ["confirm"]: "جزئیات",
      ["payment"]: "تراکنش",
      ["pre-payment"]: "تراکنش",
    };

    if (segment.startsWith("[") && segment.endsWith("]")) {
      const dynamicSegmentName = segment.slice(1, -1);
      const dynamicSegmentTranslation: { [key: string]: string } = {
        id: "جزئیات درخواست",
      };

      return (
        dynamicSegmentTranslation[dynamicSegmentName] || dynamicSegmentName
      );
    } else {
      return translations[segment] || segment;
    }
  };

  const pathSegments = useMemo(() => {
    return pathname.split("/").filter((segment) => segment !== "");
  }, [pathname]);

  return (
    <Container>
      <Breadcrumb>
        {React.Children.toArray(
          pathSegments.map((segment, index) => {
            // avoid showing specific urls
            if (["dashboard"].includes(segment)) return null;

            const hrefSegments = pathSegments.slice(0, index + 1);
            const href = `/${hrefSegments
              .map((hrefSegment) => {
                if (hrefSegment.startsWith("[") && hrefSegment.endsWith("]")) {
                  const dynamicSegmentName = hrefSegment.slice(1, -1);
                  return query[dynamicSegmentName] as string;
                } else {
                  return hrefSegment;
                }
              })
              .join("/")}`;

            const translatedSegment = translateSegment(segment);

            return (
              <Link href={href}>
                <p
                  className={`text-sm ${index === pathSegments.length - 1 ? "font-bold text-primary" : "text-common-gray"}`}
                >
                  {translatedSegment}
                </p>
              </Link>
            );
          }),
        )}
      </Breadcrumb>
    </Container>
  );
};
