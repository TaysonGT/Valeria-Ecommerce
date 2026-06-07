import React, { useRef, useState } from 'react'
import { paymentMethods, paymentStatuses } from '..'
import { Modal } from '../../../../components/ui/Modal'
import { fulfillmentStatuses } from '../../../../components/ui/ShippingStatusBig'
import { FulfillmentStatus, IOrder } from '../../../../types'
import { formatDateDisplay } from '../../../../utils/helpers'
import axios from 'axios'
import { toast } from 'react-toastify'
import { OrderStatusForm } from '../forms/OrderStatusForm'
import { statusTransitions } from '../../../../types/order-status.config';

interface Props {
    hide: () => void, 
    show: boolean, 
    order: IOrder, 
    onSave: ()=>void
}

const urlRoutes = {
    pending: 'pending', // Added
    processing: 'processing', 
    out_for_delivery: 'out-for-delivery', 
    shipped: 'ship', 
    delivered: 'deliver',
    cancelled: 'cancelled' // Added
} as const satisfies Partial<Record<FulfillmentStatus, string>>;

const UpdateOrderStatus:React.FC<Props> = ({ hide, show, order, onSave }) => {
    const nextStatusIndex = fulfillmentStatuses.findIndex(s => s.value === order.fulfillmentStatus)+1
    const orderPaymentStatus = paymentStatuses.find(s => s.value === order.paymentStatus)
    const [isLoading, setIsLoading] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null);

    const transitionKey = `${order.fulfillmentStatus}->${fulfillmentStatuses[nextStatusIndex]?.value}`;
    const config = statusTransitions[transitionKey];

    const handleSubmit = (formData: Record<string, any>)=>{
        if(!order) return;
        if(fulfillmentStatuses[nextStatusIndex]?.value==='pending') toast.error('Action not allowed. Please refresh the page!');
        if(fulfillmentStatuses[nextStatusIndex]?.value==='cancelled') toast.error('Action not allowed. Please refresh the page!');

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setIsLoading(true)
        axios.put(`/orders/admin/${order._id}/${urlRoutes[fulfillmentStatuses[nextStatusIndex]?.value]}`, formData, {
          signal: abortController.signal,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(({data})=>{
            if(!data.success){
                return toast.error(data.message)
            }
            toast.success(data.message)
            onSave()
        })
        .catch((error)=> toast.error(error.response.data.message))
        .finally(()=>{
            setIsLoading(false)
            abortControllerRef.current = null;
        })
    }

    const handleCloseModal = () => {
        if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        }
        hide();
    };
    
  return (
    <Modal isOpen={show} onClose={handleCloseModal} title={config?.label||'Invalid Transition'} size='xl'>
        <div className='flex'>
            <div className='flex-1 flex flex-col items-center'>
                <p className='text-[#0d6efd] '>{fulfillmentStatuses.find(s => s.value === order.fulfillmentStatus)?.label||'-'}</p>
                <div className='text-3xl p-2 mt-1 bg-[#0d6efd] text-white rounded-full'>{fulfillmentStatuses.find(s => s.value === order.fulfillmentStatus)?.icon}</div>
                <p className='text-sm text-[#787878] mt-2.5'>{formatDateDisplay(order.statusTimestamps?.[order.fulfillmentStatus])}</p>
                {/* {order.paymentStatus === 'pending' && ( */}
                    <p className='text-base text-[#0d6efd] mt-1'>{fulfillmentStatuses.find(s => s.value === order.fulfillmentStatus)?.message||'-'}</p>
                {/* )} */}
            </div>
            <div className='flex-1 flex flex-col items-center'>
                <p className={''} style={{color: orderPaymentStatus?.color||'#c2c2c2'}}>
                    {orderPaymentStatus?.label || '-'}
                </p>
                <div className={`text-3xl relative p-2 mt-1 rounded-full ${`${paymentStatuses.find(s => s.value === order?.paymentStatus)?.color} text-white`||'bg-gray-300 text-gray-600'}`} style={{backgroundColor: '#000'}}>
                    {paymentMethods.find(m => m.value === order?.paymentMethod)?.icon}
                    <span className='rounded-full p-1 text-base text-white absolute -top-2 -left-2' style={{backgroundColor: paymentStatuses.find(s => s.value === order?.paymentStatus)?.color}}>{paymentStatuses.find(s => s.value === order?.paymentStatus)?.icon}</span>
                </div>
                <p className='text-sm text-[#787878] mt-2.5'>{formatDateDisplay(order.paymentDetails?.paidAt)}</p>
            </div>
        </div>
        {
        order.paymentStatus === 'pending' && order.paymentMethod==='cod'?
        <div className='flex items-center gap-4 px-16 py-4 bg-red-50 rounded mt-4'>
            <div className='text-red-600 text-2xl'>
                &#9888;
            </div>
            <p className='text-red-600 font-medium'>
                This order has not been paid for yet. Please ensure payment is received before updating the fulfillment status.
            </p>
        </div>
        :
            <div className='mt-6'>
                <OrderStatusForm
                    currentStatus={order.fulfillmentStatus}
                    targetStatus={fulfillmentStatuses[nextStatusIndex]?.value}
                    onSubmit={(data)=>handleSubmit(data)}
                    onCancel={handleCloseModal}
                    isLoading={isLoading}
                />
            </div>
        }
    </Modal>
  )
}

export default UpdateOrderStatus