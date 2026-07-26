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
    key={order._id} className='bg-white rounded-sm border border-[#d3d3d3] p-4 md:p-6 flex gap-4 flex-col sm:flex-row justify-between'>
        <div className='text-gray-900'>
            <div className='flex gap-4'>
                <div className='text-4xl p-3 h-full aspect-square rounded-md border bg-primary-500 text-white shadow-md'>
                    <LuPackageOpen/>
                </div>
                <div className='text-black text-lg font-[::Elms_Sans] leading-snug'>
                <div className='flex gap-4 items-start'>
                    <p className=''>#{order._id.slice(0, 10)}</p>
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
        <div className='flex md:flex-col gap-4 justify-between items-end'>
            <div className='text-start md:text-end'>
                <p className='text-sm text-gray-600'>Ordered: {new Date(order.createdAt).toLocaleString(undefined, {dateStyle: "long"})}</p>
                {/* <p className='text-sm text-gray-600'>Updated: {new Date(order.updatedAt).toLocaleString()}</p> */}
            </div>
            <div className='flex gap-4 self-end'>
                <button onClick={() => navigate(`/orders/${order._id}`)} className='py-2 px-4 md:px-6 rounded-lg cursor-pointer bg-primary-500 text-white hover:bg-primary-400 text-sm sm:text-base'>Details</button>
                {/* <button className='py-2 px-6 rounded-lg cursor-pointer border-red-500 border text-red-500 hover:bg-red-50'>Cancel Order</button> */}
            </div>
        </div>
    </div>
  )
}

export default OrderListItem
