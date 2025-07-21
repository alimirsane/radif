import Tooltip from "@kit/tooltip";
import { SvgIcon } from "@kit/svg-icon";
import { IcEdit, IcEye } from "@feature/kits/common/icons";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { DeviceType } from "@api/service/device/type";
import { ExperimentType } from "@api/service/experiment/type";
import { LaboratoryType } from "@api/service/laboratory/type";
import { ParameterType } from "@api/service/parameter/type";
import { FormType } from "@api/service/form/type";

interface ActionEditProps {
  item: DeviceType | ExperimentType | LaboratoryType | ParameterType | FormType;
  modalKey: ModalKeys
}

export const ActionEdit = (props: ActionEditProps) => {
  const {item, modalKey} = props

  const openModal = useModalHandler((state) => state.openModal);
  const handleOpenModal = (modalKey: ModalKeys) => () => {
    openModal(modalKey, item);
  };

  return (
    <Tooltip message="ویرایش">
      <SvgIcon
        onClick={handleOpenModal(modalKey)}
        strokeColor={"primary"}
        className={"cursor-pointer [&_svg]:h-[30px] [&_svg]:w-[30px]"}
      >
        <IcEdit />
      </SvgIcon>
    </Tooltip>
  )
}