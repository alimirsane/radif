import React from "react";
import { Button } from "../kits/button";
import Link from "next/link";
import { routes } from "../data/routes";
import { GetServerSideProps } from "next";

export default function Home() {
  return (
    <div className="flex flex-row gap-2 p-10">
      <Link href={routes.kits()}>
        <Button>نمونه کیت ها</Button>
      </Link>
      <Link href={routes.signIn()}>
        <Button>صفحه ورود</Button>
      </Link>
      <Link href={routes.signup()}>
        <Button>صفحه ثبت نام</Button>
      </Link>
      <Link href={routes.operator()}>
        <Button>صفحه اپراتور</Button>
      </Link>
      <Link href="/dashboard/customer/request">
        <Button>صفحه درخواست</Button>
      </Link>
      <Link href="/dashboard/customer/list-requests">
        <Button>صفحه لیست درخواست</Button>
      </Link>
    </div>
  );
}
