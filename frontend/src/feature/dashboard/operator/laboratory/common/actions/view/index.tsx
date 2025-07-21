import Tooltip from "@kit/tooltip";
import { SvgIcon } from "@kit/svg-icon";
import { IcEye } from "@feature/kits/common/icons";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { DeviceType } from "@api/service/device/type";
import { ExperimentType } from "@api/service/experiment/type";
import { LaboratoryType } from "@api/service/laboratory/type";
import { ParameterType } from "@api/service/parameter/type";
import { FormType } from "@api/service/form/type";

interface ActionViewProps {
  item: DeviceType | ExperimentType | LaboratoryType | ParameterType | FormType;
  modalKey: ModalKeys
}

export const ActionView = (props: ActionViewProps) => {
  const {item, modalKey} = props

  const openModal = useModalHandler((state) => state.openModal);
  const handleOpenModal = (modalKey: ModalKeys) => () => {
    openModal(modalKey, item);
  };

  return (
    <Tooltip message="مشاهده">
      <SvgIcon
        onClick={handleOpenModal(modalKey)}
        strokeColor={"primary"}
        className={"cursor-pointer [&_svg]:h-[26px] [&_svg]:w-[26px]"}
      >
        <IcEye />
      </SvgIcon>
    </Tooltip>
  )
}