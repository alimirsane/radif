import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import Grant from "@feature/dashboard/operator/grant";
// import Grant from "@feature/dashboard/customer/grant";

const Index = () => {
  return (
    <Container>
      <Header
        title="بررسی درخواست‌های گرنت"
        description="کاربر گرامی شما می‌توانید درخواست‌های دریافتی خود را در این قسمت مدیریت کنید."
      />
      <div className="mt-6">
        <Grant />
      </div>
    </Container>
  );
};

export default Index;
