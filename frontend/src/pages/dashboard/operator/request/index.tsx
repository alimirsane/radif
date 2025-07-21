import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import RequestDetails from "@feature/dashboard/operator/component/request-details";

const OperatorRoute = () => {
  return (
    <Container>
      <div id="request_operator_header">
        <Header
          title="مدیریت درخواست‌ها"
          description="کاربر گرامی می‌توانید لیست درخواست‌ها را در این قسمت مشاهده کنید."
        />
      </div>
      <RequestDetails />
    </Container>
  );
};

export default OperatorRoute;
