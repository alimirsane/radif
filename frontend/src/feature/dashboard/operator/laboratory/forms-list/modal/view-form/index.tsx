import { IcClose } from "@feature/kits/common/icons";
import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { useModalHandler } from "@utils/modal-handler/config";
import { FBLoader } from "@module/form-builder/loader";

const ViewForm = () => {
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get form details form modal
  const form = useModalHandler((state) => state.modalData);

  return (
    <Card
      color={"white"}
      className="2xl:w-[40vw] flex max-h-[100vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[70vw] lg:w-[60vw] xl:w-[50vw]"
    >
      <span className="mb-7 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">فرم {form.title}</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <Card variant="outline" className="px-4 py-7">
        <FBLoader jsonFB={form.json_init} submitFB={() => {}} />
      </Card>
    </Card>
  );
};
export default ViewForm;
