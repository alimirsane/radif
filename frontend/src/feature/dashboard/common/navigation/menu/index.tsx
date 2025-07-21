import NavLink from "../nav-link";
import { IcMenu } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { MenuType } from "./type";
import Image from "next/image";
import logo from "/public/images/logo.png";
import { NavItems } from "@feature/dashboard/common/navigation/items";
import Link from "next/link";
import { useRouter } from "next/router";
import { routes } from "@data/routes";

const Menu = (props: MenuType) => {
  const { setOpenDrawer } = props;

  const router = useRouter();

  return (
    <>
      <div className=" flex items-center gap-[24px] lg:hidden">
        <Link
          href={
            router.asPath.includes(routes.operator())
              ? routes.operator()
              : routes.customer()
          }
        >
          <div className={"flex flex-col items-center justify-center"}>
            <div className={"flex h-fit w-fit rounded-[50%] bg-primary-dark"}>
              <Image
                src={logo}
                width={400}
                height={400}
                className="w-[52px]"
                alt="دانشگاه شریف"
              />
            </div>
            <p className={"flex flex-col text-[5px] font-bold"}>
              <span>معاونت پژوهش و فناوری</span>
              <span>مرکز خدمات آزمایشگاهی</span>
            </p>
          </div>
        </Link>
        <SvgIcon
          strokeColor={"primary"}
          className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
          onClick={setOpenDrawer}
        >
          <IcMenu />
        </SvgIcon>
      </div>
      <div className="hidden items-center gap-[48px] lg:flex">
        <Link
          href={
            router.asPath.includes(routes.operator())
              ? routes.operator()
              : routes.customer()
          }
        >
          <div className={"flex flex-row items-center justify-center gap-3"}>
            <div className={"flex h-fit w-fit rounded-[50%] bg-primary-dark"}>
              <Image
                src={logo}
                width={400}
                height={400}
                className="w-[72px]"
                alt="دانشگاه شریف"
              />
            </div>
            <p className="text-[16px] font-semibold text-primary-dark">
              مرکز خدمات آزمایشگاهی شریف
            </p>
            {/* <p className={"text-[7px] font-bold flex flex-col"}>
            <span>
            معاونت پژوهش و فناوری
            </span>
              <span>
            مرکز خدمات آزمایشگاهی
            </span>
            </p> */}
          </div>
        </Link>
        {/* <NavItems /> */}
      </div>
    </>
  );
};

export default Menu;
