import Container from "@feature/dashboard/common/container";
import Filter from "./components/filter";
import List from "./components/list";

import { Card } from "@kit/card";

const ListRequests = () => {
  return (
    <Container>
      <Card
        color={"white"}
        variant={"outline"}
        className="border-[0px]  p-0 md:border-[1px] md:border-background-paper-dark md:p-[32px]"
      >
        <Filter />
        <List />
      </Card>
    </Container>
  );
};

export default ListRequests;
