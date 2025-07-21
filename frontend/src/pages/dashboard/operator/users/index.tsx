import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import UserManagement from "@feature/dashboard/operator/users";

const Users = () => {
  return (
    <Container>
      <Header
        title="کاربران همکار"
        description="می‌توانید از این بخش لیست همکاران را مشاهده کرده و دسترسی‌های مورد نظر خود را برای آنها تعریف کنید و یا همکار جدیدی اضافه نمایید."
      />
      <UserManagement />
    </Container>
  );
};

export default Users;
