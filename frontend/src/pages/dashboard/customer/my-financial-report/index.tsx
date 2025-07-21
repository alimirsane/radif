import Header from "@feature/dashboard/common/header";
import Container from "@feature/dashboard/common/container";
import PaymentsList from "@feature/dashboard/customer/financial-report";

const index = () => {
  return (
    <>
      <Container>
        <div id="transaction-header">
          <Header
            title="سوابق مالی"
            description="کاربر گرامی شما می‌توانید صورت‌حساب‌های خود را در این بخش مشاهده نمایید."
          />
        </div>
        <PaymentsList />
      </Container>
    </>
  );
};

export default index;
