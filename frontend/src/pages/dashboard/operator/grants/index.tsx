import Header from "@feature/dashboard/common/header";
import Container from "@feature/dashboard/common/container";
import GrantRecords from "@feature/dashboard/operator/grant-record";

const Index = () => {
  return (
    <Container>
      <Header
        title="مدیریت گرنت‌ها"
        description="کاربر گرامی شما می‌توانید گرنت‌ها را در این قسمت مدیریت کنید."
      />
      <GrantRecords />
    </Container>
  );
};

export default Index;
