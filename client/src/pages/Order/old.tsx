import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/Loader'
import { formatNumber, formatDateDisplay, paymentMethodDisplay, shippingAddressDisplay } from '../../utils/helpers'
import { IOrder } from '../../types'
import { MdCreditCard, MdEmail, MdLocationPin, MdPerson, MdReceipt } from 'react-icons/md'
import { Button } from '../../components/ui/Button'
import ShippingStatusBig, { fulfillmentStatuses } from '../../components/ui/ShippingStatusBig'
import { toast } from 'react-toastify'

const OrderPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { token, loading } = useAuth()
  const [order, setOrder] = useState<IOrder>()
  const [isLoading, setIsLoading] = useState(false)

  const loadOrder = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/orders/${id}`)
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
      loadOrder(orderId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loading, orderId])

  return (
    <div className='min-h-screen font-[Outfit] bg-[#fafafa]'>
      <div className='mx-auto space-y-6'>
        {isLoading ? (
          <div className='flex justify-center py-20'>
            <Loader size={36} thickness={7} />
          </div>
        ) : order ? (
          <div className='p-6 lg:px-10'>
            <div className='flex justify-between items-center border-b pb-4 border-[#d9d9d9]'>
              <h1 className='text-3xl '>Order Details</h1>
              <span className='font-[Sans] p-1 px-3 rounded-lg bg-[#292929] text-white self-start'>{order.orderNumber||order?._id}  </span>
            </div>
            <div className='flex flex-col items-center gap-4 p-6 bg-[#fefefe] border border-[#d9d9d9] border-t-0'>
              {order.fulfillmentStatus!=='cancelled' &&<p className=' font-bold text-primary-700'>{fulfillmentStatuses.find(s => s.value === order.fulfillmentStatus)?.message}</p>}
              <div className=''>
                <ShippingStatusBig status={order.fulfillmentStatus} timestamps={order.statusTimestamps} />
              </div>
            </div>
            <div className='grid grid-cols-[2fr_1fr] gap-6 py-4 items-start mt-4'>
              {/* LEFT SECTION */}
              <div className='space-y-4'>
                <div className='bg-[#fdfdfd] shadow-sm rounded-sm overflow-hidden border border-[#d3d3d3]'>
                  <div className='font-bold  p-4 pb-2'>
                    Ordered Items
                  </div>
                  <div className='bg-white shadow-sm rounded-sm overflow-hidden border border-[#d3d3d3]'>
                    <table className='text-base w-full float-left text-left'>
                      <thead className='bg-[#f7f7f7] text-[#393939]'>
                        <tr className='border-b border-[#d3d3d3]'>
                          <th className='py-2 px-4'>ID</th>
                          <th className='py-2 px-4'>Product</th>
                          <th className='py-2 px-4 text-center'>Size</th>
                          <th className='py-2 px-4 text-center'>Quantity</th>
                          <th className='py-2 px-4 text-center'>Total</th>
                        </tr>
                      </thead>
                      <tbody className='bg-white text-base'>
                        {order?.items.map((item, idx) => (                  
                          <tr key={idx} className='odd:bg-[#fcfcfc]'>
                            <td className='py-2 px-4 '>{item.productId.slice(-7)}</td>
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
                <div className='flex justify-start'>
                  <Button variant='danger' size='lg' className='justify-center font-bold cursor-pointer text-white' disabled={order.fulfillmentStatus==='cancelled'}>
                    Cancel Order
                  </Button>
                </div>
              </div>
              {/* RIGHT SECTION */}
              <div className='space-y-6'>
                <div className='bg-[#fdfdfd] shadow-sm rounded-sm overflow-hidden border border-[#d3d3d3]'>
                  <div className='font-bold  p-4 pb-2'>
                    Order Information
                  </div>
                  <div className='bg-white border-[#d9d9d9] border p-4 text-base space-y-4'>
                    <div className=''>
                      <label className='text-[#787878] text-sm'>Order ID</label>
                      <p>{order?._id}</p>
                    </div>
                    <div className=''>
                      <label className='text-[#787878] text-sm'>Order Date</label>
                      <p>{formatDateDisplay(order?.createdAt)}</p>
                    </div>
                    <div className=''>
                      <label className='text-[#787878] text-sm'>Estimated Delivery</label>
                      <p>{formatDateDisplay(order?.trackingInfo?.estimatedDelivery)}</p>
                    </div>
                    <div className=''>
                      <label className='text-[#787878] text-sm'>Carrier</label>
                      <p>{order?.trackingInfo?.carrier||'-'}</p>
                    </div>
                  </div>
                </div>
                <div className='bg-[#fdfdfd] shadow-sm rounded-sm overflow-hidden border border-[#d3d3d3]'>
                  <div className='font-bold  p-4 pb-2'>
                    Customer Information
                  </div>
                  <div className='bg-white shadow-sm rounded-sm border border-[#d3d3d3]'>
                    <div className='p-6 space-y-5'>
                      <div className='flex gap-4 items-center'>
                        <div className='p-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-3xl'>
                          <MdPerson/>
                        </div>
                        <div className='leading-relaxed'>
                          <p className='text-sm text-[#656565]'>Name</p>
                          <p>{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                        </div>
                      </div>
                      <div className='flex gap-4 items-center'>
                        <div className='p-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-3xl'>
                          <MdEmail/>
                        </div>
                        <div className='leading-relaxed'>
                          <p className='text-sm text-[#656565]'>Email address</p>
                          <p>{order.customerInfo?.email}</p>
                        </div>
                      </div>
                      <div className='flex gap-4 items-center'>
                        <div className='p-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-3xl'>
                          <MdLocationPin/>
                        </div>
                        <div className='leading-relaxed'>
                          <p className='text-sm text-[#656565]'>Shipping address</p>
                          <p>{shippingAddressDisplay(order.shippingAddress)}</p>
                        </div>
                      </div>
                      <div className='flex gap-4 items-center'>
                        <div className='p-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-3xl'>
                          <MdReceipt/>
                        </div>
                        <div className='leading-relaxed'>
                          <p className='text-sm text-[#656565]'>Billing address</p>
                          <p>{shippingAddressDisplay(order.billingAddress)}</p>
                        </div>
                      </div>
                      <div className='flex gap-4 items-center'>
                        <div className='p-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-3xl'>
                          <MdCreditCard/>
                        </div>
                        <div className='leading-relaxed'>
                          <p className='text-sm text-[#656565]'>Payment method</p>
                          <p>{paymentMethodDisplay(order.paymentMethod)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bg-white shadow-sm rounded-sm'>
                  <div className='border-b border-gray-200 p-4 text-lg'>
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

export default OrderPage
