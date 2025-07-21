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
  IcChat,
  IcEnvelope,
  IcMoneyEnvelope,
  IcMoneyNote,
  IcNewFile,
  IcProfile,
  IcReceiptCutoff,
} from "@feature/kits/common/icons";

const Index = () => {
  const { data: user } = useQuery({
    ...apiUser().me(),
  });

  const items: Array<HomeItemProps> = useMemo(() => {
    // Check if user is sharif student
    const isSharifStudent = user?.data?.is_sharif_student;
    // Check if user has the 'دانشجو' role
    const hasStudentRole = user?.data?.role_obj?.some(
      (role) => role.role_key === "student",
    );
    // Check if user has the 'ادمین' role
    const hasAdminRole = user?.data?.role_obj?.some(
      (role) => role.role_key === "admin",
    );
    // Check if user has the 'مدیریت' role
    const hasManagerRole = user?.data?.role_obj?.some(
      (role) => role.role_key === "manager",
    );
    // Check if user has the 'استاد' role
    const hasProfessorRole = user?.data?.role_obj?.some(
      (role) => role.role_key === "teacher",
    );
    return [
      {
        title: "ثبت درخواست‌ جدید",
        description:
          "مشاهده لیست آزمایشگاه‌ها و آزمون‌ها و امکان ثبت درخواست جدید",
        // description: "برای ساخت درخواست جدید کلیک کنید.",
        icon: <IcNewFile />,
        route: routes.customerRequest(),
        module: "request",
        permission: ["create", "view"],
        operator: "and",
      },
      {
        title: "درخواست‌های ثبت‌ شده",
        description:
          "مشاهده لیست کلیه‌ی درخواست‌های ثبت‌ شده به‌همراه جزئیات و وضعیت آن‌ها",
        // description: "درخواست‌های شما در این بخش قابل مشاهده است.",
        icon: <IcCardList />,
        route: routes.customerRequestsList(),
        module: "request",
        permission: ["view"],
      },
      {
        title: "سوابق مالی",
        description:
          "دسترسی به تراکنش‌ها، صورت‌حساب‌ها و جزئیات پرداخت‌های هر درخواست",
        // description:
        //   "لیست سفارشات و صورت‌حساب‌های شما در این بخش قابل مشاهده است.",
        icon: <IcReceiptCutoff />,
        route: routes.customerFinancialReport(),
        module: "transaction",
        permission: ["view"],
      },
      ((hasStudentRole && isSharifStudent) ||
        hasAdminRole ||
        hasManagerRole) && {
        title: "پیگیری گرنت‌ها",
        description:
          "ثبت درخواست جدید برای دریافت گرنت و پیگیری وضعیت درخواست‌های قبلی",
        // description:
        //   "در این بخش می‌توانید درخواست‌های گرنت‌ خود را مدیریت کنید.",
        icon: <IcMoneyNote />,
        route: routes.customerGrantRequests(),
        module: "grantrequest",
        permission: ["view", "create"],
      },
      (hasProfessorRole || hasAdminRole || hasManagerRole) && {
        title: "بررسی درخواست‌های گرنت",
        description:
          "مشاهده اعتبار گرنت و رسیدگی به درخواست‌های ثبت شده توسط دانشجویان",
        // description:
        //   "در این بخش می‌توانید درخواست‌های گرنت‌ دانشجویان را مدیریت کنید.",
        icon: <IcMoneyEnvelope />,
        route: routes.customerGrantRequestsManagement(),
        module: "grantrequest",
        permission: ["view"],
      },
      {
        title: "نوبت‌های ثبت‌ شده",
        description:
          "مشاهده اطلاعات نوبت‌های رزرو شده برای آزمون‌ها و امکان لغو نوبت در صورت نیاز",
        // description: "لیست نوبت‌های شما در این بخش قابل مشاهده است.",
        icon: <IcCalendar />,
        route: routes.customerAppointments(),
        module: "request",
        permission: ["view"],
      },
      // {
      //   title: "کیف پول",
      //   description: "در این بخش می‌توانید کیف پول خود را مدیریت کنید.",
      //   route: routes.customerWallet(),
      //   module: "paymentrecord",
      //   permission: ["create"],
      // },
      {
        title: "نظرسنجی",
        description: "ثبت نظرات، پیشنهادها و انتقادات جهت بهبود خدمات",
        // description:
        //   "در این بخش می‌توانید انتقادات و پیشنهادات خود را ثبت کنید.",
        icon: <IcChat />,
        route: "https://survey.porsline.ir/s/ISP9iDdI",
      },
      {
        title: "پیام‌ها",
        description: "دسترسی به کلیه‌ی پیام‌های دریافتی و انجام اقدامات مربوطه",
        // description: "در این بخش می‌توانید لیست پیام‌های خود را مشاهده کنید.",
        icon: <IcEnvelope />,
        route: routes.customerMessages(),
      },
      {
        title: "حساب کاربری",
        description: "مدیریت اطلاعات شخصی و تنظیمات حساب کاربری",
        // description: "در این بخش می‌توانید اطلاعات حساب خود را بررسی کنید.",
        icon: <IcProfile />,
        route: routes.customerProfile(),
      },
    ].filter(Boolean) as HomeItemProps[];
  }, [user]);
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ACCOUNT_SELECTION === "false") {
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
