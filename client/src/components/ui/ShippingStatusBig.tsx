import { FulfillmentStatus } from '../../types'
import { LuPackageCheck, LuPackageOpen } from 'react-icons/lu'
import { MdReceipt } from 'react-icons/md'
import { PiClockFill } from 'react-icons/pi'
import { TbCancel, TbTruckDelivery } from 'react-icons/tb'

export const fulfillmentStatuses = [
    {
        value: "ordered",
        label: "Ordered",
        icon: <MdReceipt/>,
        type: 'linear'
    },
    {
        value: "pending",
        label: "Pending",
        icon: <PiClockFill/>,
        type: 'linear'
    },
    {
        value: "processing",
        label: "Processing",
        icon: <LuPackageOpen/>,
        type: 'linear'
    },
    {
        value: "shipped",
        label: "Shipped",
        icon: <TbTruckDelivery/>,
        type: 'terminal'
    },
    {
        value: "delivered",
        label: "Delivered",
        icon: <LuPackageCheck/>,
        type: 'terminal'
    }
]

export const cancelledStatus = {
    value: "cancelled",
    label: "Cancelled",
    icon: <TbCancel/>
}

const ShippingStatusBig = ({ status }: { status: FulfillmentStatus }) => {
  const currentIndex = fulfillmentStatuses.findIndex((s)=>s.value==='processing')
const isTerminal = fulfillmentStatuses[currentIndex].type === 'terminal'
      
    return (
      <div className='flex items-center'>
          {status==='cancelled'?
          <div className='relative text-lg flex items-end gap-2 font-bold'>
              <div className={`text-3xl text-red-600`}>
                  {cancelledStatus.icon}
              </div>
              <p className={`text-red-600`}>
                  This Order has been Cancelled
              </p>
          </div>
          :fulfillmentStatuses.map((status,i)=>
          <>
          <div key={i} className='relative text-lg'>
              <p className={`absolute bottom-0 left-1/2 -translate-1/2 translate-y-8
                  ${isTerminal? 
                  currentIndex+1===i? 
                  'text-blue-600'
                  :currentIndex+1>i?
                  'text-black'
                  :'text-[#787878]'
  
                  :currentIndex===i? 
                  'text-blue-600'
                  :currentIndex>i?
                  'text-black'
                  :'text-[#787878]'}
                  `}>
                  {status.label}
              </p>
              <div className='p-1'>
                <div className={`text-3xl text-white ${
                isTerminal? 
                currentIndex+1===i? 
                'bg-blue-600'
                :currentIndex+1>i?
                'bg-black '
                :'bg-[#c7c7c7]'
    
                :currentIndex===i? 
                'bg-blue-600 '
                :currentIndex>i?
                'bg-black '
                :'bg-[#c7c7c7]'
                
                } p-2 rounded-full`}>
                    {status.icon}
                </div>
              </div>
          </div>
          {i<fulfillmentStatuses.length-1&&<div className={`h-1 w-30 
              ${isTerminal? 
                  currentIndex>=i? 
                  'bg-black'
                  :'bg-[#d9d9d9]'
                  
                  :currentIndex>i?
                  'bg-black'
                  :'bg-[#d9d9d9]'
              }`}
          />}
          </>
          )}
      </div>
    )
}

export default ShippingStatusBig