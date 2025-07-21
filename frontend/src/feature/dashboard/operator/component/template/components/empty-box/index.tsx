import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { Icon } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { AccessLevel } from "@feature/dashboard/common/access-level";

const EmptyBox = () => {
  return (
    <div className="flex w-full flex-col items-center gap-[24px]">
      <Card
        color="info"
        className="flex w-full  items-center justify-center p-10"
      >
        <p>یک درخواست را برای بررسی انتخاب کنید.</p>
      </Card>
      {/* <AccessLevel module={"request"} permission={["create"]}>
        <Button
          variant="solid"
          color="primary"
          startIcon={
            <SvgIcon
              fillColor={"paper"}
              className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
            >
              <Icon />
            </SvgIcon>
          }
        >
          ثبت درخواست جدید
        </Button>
      </AccessLevel> */}
    </div>
  );
};

export default EmptyBox;
