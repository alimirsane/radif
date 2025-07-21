import { SvgIcon } from "@kit/svg-icon";
import {
  IcAddDocument,
  IcArrowLeft,
  IcArrowRight,
  IcCard,
  IcCheck,
  IcChevronDown,
  IcClose,
  IcCloseCircle,
  IcConfig,
  IcDelete,
  IcDocument,
  IcEdit,
  IcEye,
  IcEyeSlash,
  IcMenu,
  IcNotAllowed,
  IcPlus,
  IcPrint,
  IcSave,
  IcTelephoneForward,
  IcTestTube,
  IcUploade,
  IcUser,
  Icon,
} from "../common/icons";

export const IconsList = () => {
  return (
    <div className="flex flex-row gap-4">
      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <Icon />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcCheck />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcNotAllowed />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcPrint />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcTelephoneForward />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcUploade />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcArrowLeft />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcArrowRight />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcPlus />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcChevronDown />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcClose />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcCloseCircle />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcTestTube />
      </SvgIcon>

      <SvgIcon
        strokeColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcCard />
      </SvgIcon>

      <SvgIcon
        strokeColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcMenu />
      </SvgIcon>

      <SvgIcon
        strokeColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcUser />
      </SvgIcon>

      <SvgIcon
        strokeColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcEye />
      </SvgIcon>

      <SvgIcon
        strokeColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcEyeSlash />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcAddDocument />
      </SvgIcon>

      <SvgIcon
        strokeColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcDocument />
      </SvgIcon>

      <SvgIcon
        strokeColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcEdit />
      </SvgIcon>

      <SvgIcon
        strokeColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcConfig />
      </SvgIcon>

      <SvgIcon
        strokeColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcSave />
      </SvgIcon>

      <SvgIcon
        fillColor={"primary"}
        className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
      >
        <IcDelete />
      </SvgIcon>
    </div>
  );
};
