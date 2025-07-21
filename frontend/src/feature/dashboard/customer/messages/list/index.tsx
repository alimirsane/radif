import React from 'react'

const List = () => {

    return (
        <ul className='mt-[16px]'>
            {
                [1,2,3].map((message,index)=>
                    <li key={index} className='py-[16px] border-b-[1px] border-background-paper-dark last:border-none'>
                        <div className='flex justify-between'>
                            <h1 className='text-[16px] font-bold'>عنوان پیام</h1>
                            <span className='text-[12px]'>1402/05/14</span>
                        </div>
                        <p className='text-[12px] mt-[8px]'>متن پیامی که  میخواد ببینه  اینجا باید نمایش داده بشه</p>
                    </li>
                )
            }
        </ul>
    )
}

export default List