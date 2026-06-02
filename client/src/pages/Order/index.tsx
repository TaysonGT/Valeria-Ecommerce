import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/Loader'
import { formatNumber, formatDateDisplay, paymentMethodDisplay, shippingAddressDisplay } from '../../utils/helpers'
import { IOrder } from '../../types'
import { FaAngleRight, FaCaretRight, FaUser } from 'react-icons/fa'
import { MdChevronRight, MdCreditCard, MdEmail, MdLocationPin, MdPerson, MdReceipt } from 'react-icons/md'

const OrderPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { token, loading } = useAuth()
  const [order, setOrder] = useState<IOrder>()
  // const [orderList, setOrderList] = useState<[]>([])
  // const [searchId, setSearchId] = useState(orderId || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadOrder = async (id: string) => {
    setError('')
    setIsLoading(true)
    try {
      const response = await axios.get(`/orders/${id}`)
      setOrder(response.data.order)
    } catch (err: any) {
      setOrder(undefined)
      setError(err.response?.data?.message || 'Unable to retrieve this order')
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

  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''

  return (
    <div className='min-h-screen bg-[#f7f7f7]'>
      <div className='mx-auto space-y-6'>
        {isLoading ? (
          <div className='flex justify-center py-20'>
            <Loader size={36} thickness={7} />
          </div>
        ) : order ? (
          <div className='min-h-screen p-6 py-8'>
            <div className='flex items-center gap-1'>
              <Link to={'/my-orders'}>My Orders</Link>
              <MdChevronRight className='text-xl'/>
              <span className='py-2 px-2 rounded bg-gray-200'>{order?._id}</span>
            </div>
            <div className='flex justify-between items-center mt-8'>
              <h1 className='text-3xl'>Order Details</h1>
              <button className='py-3 px-6 rounded-lg cursor-pointer border-red-500 border text-red-500 hover:bg-red-50'>Cancel Order</button>
            </div>
            <div className='bg-white mt-4 shadow-sm'>
              <div className='border-b border-gray-200 p-4 text-lg'>
                Basic Details
              </div>
              <div className='p-4 text-lg flex gap-16'>
                <div className='flex-1'>
                  <label className='text-gray-500 text-base font-light'>Order ID</label>
                  <p>{order?._id}</p>
                </div>
                <div className='flex-1'>
                  <label className='text-gray-500 text-base font-light'>Order Date</label>
                  <p>{formatDateDisplay(order?.createdAt)}</p>
                </div>
                <div className='flex-1'>
                  <label className='text-gray-500 text-base font-light'>Payment Method</label>
                  <p>{paymentMethodDisplay(order?.paymentMethod)}</p>
                </div>
                <div className='flex-1'>
                  <label className='text-gray-500 text-base font-light'>Estimated Delivery</label>
                  <p>{formatDateDisplay(order?.trackingInfo?.estimatedDelivery)}</p>
                </div>
                <div className='flex-1'>
                  <label className='text-gray-500 text-base font-light'>Carrier</label>
                  <p>{order?.trackingInfo?.carrier||'-'}</p>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-[2fr_1fr] gap-4 py-4 items-start'>
              {/* LEFT SECTION */}
              <div className='space-y-4'>
                <div className='bg-white shadow-sm rounded-sm'>
                  <div className='border-b border-gray-200 p-4 text-lg'>
                    Order Items
                  </div>
                  <table className='text-base w-full float-left text-left'>
                    <thead className='bg-gray-50'>
                      <tr className='border-b border-gray-300'>
                        <th className='font-light py-2 px-4'>ID</th>
                        <th className='font-light py-2 px-4'>Product</th>
                        <th className='font-light py-2 px-4 text-center'>Size</th>
                        <th className='font-light py-2 px-4 text-center'>Quantity</th>
                        <th className='font-light py-2 px-4 text-center'>Total</th>
                      </tr>
                    </thead>
                    <tbody className='bg-white text-base'>
                      {order?.items.map((item, idx) => (                  
                        <tr key={idx}>
                          <td className='py-2 px-4 font-light'>{item.productId}</td>
                          <td className='py-2 px-4 flex gap-4 items-center'>
                            <div className='relative w-12 rounded-xl overflow-hidden shrink-0'>
                              <img className='w-full object-cover' src={item.productSnapshot?.imgs[0]?.url||'/logo.png'} alt="" />
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
              {/* RIGHT SECTION */}
              <div className='space-y-4'>
                <div className='bg-white shadow-sm rounded-sm'>
                  <div className='border-b border-gray-200 p-4 text-lg'>
                    Customer Information
                  </div>
                  <div className='p-4 space-y-4'>
                    <div className='flex gap-4'>
                      <div className='p-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-3xl'>
                        <MdPerson/>
                      </div>
                      <div className='leading-relaxed'>
                        <p className='text-sm font-light text-gray-500'>Name</p>
                        <p>{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
                      </div>
                    </div>
                    <div className='flex gap-4'>
                      <div className='p-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-3xl'>
                        <MdEmail/>
                      </div>
                      <div className='leading-relaxed'>
                        <p className='text-sm font-light text-gray-500'>Email address</p>
                        <p>{order.customerInfo?.email}</p>
                      </div>
                    </div>
                    <div className='flex gap-4'>
                      <div className='p-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-3xl'>
                        <MdLocationPin/>
                      </div>
                      <div className='leading-relaxed'>
                        <p className='text-sm font-light text-gray-500'>Shipping address</p>
                        <p>{shippingAddressDisplay(order.shippingAddress)}</p>
                      </div>
                    </div>
                    <div className='flex gap-4'>
                      <div className='p-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-3xl'>
                        <MdReceipt/>
                      </div>
                      <div className='leading-relaxed'>
                        <p className='text-sm font-light text-gray-500'>Billing address</p>
                        <p>{shippingAddressDisplay(order.billingAddress)}</p>
                      </div>
                    </div>
                    <div className='flex gap-4'>
                      <div className='p-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-3xl'>
                        <MdCreditCard/>
                      </div>
                      <div className='leading-relaxed'>
                        <p className='text-sm font-light text-gray-500'>Payment method</p>
                        <p>{paymentMethodDisplay(order.paymentMethod)}</p>
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
