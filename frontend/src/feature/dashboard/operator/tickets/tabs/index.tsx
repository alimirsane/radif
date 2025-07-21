import { useRouter } from "next/router"

const Tabs = () => {
    const router = useRouter()

    const tabButtons = [
        {
            name: "all-message",
            text: "همه پیام‌ها",
            click: (name : string) => {
                router.query.tab = name
                router.replace(router)
            }
        },
        {
            name: "responsed",
            text: "پاسخ داده شده",
            click: (name : string) => {
                router.query.tab = name
                router.replace(router)
            }
        },
        {
            name: "not-responsed",
            text: "مشاهده نشده",
            click: (name : string) => {
                router.query.tab = name
                router.replace(router)
            }
        }
    ]
    return (
        <div className='flex text-[12px] gap-[12px] text-typography-main'>
            {
                tabButtons.map((tab, index) =>
                    <div
                        className={`
                            py-[8px] px-[16px] rounded-3xl cursor-pointer
                            ${
                                !router.query.tab ?
                                tab.name === "all-message" ? "bg-common-white border-[1px] border-primary" : "bg-background-paper-light"
                                :
                                tab.name === router.query.tab ? "bg-common-white border-[1px] border-primary" : "bg-background-paper-light"
                            }
                        `}
                        onClick={()=>tab.click(tab.name)}
                        key={index}
                    >
                        {tab.text}
                    </div>
                )
            }
        </div>
    )
}

export default Tabs