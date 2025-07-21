import { Card } from "@kit/card"
import { Button } from "@kit/button"

const RequestRegisteration = () => {
  return (
    <Card className='py-[16px] px-[24px] mt-[32px] flex justify-between' variant='outline' color='info'>
        <div className='flex gap-[24px] items-center'>
          <span className='text-[18px] font-medium flex gap-[8px]'>زمان انتخابی :
            <span className='font-bold'>20/آبان/1402</span>
          </span>
          <span className='text-[18px] font-medium flex gap-[8px] items-center'>هزینه نهایی
            <span className='text-[22px] font-bold'>۵,۲۰۰,۰۰۰</span>
            <span className='text-[14px]'>(ريال)</span>
          </span>
        </div>
        
        <Button size='medium'>ثبت درخواست</Button>
    </Card>
  )
}

export default RequestRegisteration