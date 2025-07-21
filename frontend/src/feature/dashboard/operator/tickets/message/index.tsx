import React from 'react'
import { MessageType } from './type'
import { Button } from '@kit/button'

const Message = (props: MessageType) => {
    const { title,message,date } = props
    return (
        <div className=' text-typography-main border-b-[1px] border-background-paper-dark pb-[16px] pt-[16px] last:border-none last:pb-0'>
            <div className='flex justify-between items-center'>
                <h4 className='text-[16px] font-semibold'>{ title }</h4>
                <span className='text-[12px]'>{ date }</span>
            </div>
            <p className='text-[12px] mt-[12px]'>
                { message }
            </p>
            <Button variant='text' className='text-info text-[14px] p-0 mt-[12px]'> پاسخ به تیکت</Button>
        </div>
    )
}

export default Message