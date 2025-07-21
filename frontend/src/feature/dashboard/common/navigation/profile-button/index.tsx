import { Card } from "@kit/card";
import { IcUser } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import Link from "next/link";
import { Menu } from "@kit/menu";
import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import { deletedCookie } from "@utils/cookie-handler";
import Router, { useRouter } from "next/router";
import { routes } from "@data/routes";
import { UserType } from "@api/service/user/type/user-type";

const ProfileButton = () => {
  const { data: user } = useQuery({
    ...apiUser().me(),
  });

  const router = useRouter();
  return (
    <Menu
      holder={
        <Card
          color={"white"}
          className={
            "flex cursor-pointer items-center gap-[10px] px-[16px] py-[12px] lg:min-w-[220px]"
          }
        >
          <div className="relative flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-secondary/15">
            <SvgIcon className={"[&_svg]:h-[18px] [&_svg]:w-[18px]"}>
              <IcUser />
            </SvgIcon>
            {/* <div className=" absolute right-[-4px] top-[-4px] h-[8px] w-[8px] rounded-full bg-error outline outline-[4px] outline-background-default"></div> */}
          </div>
          <span className="hidden text-[16px] font-bold lg:block">
            {(user?.data?.first_name ?? "") +
              " " +
              (user?.data.last_name ?? "")}
            <span className="mr-1 text-[12px] font-medium text-common-gray">
              {/* ({router.route.includes(routes.operator()) ? "همکار" : "مشتری"}) */}
              ({user?.data?.role_obj.map((role) => role.name).join(" - ")})
            </span>
          </span>
        </Card>
      }
    >
      <Card
        color={"white"}
        className={"left-0 w-[200px] p-[16px] shadow-lg lg:w-full"}
      >
        {/* <div className="mb-[12px]">
          <Link
            href={
              router.route.includes(routes.operator())
                ? routes.operator()
                : routes.customer()
            }
            className="text-[16px] text-typography-main"
          >
            میز کار
          </Link>
        </div> */}
        <div className="pb-3 text-[16px] font-bold lg:hidden">
          {(user?.data?.first_name ?? "") + " " + (user?.data.last_name ?? "")}
        </div>
        {user?.data.user_type === UserType.STAFF && (
          <div className="mb-[12px]">
            <div className="flex rounded-[8px] bg-background-paper px-2 py-2 text-[16px] text-typography-main">
              <Link
                href={routes.operator()}
                className={`flex-1 rounded-[6px] py-2 text-center ${router.route.includes(routes.operator()) ? "bg-primary text-common-white" : ""}`}
              >
                <span>همکار</span>
              </Link>
              <Link
                href={routes.customer()}
                className={`flex-1 rounded-[6px] py-2 text-center ${router.route.includes(routes.customer()) ? "bg-primary text-common-white" : ""}`}
              >
                <span>مشتری</span>
              </Link>
            </div>
          </div>
        )}
        <div className="my-[12px]">
          {/*<Link*/}
          {/*    href={*/}
          {/*      user?.data.user_type === UserType.STAFF*/}
          {/*        ? routes.operatorMessages()*/}
          {/*        : routes.customerMessages()*/}
          {/*    }*/}
          {/*    className="relative mb-[12px] flex items-center justify-between rounded-[8px] bg-error/5 px-[12px] py-[12px] text-[16px] text-typography-main"*/}
          {/*  >*/}
          {/*    <span>پیام ها</span>*/}
          {/*    /!*<span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-error/10 text-error">*!/*/}
          {/*    /!*  5*!/*/}
          {/*    /!*</span>*!/*/}
          {/*    <div className=" absolute right-[-4px] top-[-4px] h-[8px] w-[8px] rounded-full bg-error outline outline-[4px] outline-background-default"></div>*/}
          {/*  </Link>*/}
          {/*<Button className="relative  mb-[12px] flex w-full items-center justify-between rounded-[8px] bg-error/5 px-[12px] py-[12px] text-[16px] text-typography-main">*/}
          {/*   <span className="text-common-black">پیام ها</span>*/}
          {/*   <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-error/10 text-error">*/}
          {/*     5*/}
          {/*   </span>*/}
          {/*   <div className=" absolute right-[-4px] top-[-4px] h-[8px] w-[8px] rounded-full bg-error outline outline-[4px] outline-background-default"></div>*/}
          {/* </Button>*/}
        </div>
        {/* {router.route.includes(routes.customer()) && ( */}
        <div className="my-[12px]">
          <Link
            href={
              router.route.includes(routes.customer())
                ? routes.customerProfile()
                : routes.operatorProfile()
            }
            className="text-[16px] text-typography-main"
          >
            حساب کاربری
          </Link>
        </div>
        {/* )} */}
        <div>
          <div
            onClick={() => {
              deletedCookie("token");
              Router.push(routes.signIn());
              // if (typeof window !== "undefined" && window.Raychat?.unloadUser) {
              //   window.Raychat.unloadUser();
              //   setTimeout(() => {
              //     location.reload();
              //   }, 500);
              // }
            }}
            className="cursor-pointer text-[16px] text-error"
          >
            خروج از حساب
          </div>
        </div>
      </Card>
    </Menu>
  );
};

export default ProfileButton;

{
  /* <Card color={"white"} className={"py-[12px] px-[16px] gap-[10px] flex items-center lg:min-w-[220px] cursor-pointer"}>
      <div className='w-[32px] h-[32px] bg-secondary/15 flex justify-center items-center rounded-[4px] relative'>
          <SvgIcon
              className={"[&_svg]:h-[18px] [&_svg]:w-[18px]"}
          >
              <IcUser/>
          </SvgIcon>
          <div className=' outline outline-background-default rounded-full w-[8px] h-[8px] bg-error outline-[4px] absolute top-[-4px] right-[-4px]'></div>
      </div>
      <span className='text-[16px] font-bold hidden lg:block'>حسین احمدلو</span>
      </Card> */
}

{
  /* <Card color={"white"} className={"w-full shadow-lg p-[16px]"}>
      <div>
          <Link href="/" className="text-[16px] text-typography-main">حساب کاربری</Link>
      </div>
      <div className="my-[12px]">
          <Link href="/" className="text-[16px] text-typography-main mb-[12px] px-[12px] py-[12px] rounded-[8px] bg-error/5 flex justify-between items-center relative">
              <span>پیام ها</span>
              <span className="w-[34px] h-[34px] rounded-full bg-error/10 flex justify-center items-center text-error">5</span>
              <div className=' outline outline-background-default rounded-full w-[8px] h-[8px] bg-error outline-[4px] absolute top-[-4px] right-[-4px]'></div>
          </Link>
      </div>
      <div>
          <Link href="/" className="text-[16px] text-error">خروج از حساب</Link>
      </div>
      </Card> */
}
