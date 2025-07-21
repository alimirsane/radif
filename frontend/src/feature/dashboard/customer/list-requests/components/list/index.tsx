import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@api/service/request";
import { Card } from "@kit/card";
import ListItem from "../list-item";
import { useRouter } from "next/router";
import Pagination from "@kit/pagination";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

const List = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  const openModal = useModalHandler((state) => state.openModal);
  // const currentPage = useMemo(() => {
  //   return parseInt((router.query.page as string) ?? "1");
  // }, [router.query.page]);

  const [displayLoadingOverlay, setDisplayLoadingOverlay] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: requests,
    isLoading: requestsLoading,
    refetch,
  } = useQuery({
    ...apiRequest().getAllMine({
      page: currentPage,
      search: router.query.search_request,
      useLoadingOverlay: displayLoadingOverlay,
    }),
  });
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [expandItem, setExpandItem] = useState<Array<number>>([]);
  const handleClickOnCollapseItem = (id: number) => () => {
    if (expandItem.includes(id)) {
      setExpandItem((prevState) => prevState.filter((item) => item != id));
    } else {
      setExpandItem((prevState) => [...prevState, id]);
    }
  };

  // number of items per page
  const pageSize = requests?.data?.page_size || 10;
  // number of all items
  const totalTransactions = Number(requests?.data?.count) || 0;
  // total pages
  const totalPages = Math.ceil(totalTransactions / pageSize);
  // handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // get requests of the current page
  const getCurrentPageRequestsList = () => {
    if (!requests) return [];
    return requests?.data?.results;
  };

  useEffect(() => {
    if (router.query.action === "cancel") {
      refetch();
      delete router.query.action;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // fetch data every 60 seconds
  useEffect(() => {
    setDisplayLoadingOverlay(false);
    const interval = setInterval(async () => {
      try {
        await refetch();
      } catch (err) {
        console.error(err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [refetch]);
  return (
    <>
      {requestsLoading ? (
        <p className="pt-3 text-[14px]">در انتظار دریافت لیست درخواست‌ها...</p>
      ) : (
        <div className="mt-4 w-full md:mt-[30px]">
          {!getCurrentPageRequestsList()?.length ? (
            <Card
              color="info"
              className="col-span-2 w-full p-7 text-center text-[14px]"
            >
              <p>شما هنوز درخواستی ثبت نکرده‌اید.</p>
            </Card>
          ) : (
            <>
              <Card
                className={
                  "hidden bg-background-paper-dark py-7 font-bold lg:flex lg:px-10"
                }
              >
                {/* <span className="w-[6%]"></span>
                <span className="w-[19%]">موضوع درخواست</span>
                <span className="w-[15%]">شماره درخواست</span>
                <span className="w-[21%]">وضعیت درخواست</span>
                <span className="w-[12%]">تاریخ ثبت</span>
                <span className="w-[18%]">تاریخ تحویل</span>
                <span className="flex w-[9%] justify-center">اقدامات</span> */}

                <span className="w-[16%]">شماره درخواست</span>
                <span className="w-[12%]">تعداد آزمون</span>
                <span className="w-[12%]">گرنت لبزنت</span>
                <span className="w-[18%]">وضعیت درخواست</span>
                <span className="w-[12%]">تاریخ ثبت</span>
                <span className="w-[18%]">هزینه درخواست</span>
                <span className="flex w-[12%] justify-center">اقدامات</span>
              </Card>
              {getCurrentPageRequestsList()?.map((item, index) => (
                <ListItem
                  className={"my-[22px]"}
                  onClick={handleClickOnCollapseItem(item.id ?? -1)}
                  cancelRequest={() =>
                    openModal(ModalKeys.REJECT_REQUEST, {
                      requestId: item.id,
                      children: item.child_requests,
                      type: "main_request",
                    })
                  }
                  expandItem={expandItem}
                  item={item}
                  key={index}
                />
              ))}

              {/* Pagination */}
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default List;
