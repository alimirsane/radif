import Header from "@feature/dashboard/common/header";
import React from "react";
import ListRequests from "@feature/dashboard/customer/list-requests";
import Container from "@feature/dashboard/common/container";

const index = () => {
  return (
    <Container>
      <Header
        title="درخواست‌های ثبت شده"
        description="کاربر گرامی می‌توانید وضعیت درخواست‌های خود را در این قسمت مشاهده کنید."
      />
      <ListRequests />
    </Container>
  );
};

export default index;
