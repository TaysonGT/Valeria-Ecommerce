import { formatNumber } from '../../utils/helpers'
import { LuPackageOpen } from 'react-icons/lu'
import { IOrder } from '../../types'
import { useNavigate } from 'react-router'
import ShippingStatus from '../../components/ui/ShippingStatus'
import { fulfillmentStatuses } from '../../components/ui/ShippingStatusBig'

const OrderListItem = ({order}:{order:IOrder}) => {
    const navigate = useNavigate()
  return (
    <div
    key={order._id} className='bg-white rounded-sm border border-[#d3d3d3] p-6 flex justify-between'>
        <div className='text-gray-900'>
            <div className='flex gap-4'>
                <div className='text-4xl p-3 h-full aspect-square rounded-md border text-[#63a8b9] border-[#d3d3d3] shadow-sm'>
                    <LuPackageOpen/>
                </div>
                <div className='text-black text-lg font-[::Elms_Sans] leading-snug'>
                <div className='flex gap-4 items-start'>
                    <p className=''>Order no #{order._id.slice(0,4)}</p>
                </div>
                <p className='text-base'>{formatNumber(order.grandTotal)}</p>
                <p className='text-base'>{order.items.length} items</p>
                </div>
            </div>
            <div className="mt-4 space-y-4">
                <ShippingStatus status={order.fulfillmentStatus}/>
                <p className='text-sm font-bold text-gray-600'>{fulfillmentStatuses.find(s => s.value === order.fulfillmentStatus)?.message}</p>
            </div>
        </div>
        <div className='flex flex-col justify-between'>
            <div className='text-right'>
                <p className='text-sm text-gray-600'>Ordered at: {new Date(order.createdAt).toLocaleString()}</p>
                <p className='text-sm text-gray-600'>Last updated: {new Date(order.updatedAt).toLocaleString()}</p>
            </div>
            <div className='flex gap-4 self-end'>
                <button onClick={() => navigate(`/orders/${order._id}`)} className='py-2 px-6 rounded-lg cursor-pointer bg-[#269ab8] text-white hover:bg-[#17b1d8]'>Order Details</button>
                {/* <button className='py-2 px-6 rounded-lg cursor-pointer border-red-500 border text-red-500 hover:bg-red-50'>Cancel Order</button> */}
            </div>
        </div>
    </div>
  )
}

export default OrderListItem