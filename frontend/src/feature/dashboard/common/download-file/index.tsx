import { IcClose, IcDownload } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { PersianCalendar } from "@kit/calendar";
import { SvgIcon } from "@kit/svg-icon";
import { DateHandler } from "@utils/date-handler";
import { FormHandler } from "@utils/form-handler";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

interface DownloderProps {
  title: string;
  onDownload: () => void;
  onReset: () => void;
}

export const Downloder = (props: DownloderProps) => {
  const router = useRouter();
  const { title, onDownload, onReset } = props;
  // Set filters in URL
  const setRouterQuery = (type: string, date: string) => {
    if (date) {
      router.query[type] = date;
      delete router.query.page;
      router.push(router);
    }
  };
  // Key state for remounting the form
  const [formKey, setFormKey] = useState(0);
  const resetDates = () => {
    onReset();
    // Remove date filters from URL
    delete router.query.start_date;
    delete router.query.end_date;
    delete router.query.page;
    router.push(router);
    // Change form key to remount the FormHandler component
    setFormKey((prevKey) => prevKey + 1);
  };

  return (
    <FormHandler
      key={formKey}
      initialValues={{ start_date: "", end_date: "" }}
      handleSubmit={(values, utils) => {
        if (
          new Date(values.end_date).setHours(0, 0, 0, 0) <
          new Date(values.start_date).setHours(0, 0, 0, 0)
        ) {
          toast.error("تاریخ شروع باید قبل از تاریخ پایان باشد");
          return;
        }
        onDownload();
      }}
    >
      {(formik) => (
        <span className="flex flex-col items-end gap-4 md:flex-row">
          <span className="w-full md:w-[26%]">
            <PersianCalendar
              name={"start_date"}
              // autoComplete={"start_date"}
              placeholder="تاریخ شروع را انتخاب کنید"
              formik={formik}
              calendarOptions={{
                maxDate: Date.now(),
              }}
              label="از تاریخ"
              onDateChange={(e) => {
                if (!e) return;
                setRouterQuery("start_date", new Date(e)?.toISOString());
              }}
            />
          </span>
          <span className="w-full md:w-[26%]">
            <PersianCalendar
              name={"end_date"}
              // autoComplete={"end_date"}
              placeholder="تاریخ پایان را انتخاب کنید"
              formik={formik}
              calendarOptions={{
                minDate: new Date(formik.values.start_date).setHours(
                  0,
                  0,
                  0,
                  0,
                ),
                maxDate: Date.now(),
              }}
              label="تا تاریخ"
              onDateChange={(e) => {
                if (!e) return;
                setRouterQuery("end_date", new Date(e)?.toISOString());
              }}
            />
          </span>
          <span className="flex w-full flex-grow flex-col gap-4 pb-[1px] md:w-[48%] md:flex-row">
            <Button
              variant="outline"
              color="primary"
              className="mx-auto w-full py-[9px] md:mx-0"
              onClick={resetDates}
              startIcon={
                <SvgIcon strokeColor={"primary"}>
                  <IcClose />
                </SvgIcon>
              }
            >
              حذف فیلترها
            </Button>
            <Button
              variant="solid"
              color="primary"
              type="submit"
              className="mx-auto w-full whitespace-nowrap py-[9px] md:mx-0"
              startIcon={
                <SvgIcon strokeColor={"white"}>
                  <IcDownload />
                </SvgIcon>
              }
            >
              {title}
            </Button>
          </span>
        </span>
      )}
    </FormHandler>
  );
};
