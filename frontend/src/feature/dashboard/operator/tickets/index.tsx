import { Card } from "@kit/card";
import Tabs from "./tabs";
import Message from "./message";
import { TicketType } from "./type";

const Tickets = () => {
  const messages: TicketType[] = [];
  return messages.length ? (
    <Card
      className="mt-[40px] rounded-[8px] px-[24px] py-[16px]"
      color={"white"}
    >
      <Tabs />
      {messages.map((message, index) => (
        <Message
          title={message.title}
          date={message.date}
          message={message.message}
          key={index}
        />
      ))}
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

export default Tickets;
