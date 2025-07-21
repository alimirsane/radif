import React from "react";

const Header = () => {
  return (
    <div id="print-hidden" className="flex flex-col gap-[4px]">
      {/* <h2 className=" text-[18px] font-semibold text-typography-main">
        لیست درخواست‌ها
      </h2> */}
      <p className="text-[14px] text-typography-main">
        تمامی درخواست‌هایی که برای شما ارسال شده است را می‌توانید در قسمت زیر
        مشاهده کنید.
      </p>
    </div>
  );
};

export default Header;
