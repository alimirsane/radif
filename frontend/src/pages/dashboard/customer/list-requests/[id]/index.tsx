import Header from "@feature/dashboard/common/header";
import RequestId from "@feature/dashboard/customer/request-id";
import Container from "@feature/dashboard/common/container";

const Index = () => {
  return (
    <Container>
      <Header
        title="جزئیات درخواست"
        description="کاربر گرامی در این صفحه می‌‌توانید جزئيات درخواست خود را مشاهده فرمائيد."
      />
      <RequestId />
    </Container>
  );
};

export default Index;
