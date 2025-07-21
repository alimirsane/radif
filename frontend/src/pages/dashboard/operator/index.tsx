import { useEffect, useMemo, useState } from "react";

import { routes } from "@data/routes";
import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import Home, { HomeItemProps } from "@feature/dashboard/common/home";
import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import {
  IcCalendar,
  IcCardList,
  IcCashStack,
  IcChart,
  IcEnvelope,
  IcLaboratory,
  IcMoneyEnvelope,
  IcMoneyGear,
  IcPeople,
  IcProfile,
  IcStandard,
} from "@feature/kits/common/icons";

const Index = () => {
  const { data: user } = useQuery({
    ...apiUser().me(),
  });

  const items: Array<HomeItemProps> = useMemo(() => {
    // Check if user has the 'ادمین' role
    const hasAdminRole = user?.data?.role_obj?.some(
      (role) => role.role_key === "admin",
    );
    // Check if user has the 'مدیریت' role
    const hasManagerRole = user?.data?.role_obj?.some(
      (role) => role.role_key === "manager",
    );
    return [
      {
        title: "مدیریت درخواست‌ها",
        description:
          "بررسی و مشاهده جزئیات کلیه‌ی درخواست‌های ثبت‌ شده و انجام اقدامات لازم",
        // description: "درخواست‌های شما در این بخش قابل مشاهده است.",
        icon: <IcCardList />,
        route: routes.operatorRequest(),
        module: "request",
        permission: ["view"],
      },
      {
        title: "مدیریت آزمایشگاه‌ها",
        description:
          "ثبت و مدیریت اطلاعات آزمایشگاه‌ها، آزمون‌ها و تجهیزات مرتبط با آن‌ها",
        // description: "در این بخش می‌توانید آزمایشگاه‌های خود را مدیریت کنید.",
        icon: <IcLaboratory />,
        route: routes.operatorLaboratoryList(),
        module: "laboratory",
        permission: ["update", "view"],
      },
      {
        title: "نوبت دهی",
        description: "تعریف و مدیریت نوبت‌های مربوط به انجام آزمون‌ها",
        // description:
        //   "در این بخش می‌توانید نوبت‌های مربوط به آزمون‌ها را مدیریت کنید.",
        icon: <IcCalendar />,
        route: routes.operatorAppointments(),
        module: "laboratory",
        permission: ["update", "view"],
      },
      {
        title: "کاربران همکار",
        description:
          "مدیریت اطلاعات و دسترسی‌های کاربران همکار و امکان افزودن همکار جدید",
        // description:
        //   "در این بخش می‌توانید همکارانی که با پلتفرم کار می‌کنند را مدیریت کنید.",
        icon: <IcPeople />,
        route: routes.operatorUsers(),
        module: "user",
        permission: ["create", "view"],
        operator: "and",
      },
      {
        title: "مشتریان سامانه",
        description:
          "مدیریت اطلاعات و تنظیمات مشتریان و امکان افزودن مشتری جدید",
        // description:
        //   "در این بخش می‌توانید مشتریانی که با پلتفرم کار می‌کنند را مدیریت کنید.",
        icon: <IcPeople />,
        route: routes.operatorCustomers(),
        module: "user",
        permission: ["create", "view"],
        operator: "and",
      },
      {
        title: "مدیریت مالی",
        description:
          "دسترسی به تراکنش‌ها، صورت‌حساب‌ها و گزارش‌های مالی با امکان انجام اقدامات مدیریتی",
        // description: "در این بخش می‌توانید لیست سفارشات را مشاهده کنید.",
        icon: <IcCashStack />,
        route: routes.operatorTransaction(),
        module: "paymentrecord",
        permission: ["delete"],
      },
      {
        title: "بررسی درخواست‌های گرنت",
        description:
          "مشاهده اعتبار گرنت و رسیدگی به درخواست‌های ثبت شده توسط دانشجویان",
        // description:
        //   "در این بخش می‌توانید درخواست‌های گرنت‌ دانشجویان را مدیریت کنید.",
        icon: <IcMoneyEnvelope />,
        route: routes.operatorGrantRequests(),
        module: "grantrequest",
        permission: ["view"],
      },
      {
        title: "مدیریت گرنت‌ها",
        description:
          "افزودن گرنت‌های جدید به‌صورت تکی یا گروهی و مدیریت گرنت‌های اعطا شده",
        // description: "در این بخش می‌توانید گرنت‌ها را ایجاد و مدیریت کنید.",
        icon: <IcMoneyGear />,
        route: routes.operatorGrants(),
        module: "grantrecord",
        permission: ["create", "view"],
        operator: "and",
      },
      {
        title: "وضعیت استاندارد آزمایشگاه‌ها",
        description:
          "مدیریت کیفیت، بررسی وضعیت استاندارد آزمایشگاه‌ها (ایزو) و اعمال تنظیمات مربوطه",
        // description:
        //   "در این بخش می‌توانید وضعیت استاندارد آزمایشگاه‌ها را مدیریت کنید.",
        icon: <IcStandard />,
        route: routes.operatorISO(),
        module: "user",
        permission: ["delete"],
        operator: "and",
      },
      (hasAdminRole || hasManagerRole) && {
        title: "گزارش‌های مدیریتی",
        description: "نمایش گزارش‌های آماری و مدیریتی از عملکرد سامانه",
        // description: "در این بخش می‌توانید گزارشات را مشاهده کنید.",
        icon: <IcChart />,
        route: routes.operatorReports(),
      },
      {
        title: "پیام‌ها",
        description: "دسترسی به کلیه‌ی پیام‌های دریافتی و انجام اقدامات مربوطه",
        // description: "در این بخش می‌توانید لیست پیام‌های خود را مشاهده کنید.",
        icon: <IcEnvelope />,
        route: routes.operatorMessages(),
      },
      {
        title: "حساب کاربری",
        description: "مدیریت اطلاعات شخصی و تنظیمات حساب کاربری",
        // description: "در این بخش می‌توانید اطلاعات حساب خود را بررسی کنید.",
        icon: <IcProfile />,
        route: routes.operatorProfile(),
      },
    ].filter(Boolean) as HomeItemProps[];
  }, [user]);
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ACCOUNT_SELECTION === "true") {
      const timer = setTimeout(() => {
        setShowComponent(true);
      }, 200);
      // Cleanup the timer
      return () => clearTimeout(timer);
    } else {
      setShowComponent(true);
    }
  }, []);
  return (
    <Container>
      <Header
        title="میز کار"
        description="برای ورود به بخش مورد نظر از طریق زیر اقدام کنید."
      />
      {showComponent && <Home items={items} />}
    </Container>
  );
};

export default Index;
