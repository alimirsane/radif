import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import Grant from "@feature/dashboard/customer/grant";

const Index = () => {
  return (
    <Container>
      <Header
        title="پیگیری گرنت‌ها"
        description="کاربر گرامی شما می‌توانید گرنت‌های درخواستی خود را در این قسمت مدیریت کنید."
      />
      <div className="mt-6">
        <Grant />
      </div>
    </Container>
  );
};

export default Index;
