import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import UserManagement from "@feature/dashboard/operator/users";

const Users = () => {
  return (
    <Container>
      <Header
        title="مشتریان سامانه"
        description="می‌توانید از این بخش لیست مشتریان را مشاهده کرده و دسترسی‌های مورد نظر خود را برای آنها تعریف نمایید."
      />
      <UserManagement />
    </Container>
  );
};

export default Users;
