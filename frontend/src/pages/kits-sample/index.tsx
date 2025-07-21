import React from "react";
import { ButtonPrimarySolidLayout } from "@feature/kits/button/primary/solid";
import { ButtonPrimaryOutlineLayout } from "@feature/kits/button/primary/outline";
import { ButtonSecondarySolidLayout } from "@feature/kits/button/secondary/solid";
import { ButtonTransparentLayout } from "@feature/kits/button/transparent";
import { InputOutlineLayout } from "@feature/kits/input/outline";
import { CardInfoLayout } from "@feature/kits/card/info";
import { CardSecondaryLayout } from "@feature/kits/card/secondary";
import { CardPaperLayout } from "@feature/kits/card/paper";
import { StatusInfoLayout } from "@feature/kits/status/info";
import { StatusPaperLayout } from "@feature/kits/status/paper";
import { StatusSecondaryLayout } from "@feature/kits/status/secondary";
import { StatusSuccessLayout } from "@feature/kits/status/success";
import { StatusWarningLayout } from "@feature/kits/status/warning";
import { CardWhiteLayout } from "@feature/kits/card/white";
import { LabelCardLayout } from "@feature/kits/label-card";
import { CollapseSingleItemLayout } from "@feature/kits/collapse/single-item";
import { CollapseMultiItemSingleChoiceLayout } from "@feature/kits/collapse/multi-item/single-choice";
import { CollapseMultiItemMultiChoiceLayout } from "@feature/kits/collapse/multi-item/multi-choice";
import { ModalControllerLayout } from "@feature/kits/modal/controller";
import { FabInfoLayout } from "@feature/kits/fab/info";
import { FabPaperLayout } from "@feature/kits/fab/paper";
import { FabSecondaryLayout } from "@feature/kits/fab/secondary";
import { FabWhiteLayout } from "@feature/kits/fab/white";
import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { Menu } from "@kit/menu";
import { SearchableSelectLayout } from "@feature/kits/select/searchable";
import { SimpleSelectLayout } from "@feature/kits/select/simple";
import { SimpleSelectedItemSelectLayout } from "@feature/kits/select/simple-selected-item";
import { SimpleArrowSelectLayout } from "@feature/kits/select/simple-arrow";
import { ResettableSelectLayout } from "@feature/kits/select/resettable";
import { PersianCalendar } from "../../kits/calendar";
import { SwitchExamples } from "@feature/kits/switch";
import { MultipleSelectLayout } from "@feature/kits/select/multiple";
import { RadioExamples } from "@feature/kits/radio";
import { CheckboxLayout } from "@feature/kits/checkbox";
import { IconsList } from "@feature/kits/icons";

import { WeeklyCalendarLayout } from "@feature/kits/calendar";

const Kits = () => {
  return (
    <div className={"container flex flex-col gap-9 py-10"}>
      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>دکمه ها</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />

        <ButtonPrimarySolidLayout />
        <ButtonPrimaryOutlineLayout />
        <ButtonSecondarySolidLayout />
        <ButtonTransparentLayout />
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>منو ها</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <div className={"flex flex-col gap-2"}>
          <Menu holder={<Button>منو</Button>}>
            <Card
              className={"mt-1 flex w-fit flex-col p-2"}
              variant={"flat"}
              color={"paper"}
            >
              <Button variant={"text"} color={"info"}>
                <span>نمایش پروفایل</span>
              </Button>
              <Button variant={"text"} color={"error"}>
                <span>خروج</span>
              </Button>
            </Card>
          </Menu>
        </div>
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>سلکت ها</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <div className={"flex flex-col gap-2"}>
          <SearchableSelectLayout />
          <SimpleSelectLayout />
          <MultipleSelectLayout />
          <SimpleSelectedItemSelectLayout />
          <SimpleArrowSelectLayout />
          <ResettableSelectLayout />
        </div>
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>ورودی ها</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <InputOutlineLayout />

        <WeeklyCalendarLayout />
        <PersianCalendar onDateChange={(selected_date) => {}} />
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>کارت ها</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <CardInfoLayout />
        <CardSecondaryLayout />
        <CardPaperLayout />
        <CardWhiteLayout />
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>استاتوس ها</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <div className={"flex flex-row gap-2"}>
          <StatusInfoLayout />
          <StatusPaperLayout />
          <StatusSecondaryLayout />
          <StatusSuccessLayout />
          <StatusWarningLayout />
        </div>
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>لیبل کارت ها</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <div className={"flex flex-row gap-2"}>
          <LabelCardLayout />
        </div>
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>باز و بسته</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <div className={"flex flex-col gap-2"}>
          <p className={"text-sm"}>تک آیتم</p>
          <CollapseSingleItemLayout />
          <hr
            className={"border-0 border-b-[1px] border-b-background-paper-dark"}
          />
          <p className={"text-sm"}>چند آیتم یک انتخابی</p>
          <CollapseMultiItemSingleChoiceLayout />
          <hr
            className={"border-0 border-b-[1px] border-b-background-paper-dark"}
          />
          <p className={"text-sm"}>چند آیتم چند انتخابی</p>
          <CollapseMultiItemMultiChoiceLayout />
        </div>
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>مودال ها</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <div className={"flex flex-col gap-2"}>
          <ModalControllerLayout />
        </div>
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>اف ای بی ها</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <div className={"flex flex-col gap-2"}>
          <FabInfoLayout />
          <FabPaperLayout />
          <FabSecondaryLayout />
          <FabWhiteLayout />
        </div>
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>سوییچ</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <div className={"flex flex-col gap-2"}>
          <SwitchExamples />
        </div>
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>سوییچ</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <div className={"flex flex-col gap-2"}>
          <CheckboxLayout />
        </div>
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>سوییچ</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <div className={"flex flex-col gap-2"}>
          <RadioExamples />
        </div>
      </div>

      <div className={"flex flex-col gap-2"}>
        <h6 className={"text-2xl font-bold"}>آیکون‌ها</h6>
        <hr
          className={"border-0 border-b-[1px] border-b-background-paper-dark"}
        />
        <div className={"flex flex-col gap-2"}>
          <IconsList />
        </div>
      </div>
    </div>
  );
};

export default Kits;
