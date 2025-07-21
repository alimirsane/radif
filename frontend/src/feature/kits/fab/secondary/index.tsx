import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { Icon } from "@feature/kits/common/icons";

export const FabSecondaryLayout = () => {
  return (
    <Fab color="secondary" className="p-[10px]">
      <SvgIcon fillColor={"white"}>
        <Icon />
      </SvgIcon>
    </Fab>
  );
};
