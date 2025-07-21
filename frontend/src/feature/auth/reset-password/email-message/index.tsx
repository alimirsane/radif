import { Button } from "@kit/button";
import { Card } from "@kit/card";

export const EmailMessage = () => {
  return (
    <>
      <div className="pb-4 lg:px-12">
        <Card color="info" className="mt-4 flex flex-col items-center p-6">
          <div className="pt-1 text-[14px] leading-7 md:w-4/5 lg:w-1/2">
            <p>
              به ایمیل شما پیامی حاوی لینک تغییر رمز ارسال‌ شده ‌است. لطفا ایمیل
              خود را بررسی کنید.
            </p>
            <p className="my-6">
              ایمیل وارد شده :{" "}
              <span className="font-bold">(hossain.ahmadloo@gmail.com)</span>
            </p>
            <p>
              توجه نمایید، ممکن است ایمیل ارسالی وارد پوشه‌های دیگری مانند
              (spam, social, promotion) شده ‌باشد.
            </p>
          </div>

          <div className="flex flex-row items-center pt-5">
            <p className="text-[14px]">ایمیل را دریافت نکردید؟</p>

            <Button
              variant="text"
              className="text-info underline underline-offset-8 "
            >
              ارسال مجدد
            </Button>
          </div>
        </Card>
        {/* <Card color="error" className="mt-4 flex flex-col items-center p-6">
          <p className="pt-1 text-[14px] leading-7 md:w-4/5 lg:w-1/2">
            کاربر گرامی این لینک دیگر اعتبار ندارد زیرا انجام عملیات شما زمان
            زیادی طو‌ل کشیده‌ است و یا قبلا این لینک را باز کرده‌اید. لطفا برای
            بازیابی رمز عبور خود را دوباره تلاش کنید. 
          </p>
        </Card> */}
      </div>
    </>
  );
};
