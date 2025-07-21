import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import Tickets from "@feature/dashboard/operator/tickets";

const index = () => {
  return (
    <Container>
      <Header
        title="تیکت"
        description="کاربر گرامی شما می توانید پیام‌‌های خود را در این قسمت مدیریت کنید"
      />
      <Tickets />
    </Container>
  );
};

export default index;
