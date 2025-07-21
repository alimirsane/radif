import { Card } from "@kit/card";
import Tabs from "./tab";
import List from "./list";

const Messages = () => {
  const messages: [] = [];
  return messages.length ? (
    <Card color={"white"} className={"mt-[32px] p-[24px]"}>
      <Tabs />
      <List />
    </Card>
  ) : (
    <Card
      color={"info"}
      className="mx-auto mt-[24px] w-[80%] rounded-[8px] p-[22px] text-center text-[14px]"
    >
      پیامی یافت نشد.
    </Card>
  );
};

export default Messages;
