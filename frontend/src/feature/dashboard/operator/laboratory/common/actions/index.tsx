import { SvgIcon } from "@kit/svg-icon";
import {
  IcEdit,
  IcEye,
  IcDelete,
  IcConfig,
  IcDocument,
} from "@feature/kits/common/icons";
import Tooltip from "@kit/tooltip";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { DeviceType } from "@api/service/device/type";
import { ExperimentType } from "@api/service/experiment/type";
import { LaboratoryType } from "@api/service/laboratory/type";
import { ParameterType } from "@api/service/parameter/type";
import { FormType } from "@api/service/form/type";

interface ActionsType {
  item: DeviceType | ExperimentType | LaboratoryType | ParameterType | FormType;
  actionsList: {
    view?: ModalKeys;
    edit?: ModalKeys;
    delete?: ModalKeys;
  };
}

const Actions = ({ item, actionsList }: ActionsType) => {
  const openModal = useModalHandler((state) => state.openModal);
  const handleOpenModal = (modalKey: ModalKeys) => () => {
    openModal(modalKey, item);
  };

  return (
    <>

      {/* <Tooltip message="دستگاه‌ها">
        <SvgIcon
          onClick={() => {
          }}
          strokeColor={"primary"}
          className={"cursor-pointer [&_svg]:h-[24px] [&_svg]:w-[24px]"}
        >
          <IcConfig />
        </SvgIcon>
      </Tooltip>

      <Tooltip message="ساخت فرم ساز و فرم">
        <SvgIcon
          onClick={() => {
          }}
          strokeColor={"primary"}
          className={"cursor-pointer [&_svg]:h-[24px] [&_svg]:w-[24px]"}
        >
          <IcDocument />
        </SvgIcon>
      </Tooltip> */}
    </>
  );
};

