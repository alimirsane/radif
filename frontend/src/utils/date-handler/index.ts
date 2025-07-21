import { DateTimeFormatOptions } from "@utils/date-handler/type";

export class DateHandler {
  static formatDate = (
    date: string | number | undefined,
    options?: DateTimeFormatOptions,
  ) => {
    if (!date) date = Date.now()
    {
      return new Intl.DateTimeFormat(
        "fa-IR",
        options ?? {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      ).format(new Date(date));
    }
  };
}
