import Payment from "@feature/dashboard/customer/payment";
import Header from "@feature/dashboard/common/header";
import Container from "@feature/dashboard/common/container";
import { usePayOrder } from "@hook/pay-order";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { routes } from "@data/routes";

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
          title="پرداخت هزینه "
          description="کاربر گرامی شما می توانید برای پرداخت هزینه درخواست خود، از طریق زیر اقدام کنید."
        />
      </Container>
      <Payment />
    </>
  );
};

export default Index;
