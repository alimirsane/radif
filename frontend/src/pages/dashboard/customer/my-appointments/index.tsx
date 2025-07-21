import Header from "@feature/dashboard/common/header";
import Container from "@feature/dashboard/common/container";
import Appointments from "@feature/dashboard/customer/appointments";

const index = () => {
  return (
    <>
      <Container>
        <div id="transaction-header">
          <Header
            title="نوبت‌های ثبت شده"
            description="کاربر گرامی شما می‌توانید نوبت‌های خود را در این بخش مشاهده نمایید."
          />
        </div>
        <Appointments />
      </Container>
    </>
  );
};

export default index;
