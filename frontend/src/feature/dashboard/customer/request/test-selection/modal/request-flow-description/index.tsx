import { IcArrowLeft, IcCircleFill, IcClose } from "@feature/kits/common/icons";
import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { useRouter } from "next/router";
import { useModalHandler } from "@utils/modal-handler/config";

export const RequestFlowDescription = () => {
  const router = useRouter();
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);

  // get modal data
  const modalData = useModalHandler((state) => state.modalData);

  // close modal
  const handleClick = () => {
    router.query.lab = modalData.labId;
    router.push(router);
    hideModal();
  };

  return (
    <Card
      color={"paper"}
      className="flex max-h-[95vh] w-[95vw] flex-col overflow-y-auto px-7 pb-6 pt-4 md:max-h-[80vh] md:w-[40vw] md:pb-8 md:pt-6"
    >
      <div className="mb-2 flex flex-row items-center justify-between md:mb-4">
        <h6 className="text-[22px] font-[700]">فرایند ثبت درخواست</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <Card
        color="info"
        className="mt-2 flex flex-col justify-center gap-4 border border-background-paper-dark px-6 pb-6 pt-6 leading-8 md:pt-8"
      >
        <p className="font-medium text-error">
          جهت ایجاد درخواست به نکات زیر توجه فرمایید:
        </p>
        <p className="flex flex-row items-baseline gap-2 text-[15px]">
          <SvgIcon
            fillColor={"black"}
            className={"opacity-70 [&_svg]:h-[8px] [&_svg]:w-[8px]"}
          >
            <IcCircleFill />
          </SvgIcon>
          فرایند ساخت درخواست دارای 6 قدم می‌باشد. جهت ثبت نهایی درخواست و بررسی
          توسط اپراتور، انجام همه مراحل الزامیست.
        </p>
        <p className="flex flex-row items-baseline gap-2 text-[15px]">
          <SvgIcon
            fillColor={"black"}
            className={"opacity-70 [&_svg]:h-[8px] [&_svg]:w-[8px]"}
          >
            <IcCircleFill />
          </SvgIcon>
          در قدم 6، حتما دکمه &quot;ثبت نهایی درخواست&quot; را کلیک کنید، در غیر
          این صورت، درخواست شما تکمیل نمی‌شود.
        </p>
        <p className="flex flex-row items-baseline gap-2 text-[15px]">
          <SvgIcon
            fillColor={"black"}
            className={"opacity-70 [&_svg]:h-[8px] [&_svg]:w-[8px]"}
          >
            <IcCircleFill />
          </SvgIcon>
          اگر به هر دلیلی موفق به تکمیل درخواست خود نشدید، می‌توانید از صفحه
          &quot;درخواست‌های ثبت شده&quot; نسبت به ویرایش و تکمیل درخواست خود
          اقدام نمایید.
        </p>
        <p className="flex flex-row items-baseline gap-2 text-[15px]">
          <SvgIcon
            fillColor={"black"}
            className={"opacity-70 [&_svg]:h-[8px] [&_svg]:w-[8px]"}
          >
            <IcCircleFill />
          </SvgIcon>
          در صورتیکه درخواست خود را تکمیل نفرمایید، پس از 48 ساعت درخواست شما به
          صورت خودکار لغو می‌گردد.
        </p>
        <Button
          className="mr-auto mt-4"
          onClick={handleClick}
          endIcon={
            <SvgIcon
              strokeColor={"white"}
              className={"[&_svg]:h-[10px] [&_svg]:w-[10px]"}
            >
              <IcArrowLeft />
            </SvgIcon>
          }
        >
          متوجه شدم
        </Button>
      </Card>
    </Card>
  );
};
