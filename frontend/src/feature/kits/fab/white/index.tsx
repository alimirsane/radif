import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { Icon } from "@feature/kits/common/icons";

export const FabWhiteLayout = () => {
  return (
    <Fab className="p-2">
      <SvgIcon fillColor={"white"}>
        <Icon />
      </SvgIcon>
    </Fab>
  );
};
