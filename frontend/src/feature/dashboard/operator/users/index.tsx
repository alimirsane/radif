import List from "./list";
import HeaderUserList from "./header-user-list";
import { Card } from "@kit/card";

const UserManagement = () => {
  return (
    <>
      <Card
        variant={"outline"}
        color={"white"}
        className="mt-10 px-3 py-8 sm:px-8"
      >
        <HeaderUserList />
        <List />
      </Card>
    </>
  );
};

export default UserManagement;
