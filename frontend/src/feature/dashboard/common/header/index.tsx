
import { HeaderType } from "./type";


const Header = (props: HeaderType) => {
  const { title, description } = props;
  
  return (
    <header className="flex flex-col gap-[4px] text-typography-main">
      <h1 className=" text-[24px] font-bold">{title}</h1>
      <p>{description}</p>
    </header>
  );
};

export default Header;
