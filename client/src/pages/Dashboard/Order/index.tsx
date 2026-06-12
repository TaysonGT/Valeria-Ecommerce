import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext'
import Loader from '../../../components/Loader'
import { formatNumber, formatDateDisplay, paymentMethodDisplay, shippingAddressDisplay } from '../../../utils/helpers'
import { IOrder, PaymentMethodType } from '../../../types'
import { MdClose, MdCreditCard, MdEmail, MdLocationPin, MdPerson, MdReceipt } from 'react-icons/md'
import { Button } from '../../../components/ui/Button'
import { fulfillmentStatuses } from '../../../components/ui/ShippingStatusBig'
import { PiClockFill } from 'react-icons/pi'
import { TbBrandStripe } from 'react-icons/tb'
import UpdateOrderStatus from './dialogs/UpdateStatusModal'
import { toast } from 'react-toastify'
import { FaCheck, FaHandHoldingUsd } from 'react-icons/fa'
import { RiPaypalFill, RiRefund2Fill } from 'react-icons/ri'
import ShippingTimeline from '../../../components/ui/ShippingTimeline'
import { HiCheck } from 'react-icons/hi'


export const paymentStatuses = [
  {
    value: 'pending',
    label: 'Pending',
    icon: <PiClockFill/>,
    color: '#ff9800'
  },
  {
    value: 'paid',
    label: 'Paid',
    icon: <HiCheck/>,
    color: '#28a745'
  },
  {
    value: 'failed',
    label: 'Failed',
    icon: <MdClose/>,
    color: '#ef4444'
  },
  {
    value: 'refunded',
    label: 'Refunded',
    icon: <RiRefund2Fill/>,
    color: '#3b82f6'
  }
]

export const paymentMethods = [
  {
    value: 'cod' as PaymentMethodType,
    label: 'Cash on hand',
    icon: <FaHandHoldingUsd/>,
    color: '#d1d5db'
  },
  {
    value: 'credit_card' as PaymentMethodType,
    label: 'Paid',
    icon: <MdCreditCard/>,
    color: '#28a745'
  },
  {
    value: 'paypal' as PaymentMethodType,
    label: 'Failed',
    icon: <RiPaypalFill/>,
    color: '#ef4444'
  },
  {
    value: 'stripe' as PaymentMethodType,
    label: 'Refunded',
    icon: <TbBrandStripe/>,
    color: '#3b82f6'
  }
]

const DashboardOrderDetailsPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { token, loading } = useAuth()
  const [order, setOrder] = useState<IOrder>()
  const [isLoading, setIsLoading] = useState(false)
  const [showUpdateStatus, setShowUpdateStatus] = useState(false)

  const loadOrder = async () => {
    if(!orderId) return;
    setIsLoading(true)
    try {
      const response = await axios.get(`/orders/${orderId}`)
      setOrder(response.data.order)
    } catch (err: any) {
      setOrder(undefined)
      toast.error(err.response?.data?.message || 'Unable to retrieve this order')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!token && !loading) {
      navigate('/auth/login', { replace: true, state: { from: { pathname: '/orders' } } })
      return
    }
    if (token&&orderId) {
      loadOrder()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loading, orderId])

  return (
    <div className='min-h-screen font-sans bg-[#fafafa]'>
      <div className='mx-auto space-y-6'>
        {isLoading ? (
          <div className='flex justify-center py-20'>
            <Loader size={36} thickness={7} />
          </div>
        ) : order ? (
          <div className='lg:p-10 p-4'>
            <UpdateOrderStatus {...{show: showUpdateStatus, hide: () => setShowUpdateStatus(false), order, onSave: ()=>{
              loadOrder()
              setShowUpdateStatus(false)
            }}} />
            <div className='flex justify-between lg:items-center flex-col lg:flex-row gap-6 gap-y-2 border-b pb-4 border-[#d9d9d9]'>
              <h1 className='md:text-3xl text-2xl font-[Comfortaa]'>Order Details</h1>
              <span className='font-[Sans] p-1 px-5 rounded-lg bg-[#292929] text-white font-bold self-start'>ID: #{order.orderNumber||order?._id}</span>
            </div>
            <div className='grid lg:grid-cols-[2fr_1fr] gap-6 py-4 items-start lg:mt-4'>
              {/* LEFT SECTION */}
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='bg-white border-[#d9d9d9] border p-6 text-base md:gap-14 flex flex-wrap'>
                    <div className='flex-1 flex flex-col items-center'>
                      <label className='text-[#787878] text-sm font-bold'>Delivery Status</label>
                      <div className='text-3xl p-2 mt-2 bg-[#0d6efd] text-white rounded-full'>
                        {fulfillmentStatuses.find(s => s.value === order.fulfillmentStatus)?.icon}
                      </div>
                      <p className='text-[#0d6efd] mt-2.5'>{fulfillmentStatuses.find(s => s.value === order.fulfillmentStatus)?.label||'-'}</p>
                      <p className='text-sm text-[#787878]'>{formatDateDisplay(order.statusTimestamps?.[order.fulfillmentStatus])}</p>
                      {order.paymentStatus === 'pending' && (
                        <p className='text-base text-[#0d6efd] mt-2'>{fulfillmentStatuses.find(s => s.value === order.fulfillmentStatus)?.message||'-'}</p>
                      )}
                    </div>
                    <div className='flex-1 flex flex-col items-center'>
                      <label className='text-[#787878] text-sm font-bold'>Payment Status</label>
                      <div className={`text-3xl relative p-2 mt-2 rounded-full ${`${paymentStatuses.find(s => s.value === order?.paymentStatus)?.color} text-white`||'bg-gray-300 text-gray-600'}`} style={{backgroundColor: '#000'}}>
                        {paymentMethods.find(m => m.value === order?.paymentMethod)?.icon}
                        <span className='rounded-full p-1 text-base text-white absolute -top-2 -left-2' style={{backgroundColor: paymentStatuses.find(s => s.value === order?.paymentStatus)?.color}}>{paymentStatuses.find(s => s.value === order?.paymentStatus)?.icon}</span>
                      </div>
                      <p className={'mt-2.5'} style={{color: '#000'}}>
                        {paymentStatuses.find(s => s.value === order?.paymentStatus)?.label || '-'}
                      </p>
                      <p className='text-sm text-[#787878]'>{formatDateDisplay(order.paymentDetails?.paidAt)}</p>
                    </div>
                  </div>
                </div>
                <div className='space-y-2'>
                  <div className='bg-[#fdfdfd] shadow-sm rounded-sm overflow-hidden border border-[#d3d3d3]'>
                  <div className='font-bold font-[Comfortaa] p-4 pb-2'>
                    Ordered Items
                  </div>
                    <table className='text-sm sm:text-base w-full float-left text-left border-t border-[#d3d3d3]'>
                      <thead className='bg-[#f7f7f7] text-[#393939]'>
                        <tr className='border-b border-[#d3d3d3]'>
                          <th className='py-2 px-4 md:table-cell hidden'>ID</th>
                          <th className='py-2 px-4'>Product</th>
                          <th className='py-2 px-4 text-center'>Size</th>
                          <th className='py-2 px-4 text-center'>Quantity</th>
                          <th className='py-2 px-4 text-center'>Total</th>
                        </tr>
                      </thead>
                      <tbody className='bg-white text-sm sm:text-base'>
                        {order?.items.map((item, idx) => (                  
                          <tr key={idx} className='odd:bg-[#fcfcfc] not-last:border-b border-[#e8e8e8]'>
                            <td className='py-2 px-4 md:table-cell hidden'>#{item.productId.slice(-7)}</td>
                            <td className='py-2 px-4 flex gap-4 items-center'>
                              <div className='relative h-12 aspect-square rounded-xl overflow-hidden shrink-0'>
                                <img className='h-full w-full object-cover object-top' src={item.productSnapshot?.imgs[0]?.url||'/logo.png'} alt="" />
                              </div>
                              {item.productSnapshot?.title}
                            </td>
                            <td className='py-2 px-4 text-center '>{item.variantSnapshot?.sizeCode}</td>
                            <td className='py-2 px-4 text-center '>{item.quantity}</td>
                            <td className='py-2 px-4 text-center'>{formatNumber(item.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className='shadow-sm rounded-sm overflow-hidden border border-[#d3d3d3] bg-white p-4'>
                  <div className='flex justify-between py-2'><span>Subtotal</span><span>{formatNumber(order.subtotal)}</span></div>
                  <div className='flex justify-between py-2'><span className='flex gap-1 items-start'>Tax <span className='text-sm font-bold'>(%{Math.round(order.taxTotal/order.subtotal*100)})</span></span><span>{formatNumber(order.taxTotal)}</span></div>
                  <div className='flex justify-between py-2'><span>Shipping</span><span>{formatNumber(order.shippingCost)}</span></div>
                  <div className='flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold'><span>Total</span><span>{formatNumber(order.grandTotal)}</span></div>
                </div>
              </div>
              {/* RIGHT SECTION */}
              <div className='space-y-6'>
                <div className='p-6 bg-white shadow-sm rounded-sm border border-[#d3d3d3] space-y-4 font-[Comfortaa]'>
                  <div className='font-bold'>
                    Actions
                  </div>
                  <div className='space-y-4'>
                    <button onClick={()=>setShowUpdateStatus(true)} className='w-full cursor-pointer py-3 px-4 bg-[#0d6efd] text-white rounded-md font-medium hover:bg-[#0a5edb] transition-colors'>
                      Update Order Status
                    </button>
                    <button className='w-full cursor-pointer py-3 px-4 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 transition-colors'>
                      Contact Customer
                    </button>
                    <Button variant='danger' size='md' className='w-full justify-center font-bold cursor-pointer text-white py-3' disabled={order.fulfillmentStatus==='cancelled'}>
                      Cancel Order
                    </Button>
                  </div>
                </div>
                <div className='bg-white shadow-sm rounded-sm border border-[#d3d3d3] font-[Sans]'>
                  <div className='text-base font-bold font-[Comfortaa] p-4 pb-2 border-b border-[#d3d3d3]'>Shipping Timeline</div>
                  <div className='p-4 pt-5 pb-6'>
                    <ShippingTimeline order={order}/>
                  </div>
                </div>
                
                <div className='bg-white shadow-sm rounded-sm border border-[#d3d3d3]'>
                  <div className='font-bold font-[Comfortaa] p-4 pb-2 border-b border-[#d3d3d3]'>
                    Customer Information
                  </div>
                  <div className='p-6 px-4 space-y-5'>
                    <div className='flex gap-4 items-center'>
                      <div className='p-2 bg-[#f3f3f3] text-[#1f1f1f] border border-[#d3d3d3] rounded-md text-3xl'>
                        <MdPerson/>
                      </div>
                      <div className='leading-relaxed'>
                        <p className='text-sm text-[#656565]'>Name</p>
                        <p>{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                      </div>
                    </div>
                    <div className='flex gap-4 items-center'>
                      <div className='p-2 bg-[#f3f3f3] text-[#1f1f1f] border border-[#d3d3d3] rounded-md text-3xl'>
                        <MdEmail/>
                      </div>
                      <div className='leading-relaxed'>
                        <p className='text-sm text-[#656565]'>Email address</p>
                        <p>{order.customerInfo?.email}</p>
                      </div>
                    </div>
                    <div className='flex gap-4 items-center'>
                      <div className='p-2 bg-[#f3f3f3] text-[#1f1f1f] border border-[#d3d3d3] rounded-md text-3xl'>
                        <MdLocationPin/>
                      </div>
                      <div className='leading-relaxed'>
                        <p className='text-sm text-[#656565]'>Shipping address</p>
                        <p>{shippingAddressDisplay(order.shippingAddress)}</p>
                      </div>
                    </div>
                    <div className='flex gap-4 items-center'>
                      <div className='p-2 bg-[#f3f3f3] text-[#1f1f1f] border border-[#d3d3d3] rounded-md text-3xl'>
                        <MdReceipt/>
                      </div>
                      <div className='leading-relaxed'>
                        <p className='text-sm text-[#656565]'>Billing address</p>
                        <p>{shippingAddressDisplay(order.billingAddress)}</p>
                      </div>
                    </div>
                    <div className='flex gap-4 items-center'>
                      <div className='p-2 bg-[#f3f3f3] text-[#1f1f1f] border border-[#d3d3d3] rounded-md text-3xl'>
                        <MdCreditCard/>
                      </div>
                      <div className='leading-relaxed'>
                        <p className='text-sm text-[#656565]'>Payment method</p>
                        <p>{paymentMethodDisplay(order.paymentMethod)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bg-white shadow-sm rounded-sm border border-[#d3d3d3]'>
                  <div className='border-b border-gray-200 p-4 font-bold font-[Comfortaa]'>
                    Notes
                  </div>
                  <div className='p-4 space-y-4'>
                    <p className='leading-relaxed text-gray-800 font-light'>This delivery note includes important order and product details, as well as contact information in case the customer needs assistance. It can be printed and included in the package when shipping the products to the customer.</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-sm p-8 shadow-sm'>
            <p className='text-gray-600'>Order not found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardOrderDetailsPage
