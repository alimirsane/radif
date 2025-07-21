import Container from "../container";
import React, { useEffect } from "react";
import ProfileButton from "./profile-button";
import Menu from "./menu";
import Drawer from "./drawer";
import { useState } from "react";
import NotificationMessages from "@feature/dashboard/common/navigation/notification-messages";
import GrantInfo from "./grant-info";
import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";

const Navigation = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { data: user, refetch } = useQuery({
    ...apiUser().me(),
  });
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Check if user has the 'دانشجو' role
  const hasStudentRole = user?.data?.role_obj?.some(
    (role) => role.role_key === "student",
  );
  // Check if user has the 'استاد' role
  const hasTeacherRole = user?.data?.role_obj?.some(
    (role) => role.role_key === "teacher",
  );
  // Check if user has the 'ادمین' role
  const hasAdminRole = user?.data?.role_obj?.some(
    (role) => role.role_key === "admin",
  );

  // set user data to raychat
  useEffect(() => {
    const userData = user?.data;
    if (typeof window !== "undefined" && window.Raychat && userData?.id) {
      // var user_data = window?.Raychat?.getUser();
      // window.Raychat.loadUser(user_data.id);
      window.Raychat.setUser({
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        phone: userData.username,
      });
    }
  }, [user?.data]);

  return (
    <nav
      id="navigation-bar"
      className="relative lg:bg-background-paper-light lg:shadow-lg"
    >
      <Container>
        <div className="flex items-center justify-between">
          <Menu setOpenDrawer={() => setOpenDrawer(!openDrawer)} />
          <div className={"flex items-center gap-0 lg:gap-3"}>
            <NotificationMessages />
            {hasTeacherRole && <GrantInfo userType="teacher" />}
            {hasStudentRole && <GrantInfo userType="student" />}
            <ProfileButton />
          </div>
        </div>
      </Container>
      {openDrawer ? <Drawer /> : ""}
    </nav>
  );
};

export default Navigation;
