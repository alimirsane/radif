export const convertRouteToName = (route: string) => {
  const noQueryRoute = route?.split("?")?.[0].replace(/\/\d+$/, "");
  switch (noQueryRoute) {
    case "/":
      return "";
    case "/kits-sample":
      return "کیت‌های پروژه";
    case "/dashboard/operator":
      return "میز کار همکار";
    case "/dashboard/operator/requests-list":
      return "مدیریت درخواست‌ها";
    case "/dashboard/operator/laboratory":
      return "مدیریت آزمایشگاه‌ها";
    case "/dashboard/operator/appointments":
      return "نوبت دهی";
    case "/dashboard/operator/users":
      return "کاربران همکار";
    case "/dashboard/operator/customers":
      return "مشتریان سامانه";
    case "/dashboard/operator/transaction":
      return "مدیریت مالی";
    case "/dashboard/operator/grant-requests":
      return "بررسی درخواست‌های گرنت";
    case "/dashboard/operator/grants":
      return "مدیریت گرنت‌ها";
    case "/dashboard/operator/reports":
      return "گزارش‌های مدیریتی";
    case "/dashboard/operator/iso":
      return "وضعیت استاندارد آزمایشگاه‌ها";
    case "/dashboard/operator/messages":
      return "پیام‌ها";
    case "/dashboard/operator/tickets":
      return "مدیریت تیکت‌ها";
    case "/dashboard/operator/profile":
      return "حساب کاربری";
    case "/dashboard/customer":
      return "میز کار مشتری";
    case "/dashboard/customer/request":
      return "ثبت درخواست‌ جدید";
    case "/dashboard/customer/list-requests":
      return "درخواست‌های ثبت‌ شده";
    case "/dashboard/customer/my-appointments":
      return "نوبت‌های ثبت‌ شده";
    case "/dashboard/customer/payment":
      return "پرداخت هزینه";
    case "/dashboard/customer/pre-payment":
      return "پیش پرداخت";
    case "/dashboard/customer/payment/confirm":
      return "جزئیات تراکنش";
    case "/dashboard/customer/pre-payment/confirm":
      return "جزئیات تراکنش";
    case "/dashboard/customer/my-financial-report":
      return "سوابق مالی";
    case "/dashboard/customer/grant-requests-management":
      return "بررسی درخواست‌های گرنت";
    case "/dashboard/customer/my-grant-requests":
      return "پیگیری گرنت‌ها";
    case "/dashboard/customer/messages":
      return "پیام‌ها";
    case "/dashboard/customer/profile":
      return "حساب کاربری";
    case "/dashboard/customer/wallet":
      return "کیف پول";
    case "/auth/sign-in":
      return "";
    case "/auth/signup":
      return "";
    case "/auth/reset-password":
      return "";
    default:
      return "";
  }
};
