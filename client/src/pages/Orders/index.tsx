import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/Loader'
import OrderListItem from './OrderListItem'
import { IOrder } from '../../types'

const tabs = [
  {
    label: "Upcoming",
    value: "upcoming",
  },
  {
    label: "Delivered",
    value: "delivered"
  },
  {
    label: "Cancelled",
    value: "cancelled"
  },
]

const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()
  const { token, loading } = useAuth()

  const [orderList, setOrderList] = useState<any[]>([])
  const [ordersTotals, setOrdersTotals] = useState({
    upcoming: 0,
    delivered: 0,
    cancelled: 0
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTab, setSelectedTab] = useState('upcoming')

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const {data:{success,message, orders, statusCounts: {pending,processing,shipped,delivered,cancelled}}} = await axios.get('/orders/my-orders', searchParams.toString() ? { params: searchParams } : undefined)
      if(success) {
        setOrderList(orders || [])
        setOrdersTotals({
          upcoming: pending+processing+shipped,
          delivered,
          cancelled
        })
      } else {
        setError(message)
      }
    } catch (error:any) {
      setError(error.response.data.message || 'Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!token && !loading) {
      navigate('/auth/login', { replace: true, state: { from: { pathname: '/orders' } } })
      return
    }
    if (token) {
      loadOrders()
    }
  }, [token, loading, searchParams])

  useEffect(()=>{
    const params = searchParams
    params.set('status', selectedTab)
    setSearchParams(params)
  },[selectedTab])

  return (
    <div className='min-h-screen bg-[#fcfcfc] p-2'>
      <div className='rounded-sm p-8 shadow-sm'>
        <div>
          <h1 className='text-4xl font-light font-[Elms_Sans]'>My Orders</h1>
          {error && <p className='mt-4 text-red-600'>{error}</p>}
        </div>
        
        <div className='flex w-full gap-6 mt-8 border-b border-gray-200 font-sans font-bold'>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`px-2 py-2 flex items-center gap-2 cursor-pointer ${searchParams.get('status') === tab.value ? ' text-blue-600 border-b-2' : ' text-gray-600 hover:'}`}
              onClick={() => {
                setSelectedTab(tab.value)
              }}
            >
              {tab.label} 
              <span className={`${searchParams.get('status') === tab.value ? 'text-blue-600 bg-blue-50' : 'text-gray-600 bg-gray-100'} py-1 px-2 rounded-full text-xs font-light border border-[#d9d9d9]`}>{ordersTotals[tab.value as 'upcoming'|'delivered'|'cancelled']}</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className='flex justify-center py-20'>
            <Loader size={36} thickness={7} />
          </div>
        ) : orderList.length === 0 ? 
        (
          <p className='text-gray-600 mt-6 px-6'>No orders yet. Place an order to track it here.</p>
        ) : 
        (
        <div className='mt-6 space-y-4'>
          {orderList.map((order:IOrder) => (
            <OrderListItem order={order}/>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
