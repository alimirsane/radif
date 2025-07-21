import { useRouter } from "next/router";

export const Layout = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) => {
  const router = useRouter();

  return (
    <>
      <div
        className={`flex h-full min-h-screen flex-col items-center px-2 py-16 text-center md:bg-background-paper-light `}
      >
        <div className="w-full">
          <h6 className="text-[18px] font-bold md:text-[22px]">
            سامانه جامع مدیریت اطلاعات آزمایشگاهی دانشگاه صنعتی شریف
          </h6>
        </div>
        <div
          className={`mt-5 w-full rounded-[18px] bg-common-white px-4 py-9 md:w-3/4 md:border md:border-background-paper-dark md:px-[10px] lg:w-1/2 xxl:px-[82px]`}
        >
          <h6 className="mb-3 text-[16px] font-bold">{title}</h6>
          {description && (
            <p
              className={
                "mx-auto mt-1 w-full text-center text-[10px] text-common-gray md:w-2/5"
              }
            >
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </>
  );
};
