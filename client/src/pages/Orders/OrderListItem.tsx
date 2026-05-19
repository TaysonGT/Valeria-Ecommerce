import { formatCurrency } from '../../utils/helpers'
import { LuPackageOpen } from 'react-icons/lu'
import { IOrder } from '../../types'
import { useNavigate } from 'react-router'
import ShippingStatus from '../../components/ui/ShippingStatus'

const OrderListItem = ({order}:{order:IOrder}) => {
    const navigate = useNavigate()
  return (
    <div
    key={order._id} className='bg-white rounded-sm border border-gray-200 p-6 shadow-sm flex justify-between'>
        <div className='text-gray-900'>
            <div className='flex gap-4'>
                <div className='text-4xl p-3 h-full aspect-square rounded-md border text-[#63a8b9] border-gray-100 shadow-sm'>
                <LuPackageOpen/>
                </div>
                <div className='text-black text-lg font-[::Elms_Sans] leading-snug'>
                <p className=''>Order no #{order._id.slice(0,4)}</p>
                <p className='text-base'>{formatCurrency(order.grandTotal)}</p>
                <p className='text-base'>{order.items.length} items</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <ShippingStatus status={order.fulfillmentStatus}/>
                <p className='text-sm text-gray-600'>Ordered at: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
        </div>
        <div className='flex gap-4 self-start'>
            <button onClick={() => navigate(`/orders/${order._id}`)} className='py-2 px-6 rounded-lg cursor-pointer bg-[#269ab8] text-white hover:bg-[#17b1d8]'>Order Details</button>
            <button className='py-2 px-6 rounded-lg cursor-pointer border-red-500 border text-red-500 hover:bg-red-50'>Cancel Order</button>
        </div>
    </div>
  )
}

export default OrderListItem