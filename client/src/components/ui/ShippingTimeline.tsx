import { IOrder } from '../../types'
import { formatDateDisplay } from '../../utils/helpers'
import { fulfillmentStatuses } from './ShippingStatusBig'

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

const ShippingTimeline = ({ order }: { order: IOrder }) => {
  const finalTimeline = [
    ...order.trackingInfo?.trackingHistory.sort((a,b)=>new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime())||[], 
    {
        event: "pending",
        timestamp: order.createdAt,
        description: 'Waiting for payment confirmation',
        isCarrierEvent: false,
    }]
      
    return (
      <div className='relative'>
        <div className='h-full absolute bg-[#676767] w-0.5 translate-x-4.5 z-1'/>
        <div className='space-y-4.5'>
          {finalTimeline.map((event,i)=>
          //   {order.trackingInfo?.trackingHistory?.sort((a,b)=>new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime()).map((event,i)=>
            <div className='flex flex-col'>
                <div className='flex items-start gap-2.5 z-2' key={i}>
                    <div className='p-0.75 rounded-full bg-white'>
                        <div className='p-1 rounded-full bg-[#0a5edb] text-white text-2xl'>
                            {fulfillmentStatuses.find(s=>s.value===event.event)?.icon}
                        </div>
                    </div>
                    <div>
                        <div className='flex gap-2 items-center'>
                            <p className='font-[Comfortaa]'>{fulfillmentStatuses.find(s=>s.value===event.event)?.label}</p>
                        </div>
                        <p className='text-sm text-[#373737]'>{event.description}</p>
                        <p className='text-sm text-[#676767]'>{formatDateDisplay(event.timestamp)}</p>
                        
                    </div>
                </div>
            </div>
          )}

        </div>
      </div>
    )
}

export default ShippingTimeline