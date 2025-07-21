import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import ISO from "@feature/dashboard/operator/iso";

const index = () => {
  return (
    <Container>
      <Header
        title="وضعیت استاندارد آزمایشگاه‌ها"
        description="کاربر گرامی شما می توانید وضعیت استاندارد آزمایشگاه‌ها را مدیریت کنید."
      />
      <ISO />
    </Container>
  );
};

export default index;
