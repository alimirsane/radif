import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import Laboratory from "@feature/dashboard/operator/laboratory";
import NewLaboratory from "@feature/dashboard/operator/laboratory/laboratory-management";

const LaboratoryManagement = () => {
  return (
    <Container>
      <Header
        title="مدیریت آزمایشگاه‌ها"
        description="می‌توانید از این بخش آزمایشگاه‌های خود را مدیریت کنید."
      />
      <NewLaboratory />
      {/* <Laboratory /> */}
    </Container>
  );
};

export default LaboratoryManagement;
