import { LabelCard } from "@kit/label-card";

export const LabelCardLayout = () => {
  return (
    <div className={"flex flex-row gap-3"}>
      <LabelCard>
        <span className={"text-[13px] font-extrabold"}>تست</span>
      </LabelCard>
      <LabelCard active>
        <span className={"text-[13px] font-extrabold"}>تست</span>
      </LabelCard>
    </div>
  );
};
