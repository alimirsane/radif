import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import Messages from "@feature/dashboard/operator/messages";
const index = () => {
  return (
    <Container>
      <Header
        title="پیام‌ها"
        description="کاربر گرامی شما می‌توانید پیام‌‌های خود را در این قسمت مدیریت کنید."
      />
      <Messages />
    </Container>
  );
};

export default index;
