import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import Transaction from "@feature/dashboard/operator/transaction";

const TransactionManagement = () => {
  return (
    <Container>
      <div id="transaction-header">
        <Header
          title="مدیریت مالی"
          description="کاربر گرامی شما می‌توانید تراکنش‌های درخواست‌ها را در این قسمت مدیریت کنید."
        />
      </div>
      <Transaction />
    </Container>
  );
};

export default TransactionManagement;
