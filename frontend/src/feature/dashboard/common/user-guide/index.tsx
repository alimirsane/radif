import { IcInfo } from "@feature/kits/common/icons";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import Tooltip from "@kit/tooltip";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

export const UserGuide = () => {
  const openModal = useModalHandler((state) => state.openModal);

  return (
    <>
      <div
        id="requests-user-guide"
        className="fixed bottom-8 left-8 z-50"
        onClick={() => {
          openModal(ModalKeys.REQUESTS_LIST_USER_GUIDE);
        }}
      >
        <Tooltip message="راهنما">
          <Fab color="info" className="p-2">
            <SvgIcon
              className="[&_svg]:h-[30px] [&_svg]:w-[30px]"
              fillColor="white"
            >
              <IcInfo />
            </SvgIcon>
          </Fab>
        </Tooltip>
      </div>
    </>
  );
};
