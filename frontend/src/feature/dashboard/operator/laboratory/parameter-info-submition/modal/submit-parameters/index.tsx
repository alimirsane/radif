import { useRouter } from "next/router";

import { IcCheck, IcClose } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { useModalHandler } from "@utils/modal-handler/config";
import { Fab } from "@kit/fab";
import { StepType } from "../../../laboratory-steps/type";

const SubmitParameters = () => {
  const router = useRouter();
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  const submitModal = () => {
    // navigate to next step
    router.query.step = StepType.PARAMETER;
    router.push(router);
    // close modal
    hideModal();
  };
  return (
    <Card color={"paper"} className="w-[85vw] p-6 md:w-[50vw]">
      <div className="text-[14px]">
        <span className="flex flex-row items-center justify-between md:mb-5">
          <h6 className="text-[20px] font-[700]">ثبت پارامترها</h6>

          <Fab
            className="bg-error-light bg-opacity-60 p-1"
            onClick={hideModal}
          >
            <SvgIcon fillColor={"black"}>
              <IcClose />
            </SvgIcon>
          </Fab>
        </span>
        <Card color="info" className="w-full p-7 text-center">
          <p>فرایند ثبت پارامترها با موفقیت انجام شد.</p>
        </Card>
        <h6 className="my-5">
          آزمون شما نیاز به طراحی فرم دارد. لطفا فرم را با استفاده از فرم ساز
          بسازید.
        </h6>
      </div>
      <div className="flex justify-center">
        <Button
          variant="solid"
          color="primary"
          className="w-full sm:w-auto"
          onClick={submitModal}
          startIcon={
            <SvgIcon
              fillColor={"white"}
              className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
            >
              <IcCheck />
            </SvgIcon>
          }
        >
          ساخت فرم آزمون
        </Button>
      </div>
    </Card>
  );
};
export default SubmitParameters;
