import { IcTestTube } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";

export const Title = (props: { headerTitle: string }) => {
  return (
    <>
      <SvgIcon
        fillColor={"black"}
        className={
          "rounded-[8px] border border-background-paper-dark p-1 [&_svg]:h-[26px] [&_svg]:w-[26px]"
        }
      >
        <IcTestTube />
      </SvgIcon>
      <h3 className="grow px-2 text-[24px] font-[700]">{props.headerTitle}</h3>
    </>
  );
};
