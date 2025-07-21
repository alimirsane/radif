import {
  IcCircle,
  IcClose,
  IcDashSquare,
  IcPlus,
  IcSquare,
} from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { Fab } from "@kit/fab";
import { Input } from "@kit/input";
import { SvgIcon } from "@kit/svg-icon";

type OptionItem =
  | { label: string; value: string | undefined }
  | ({ value: string; label: string } | undefined);
interface OptionsFormProps {
  newOption: string;
  setNewOption: (value: string) => void;
  handleAddOption: () => void;
  options: OptionItem[];
  iconName: "square" | "circle" | "dash-square";
  handleDeleteOption: (index: number) => void;
}

const OptionsForm = ({
  newOption,
  setNewOption,
  handleAddOption,
  options,
  iconName,
  handleDeleteOption,
}: OptionsFormProps) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "square":
        return <IcSquare />;
      case "dash-square":
        return <IcDashSquare />;
      case "circle":
        return <IcCircle />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col items-end gap-4 md:flex-row md:px-[100px]">
        <div className="w-full md:w-2/5">
          <Input
            placeholder="مثلا: جامد یا مایع یا ..."
            label="عنوان گزینه"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
          />
        </div>
        <div>
          <Button
            variant="outline"
            color="info"
            className="text-info"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleAddOption();
            }}
            startIcon={
              <SvgIcon
                strokeColor={"info"}
                className={"[&_svg]:h-[14px] [&_svg]:w-[14px]"}
              >
                <IcPlus />
              </SvgIcon>
            }
          >
            اضافه کردن گزینه
          </Button>
        </div>
      </div>
      <div className="mt-8 flex flex-row overflow-auto pb-4 gap-3 text-[14px] md:flex-row md:gap-12 md:px-[100px]">
        {options.map((option: OptionItem, index: number) => (
          <div key={index} className="flex flex-row items-center">
            <SvgIcon
              fillColor={"black"}
              className={"ml-1 [&_svg]:h-[16px] [&_svg]:w-[16px]"}
            >
              {renderIcon(iconName)}
            </SvgIcon>
            {option?.label}
            <Fab
              className="mr-3 bg-typography-secondary bg-opacity-40 p-1"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleDeleteOption(index);
              }}
            >
              <SvgIcon
                fillColor={"black"}
                className={"[&_svg]:h-[10px] [&_svg]:w-[10px]"}
              >
                <IcClose />
              </SvgIcon>
            </Fab>
          </div>
        ))}
      </div>
    </>
  );
};
export default OptionsForm;
