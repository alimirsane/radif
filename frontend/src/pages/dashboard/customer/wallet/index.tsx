import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import Wallet from "@feature/dashboard/customer/wallet";

const Index = () => {
  return (
    <Container>
      <Header
        title="مدیریت کیف پول"
        description="کاربر گرامی شما می‌توانید کیف پول خود را در این قسمت مدیریت کنید."
      />
      <div className="mt-8 md:mt-[55px]">
        <Wallet />
      </div>
    </Container>
  );
};

export default Index;
