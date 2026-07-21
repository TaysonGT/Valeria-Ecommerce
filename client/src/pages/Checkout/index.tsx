import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatNumber } from '../../utils/helpers'
import { IoClose } from 'react-icons/io5'

const CheckoutPage = () => {
  const { cartItems, total, removeFromCart, editItemQuantity, clearCart } = useCart()
  const { token, loading, user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', expiry: '', cvv: '' })
  const [shippingAddress, setShippingAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'Egypt' })
  const [billingAddress, setBillingAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'Egypt' })
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [customerInfo, setCustomerInfo] = useState({ firstName: '', lastName: '', email: '', phone: '' })

  useEffect(() => {
    if (user) {
      setCustomerInfo({
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        phone: '',
      })
    }
  }, [user])

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress({ ...shippingAddress })
    }
  }, [sameAsShipping, shippingAddress])

  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader size={35} thickness={7} />
      </div>
    )
  }

  if (!token) {
    return <Navigate to='/auth/login' replace state={{ from: { pathname: '/checkout' } }} />
  }

  const isPaymentComplete = paymentDetails.cardNumber && paymentDetails.expiry && paymentDetails.cvv
  const isShippingComplete = Object.values(shippingAddress).every(Boolean)
  const isBillingComplete = sameAsShipping || Object.values(billingAddress).every(Boolean)
  const canSubmit = cartItems.length > 0 && isPaymentComplete && isShippingComplete && isBillingComplete

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setOrderError('')

    if (cartItems.length === 0) {
      setOrderError('Please add items to your cart first.')
      return
    }
    if (!isPaymentComplete) {
      setOrderError('Please complete your payment details.')
      return
    }
    if (!isShippingComplete || !isBillingComplete) {
      setOrderError('Please complete your shipping and billing details.')
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.post('/orders/create', {
        cart: cartItems,
        paymentMethod: 'credit_card',
        paymentDetails,
        customerInfo,
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
      })

      const order = response.data?.order
      if (order?._id) {
        clearCart()
        toast.success('Order placed successfully!')
        navigate(`/orders/${order._id}`)
      } else {
        setOrderError('Unable to place order. Please try again.')
      }
    } catch (error: any) {
      setOrderError(error.response?.data?.message || 'Unable to complete checkout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#fcfcfc] w-full'>
      <div className='grid lg:grid-cols-[1fr_1fr]'>
        <div className='lg:py-10 p-6 md:p-10 xl:px-20'>
          <h1 className='text-2xl text-gray-800 font-light'>Checkout</h1>
          <div className='mt-6'>
            <h2 className='text-3xl mb-4 flex gap-4 items-center'>Order Summary<span className='bg-gray-200 font-light p-1 text-xs'>{cartItems.length} Items</span></h2>
            {cartItems.length > 0 ? (
              <div className='space-y-4'>
                {cartItems.map((item) => (
                  <div key={item.product._id} className='flex relative gap-4 rounded-md border border-gray-200 bg-white p-2'>
                    <span onClick={()=>removeFromCart(item.product._id)} className='absolute left-full bottom-full -translate-x-1/2 translate-y-1/2  bg-black text-white rounded-full cursor-pointer hover:text-black hover:bg-white border-black border'><IoClose/></span>
                    <div className='relative w-26 aspect-square rounded-xl overflow-hidden shrink-0'>
                        <img className='w-full h-full object-cover' src={item.product.imgs[0]?.url||'/logo.png'} alt="" />
                    </div>
                    <div className='p-2 w-full space-y-1'>
                      <p className='font-semibold'>{item.product.title}</p>
                      <p className='text-sm text-gray-500'>Size: {item.variant.sizeCode}</p>
                      <div className='flex justify-between w-full items-end'>
                        <div className='flex mt-1 text-xs gap-1'>
                          <p className='text-sm text-gray-500 mr-1'>Qty: {item.quantity}</p>
                          <button onClick={()=>editItemQuantity(item.product._id, 'decrement')} className='p-1 rounded-sm aspect-square flex items-center justify-center bg-red-500 text-white cursor-pointer'><FaMinus/></button>
                          <button onClick={()=>editItemQuantity(item.product._id, 'increment')} className='p-1 rounded-sm aspect-square flex items-center justify-center bg-green-500 text-white cursor-pointer'><FaPlus/></button>
                        </div>
                        <div className=''>{formatNumber((item.product.discountPrice || item.product.basePrice) * item.quantity)}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className='rounded-md border border-gray-200 bg-white p-4'>
                  <div className='flex justify-between py-2'><span>Subtotal</span><span>{formatNumber(total)}</span></div>
                  <div className='flex justify-between py-2'><span>Tax</span><span>{formatNumber(total * 0.14)}</span></div>
                  <div className='flex justify-between py-2'><span>Shipping</span><span>{formatNumber(60)}</span></div>
                  <div className='flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold'><span>Total</span><span>{formatNumber(total + total * 0.14 + 60)}</span></div>
                </div>
              </div>
            ) : (
              <p className='text-gray-600'>Your cart is currently empty.</p>
            )}
          </div>
        </div>
        <div className='bg-white p-6 md:p-10 lg:py-20 xl:px-20'>
          <h2 className='text-3xl mb-4 flex gap-4 items-center'>Customer Info</h2>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <section className='space-y-4'>
              <h2 className='text-lg'>Contact Info</h2>  
              <label className="block mb-2.5 text-sm font-light text-gray-600">Email Address</label>
              <input value={customerInfo.email} onChange={(e)=>setCustomerInfo(prev=>({...prev, email:e.target.value}))} placeholder='Email' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
              <label className="block mb-2.5 text-sm font-light text-gray-600">Phone Number</label>
              <input value={customerInfo.phone} onChange={(e)=>setCustomerInfo(prev=>({...prev, phone:e.target.value}))} placeholder='Phone number' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
            </section>

            <section className='space-y-4 mt-6'>
              <h2 className='text-lg'>Shipping Address</h2>
              <div className='grid gap-4 md:grid-cols-2'>
                <input value={shippingAddress.street} onChange={(e)=>setShippingAddress(prev=>({...prev, street:e.target.value}))} placeholder='Street address' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
                <input value={shippingAddress.city} onChange={(e)=>setShippingAddress(prev=>({...prev, city:e.target.value}))} placeholder='City' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
              </div>
              <div className='grid gap-4 md:grid-cols-3'>
                <input value={shippingAddress.state} onChange={(e)=>setShippingAddress(prev=>({...prev, state:e.target.value}))} placeholder='State' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
                <input value={shippingAddress.zipCode} onChange={(e)=>setShippingAddress(prev=>({...prev, zipCode:e.target.value}))} placeholder='Zip code' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
                <input value={shippingAddress.country} onChange={(e)=>setShippingAddress(prev=>({...prev, country:e.target.value}))} placeholder='Country' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
              </div>
            </section>

            <section className='space-y-4 mt-8'>
              <div className='flex items-center justify-between gap-4 flex-wrap gap-y-1'>
                <h2 className='text-lg'>Payment details</h2>
                <span className='text-sm text-gray-500'>{isPaymentComplete ? 'Payment ready' : 'Complete payment information'}</span>
              </div>
              <div className='grid gap-4 md:grid-cols-2'>
                <input value={paymentDetails.cardNumber} onChange={(e)=>setPaymentDetails(prev=>({...prev, cardNumber:e.target.value}))} placeholder='Card number' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
                <input value={paymentDetails.expiry} onChange={(e)=>setPaymentDetails(prev=>({...prev, expiry:e.target.value}))} placeholder='MM/YY' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
              </div>
              <div className='grid gap-4 md:grid-cols-2'>
                <input value={paymentDetails.cvv} onChange={(e)=>setPaymentDetails(prev=>({...prev, cvv:e.target.value}))} placeholder='CVV' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
                <label className='inline-flex items-center gap-2 text-sm text-gray-700'>
                  <input type='checkbox' checked={sameAsShipping} onChange={(e)=>setSameAsShipping(e.target.checked)} className='h-4 w-4 rounded border-gray-300'/>
                  Billing same as shipping
                </label>
              </div>
            </section>

            {!sameAsShipping && (
              <section className='space-y-4'>
                <h2 className='text-2xl font-semibold'>Billing address</h2>
                <div className='grid gap-4 md:grid-cols-2'>
                  <input value={billingAddress.street} onChange={(e)=>setBillingAddress(prev=>({...prev, street:e.target.value}))} placeholder='Street address' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
                  <input value={billingAddress.city} onChange={(e)=>setBillingAddress(prev=>({...prev, city:e.target.value}))} placeholder='City' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
                </div>
                <div className='grid gap-4 md:grid-cols-3'>
                  <input value={billingAddress.state} onChange={(e)=>setBillingAddress(prev=>({...prev, state:e.target.value}))} placeholder='State' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
                  <input value={billingAddress.zipCode} onChange={(e)=>setBillingAddress(prev=>({...prev, zipCode:e.target.value}))} placeholder='Zip code' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
                  <input value={billingAddress.country} onChange={(e)=>setBillingAddress(prev=>({...prev, country:e.target.value}))} placeholder='Country' className='rounded-md border border-gray-300 px-4 py-3 w-full'/>
                </div>
              </section>
            )}

            {orderError && <p className='text-sm text-red-600'>{orderError}</p>}

            <div className='flex flex-col gap-4'>
              <button type='submit' disabled={!canSubmit || isLoading} className='rounded-xl bg-black py-4 text-white transition hover:bg-[#333] disabled:opacity-60'>
                {isLoading ? 'Processing order...' : 'Confirm payment and place order'}
              </button>
              {/* <button type='button' onClick={clearCart} className='rounded-xl border border-gray-300 py-4 text-black hover:border-black'>Clear cart</button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage