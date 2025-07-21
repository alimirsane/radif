import { useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { IcClose } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { Card } from "@kit/card";
import AddUserForm from "../../add-user-form";

const AddUser = () => {
  const hideModal = useModalHandler((state) => state.hideModal);

  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] min-h-[95vh] w-full flex-col overflow-y-auto px-8 py-4 md:max-h-[80vh] md:w-[80vw] md:pb-10 md:pt-8 lg:w-[60vw]"
    >
      <div className="mb-3 flex flex-row items-center justify-between md:mb-5">
        <h6 className="text-[22px] font-[700]">ایجاد همکار</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <AddUserForm />
    </Card>
  );
};

export default AddUser;
