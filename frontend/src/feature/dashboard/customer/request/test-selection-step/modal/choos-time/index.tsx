import { Card } from '@kit/card'
import { useModalHandler } from '@utils/modal-handler/config'
import { Fab } from '@kit/fab'
import { IcClose } from '@feature/kits/common/icons'
import { SvgIcon } from '@kit/svg-icon'
import Filter from './filter'
import RequestRegisteration from './request-registration'
import Table from './table'


const ChoosTime = () => {
  const hideModal = useModalHandler((state) => state.hideModal)
  return (
    <Card className='w-[80vw] bg-common-white p-[48px] overflow-y-auto max-h-[90vh]'>
      <div className='flex justify-between'>
        <h2 className='text-[22px] text-common-black font-bold'>انتخاب زمان آزمایشگاه</h2>
        <Fab
          className="bg-error-light bg-opacity-60 p-1"
          onClick={hideModal}
        >
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <RequestRegisteration />
      <Filter/>
      <Table/>
    </Card>
  )
}

export default ChoosTime