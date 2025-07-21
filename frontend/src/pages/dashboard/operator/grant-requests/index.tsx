import Header from "@feature/dashboard/common/header";
import Container from "@feature/dashboard/common/container";
import Grant from "@feature/dashboard/operator/grant";

const Index = () => {
  return (
    <Container>
      <Header
        title="بررسی درخواست‌های گرنت"
        description="کاربر گرامی شما می‌توانید درخواست‌های گرنت دانشجوهای خود را در این قسمت مدیریت کنید."
      />
      <Grant />
    </Container>
  );
};

export default Index;
