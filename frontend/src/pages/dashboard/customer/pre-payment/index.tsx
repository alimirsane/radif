import { useEffect } from "react";
import { routes } from "@data/routes";
import { useRouter } from "next/router";
import { usePayOrder } from "@hook/pay-order";
import Header from "@feature/dashboard/common/header";
import Container from "@feature/dashboard/common/container";
import PrePayment from "@feature/dashboard/customer/pre-payment";

const Index = () => {
  const router = useRouter();
  const price = usePayOrder((state) => state.price);

  useEffect(() => {
    if (price) return;
    router.push(routes.customerRequestsList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  return (
    <>
      <Container>
        <Header
          title="پیش پرداخت"
          description="کاربر گرامی شما می توانید برای پرداخت هزینه پیش پرداخت درخواست خود، از طریق زیر اقدام کنید."
        />
      </Container>
      <PrePayment />
    </>
  );
};

export default Index;
