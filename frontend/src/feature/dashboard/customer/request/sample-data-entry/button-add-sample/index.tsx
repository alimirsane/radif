import { SvgIcon } from "@kit/svg-icon"
import { IcPlus } from "@feature/kits/common/icons"
import { AddSampleType } from "./type"

const AddSample = (props:AddSampleType) => {
  const { click } = props
  return (
    <div className="h-full w-full bg-common-white rounded-[8px] min-h-[108px] flex justify-center items-center gap-[8px] cursor-pointer" onClick={click}>
        <SvgIcon
            fillColor={"primary"}
            className={"[&_svg]:h-[18px] [&_svg]:w-[18px]"}
        >
            <IcPlus/>
        </SvgIcon>
        <span className=" text-typography-main text-[16px] font-bold">ثبت نمونه جدید</span>
    </div>
  )
}

export default AddSample