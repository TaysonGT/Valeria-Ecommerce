import { FulfillmentStatus } from '../../types'
import { LuPackage, LuPackageCheck, LuPackageOpen } from 'react-icons/lu'
import { MdReceipt } from 'react-icons/md'
import { TbCancel, TbTruckDelivery } from 'react-icons/tb'
import { formatDateDisplay } from '../../utils/helpers'

export const fulfillmentStatuses = [
    {
        value: "pending" as const,
        label: "Order Placed",
        icon: <MdReceipt/>,
        type: 'linear',
        message: 'Waiting for payment confirmation'
    },
    {
        value: "processing" as const,
        label: "Processing",
        icon: <LuPackageOpen/>,
        type: 'linear',
        message: 'Order is being prepared'
    },
    {
        value: "shipped" as const,
        label: "Shipped",
        icon: <LuPackage/>,
        type: 'terminal',
        message: 'Order is waiting to be picked up by the delivery service'

    },
    {
        value: "out_for_delivery" as const,
        label: "Out for Delivery",
        icon: <TbTruckDelivery/>,
        type: 'terminal',
        message: 'Order is out for delivery'
    },
    {
        value: "delivered" as const,
        label: "Delivered",
        icon: <LuPackageCheck/>,
        type: 'terminal',
        message: 'Order has been delivered'
    },
    {
    value: "cancelled" as const,
    label: "Cancelled",
    icon: <TbCancel/>,
    type: 'terminal',
    message: 'Order has been cancelled'
    }
] 

export const cancelledStatus = {
    value: "cancelled" as const,
    label: "Cancelled",
    icon: <TbCancel/>,
    type: 'terminal',
    message: 'Order has been cancelled'
}

export type OrderStatusTimestamps = {
    // ordered: Date;
    pending?: Date;
    processing?: Date;
    shipped?: Date;
    out_for_delivery?: Date;
    delivered?: Date;
    cancelled?: Date;
    refunded?: Date;
}

const ShippingStatusBig = ({ status, timestamps }: { status: FulfillmentStatus, timestamps?: OrderStatusTimestamps }) => {
  const currentIndex = fulfillmentStatuses.findIndex((s)=>s.value===status)
  const isTerminal = fulfillmentStatuses[currentIndex].type === 'terminal'
      
    return (
      <div className='flex items-center'>
          {status==='cancelled'?
          <div className='relative text-lg flex items-center flex-col gap-3 font-bold py-2'>
              <div className={`text-4xl text-red-600`}>
                {cancelledStatus.icon}
              </div>
              <p className={`text-red-600`}>
                This Order has been Cancelled
              </p>
          </div>
          :fulfillmentStatuses.slice(0,-1).map((status,i)=>
          <div key={i} className='flex items-center pb-12 pt-0'>
            <div className='relative text-lg'>
                <div className={`absolute  left-1/2 -translate-x-1/2 translate-y-16 
                    text-nowrap text-sm text-center
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
                        <p>{status.label}</p>
                        <p>{formatDateDisplay(timestamps?.[status.value])}</p>
                </div>
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
            {i<fulfillmentStatuses.length-2&&<div className={`h-1 w-30 
                ${isTerminal? 
                    currentIndex>=i? 
                    'bg-black'
                    :'bg-[#d9d9d9]'
                    
                    :currentIndex>i?
                    'bg-black'
                    :'bg-[#d9d9d9]'
                }`}
            />}
          </div>
          )}
      </div>
    )
}

export default ShippingStatusBig