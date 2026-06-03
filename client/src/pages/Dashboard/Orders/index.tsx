import NavigationController from '../../../components/ui/NavigationController'
import Loader from '../../../components/Loader'
import { Link, useSearchParams } from 'react-router'
import { formatDateDisplay, formatNumber } from '../../../utils/helpers'
import { useOrders } from '../../../hooks/useOrders'
import { MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { IoFilter, IoSearch } from 'react-icons/io5'
import { FiGrid, FiList } from 'react-icons/fi'
import { useState } from 'react'
import { fulfillmentStatuses } from '../../../components/ui/ShippingStatusBig'
import { FulfillmentStatus, PaymentStatus } from '../../../types'

export const fulfillmentStatusDisplay = (status: FulfillmentStatus) =>{
  const statusObj = fulfillmentStatuses.find(s => s.value === status)
  let backgroundColor = '#f3f3f3'
  let borderColor = '#d9d9d9'
  let color = '#676767'

  let text = (!statusObj&&status!=='cancelled')? 'Null': statusObj?.label || status.charAt(0).toUpperCase() + status.slice(1)

  switch(status){
    case 'cancelled':
      backgroundColor = '#ffebee'
      borderColor = '#ffcdd2'
      color = '#c62828'
      break
    case 'delivered':
      backgroundColor = '#e8f5e9'
      borderColor = '#c8e6c9'
      color = '#2e7d32'
      break
    case 'shipped':
      backgroundColor = '#e3f2fd'
      borderColor = '#bbdefb'
      color = '#1565c0'
      break
    case 'processing':
      backgroundColor = '#fff3e0'
      borderColor = '#ffe0b2'
      color = '#ef6c00'
      break
    // case 'confirmed':
    //   backgroundColor = '#ede7f6'
    //   borderColor = '#d1c4e9'
    //   color = '#4527a0'
    //   break
    case 'pending':
      backgroundColor = '#f3f3f3'
      borderColor = '#d9d9d9'
      color = '#676767'
      break
  }

  return <span className={`p-1 px-2 border capitalize rounded-2xl`} style={{backgroundColor, color, borderColor}}>{text}</span>
}

export const paymentStatusDisplay = (status: PaymentStatus) =>{
  const statusObj = Object.entries(PaymentStatus).find(s => s[1] === status)
  let backgroundColor = '#f3f3f3'
  let borderColor = '#d9d9d9'
  let color = '#676767'

  let text = (!statusObj)? 'Null': statusObj[0] || status.charAt(0).toUpperCase() + status.slice(1)

  switch(status){
    case 'paid':
      backgroundColor = '#e8f5e9'
      borderColor = '#c8e6c9'
      color = '#2e7d32'
      break
    case 'refunded':
      backgroundColor = '#ffebee'
      borderColor = '#ffcdd2'
      color = '#c62828'
      break
    case 'failed':
      backgroundColor = '#ffebee'
      borderColor = '#ffcdd2'
      color = '#c62828'
      break
  }

  return <span className={`p-1 px-2 border capitalize rounded-2xl`} style={{backgroundColor, color, borderColor}}>{text}</span>
}

const DashboardOrdersPage = () => {
    const {orders, isLoading, pageCount, maxPages, changePage} = useOrders()
    const [searchString, setSearchString] = useState('')
    const [searchParams,setSearchParams] = useSearchParams()

    const searchSubmitHandler = (e:React.SubmitEvent<HTMLFormElement>)=> {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams)
        const trimmed = searchString.trim()
    
        if(trimmed){
          newParams.set('q', encodeURIComponent(trimmed))
        }else{
          newParams.delete('q')
        }
    
        setSearchParams(newParams)
    }
      
  return (
    <div className='p-10 py-8'>
        <div className=''>
          <h1 className='text-4xl font-[Elms_Sans]'>Orders</h1>
          <p className='mt-2 font-light text-gray-600'>Manage orders, update and availability across your store</p>
        </div>
        <div className='flex justify-between mt-6'>
            <div className='flex gap-2 font-light'>
                <form onSubmit={searchSubmitHandler} className="relative">
                    <button type='submit' className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                        <IoSearch className='text-[#b7b7b7]'/>
                    </button>
                    <input type="search" onChange={(e)=>setSearchString(e.target.value)} id="search" className="block w-75 p-2 ps-9 border border-[#b7b7b7] text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-xs placeholder:text-[#b7b7b7]" placeholder="Search by product ID or name" />
                </form>
                <div className='flex items-center gap-2 px-3 rounded-md text-sm border border-[#b7b7b7] text-[#b7b7b7]'>
                    <IoFilter/>
                    Filter
                </div>
                <div className='flex p-2 text-xl border border-[#b7b7b7] rounded-md'>
                    <div className='pr-2 text-[#b7b7b7] border-r border-[#b7b7b7]'><FiGrid/></div>
                    <div className='pl-2 text-black'><FiList/></div>
                </div>
            </div>
            <div className='flex self-end gap-2 rounded-xl font-[Elms_Sans] p-1.5 px-2 bg-[#f3f3f3] border border-[#d9d9d9]'>
                <button className='bg-white text-black px-2 p-1 text-sm rounded-lg cursor-pointer'>All</button>
                <button className='text-gray-500 px-2 p-1 text-sm rounded-lg cursor-pointer'>Active</button>
                <button className='text-gray-500 px-2 p-1 text-sm rounded-lg cursor-pointer'>Inactive</button>
                <button className='text-gray-500 px-2 p-1 text-sm rounded-lg cursor-pointer'>Out</button>
                <button className='text-gray-500 px-2 p-1 text-sm rounded-lg cursor-pointer'>Something</button>
            </div>
        </div>
        {isLoading ? (
          <div className='flex justify-center py-20'>
            <Loader size={36} thickness={7} />
          </div>
        )
        :orders.length>0?
        <div className='rounded-xl overflow-hidden border border-[#e7e7e7] my-4 '>
          <table className='text-sm border-collapse w-full text-left'>
            <thead className=''>
              <tr className='text-[#494949]'>
                <th className='py-3 px-4 border-b border-r border-[#e7e7e7] w-8'>
                  <input type='checkbox' className='scale-115'/>
                </th>
                <th className='py-3 px-4 border-b border-[#e7e7e7]'>ID</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7]'>Customer</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7]'>Order Date</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-center'>Items</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-center'>Payment Status</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-center'>Shipment Status</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-center'>Total</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-center'></th>
              </tr>
            </thead>
            <tbody className='bg-white text-sm'>
              {orders?.map((order, idx) => (                  
                <tr key={idx} className='group odd:bg-[#fcfcfc] text-[#1f1f1f]'>
                  <td className='py-2 px-4  border-b border-r group-last:border-b-0 border-[#e7e7e7] w-8'>
                    <input type='checkbox' className='scale-115'/>
                  </td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] font-light'>
                    <p className='font-normal'>{order._id.slice(-7)}</p>
                  </td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] font-light'>{order.customerInfo.firstName} {order.customerInfo.lastName}</td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] font-light'>
                    {formatDateDisplay(order.createdAt)}
                  </td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] text-center'>{order.items.length}</td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] text-center'>{paymentStatusDisplay(order.paymentStatus)}</td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] text-center'>{fulfillmentStatusDisplay('pending')}</td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] text-center'>{formatNumber(order.grandTotal)}</td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7]'>
                    <div className='flex justify-center'>
                      <Link to={`/dashboard/orders/${order._id}`} className='p-2 pl-3.5 inline-flex items-center hover:bg-[#3b3b3b] text-white bg-[#1e1e1e] duration-300 justify-center gap-1.5 border border-[#1e1e1e] rounded-full'>
                        Details
                        {/* <span className='p-1.25 border-2 duration-300 border-white rounded-full text-base'><MdDoubleArrow/></span> */}
                        <span className='duration-300 border-white rounded-full text-base'><MdKeyboardDoubleArrowRight/></span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        :
        <div className='flex w-full py-10 justify-center text-gray-700'>
          No products found
        </div>
        }
        <NavigationController {...{pageCount, maxPages, changePage}}/>
    </div>
  )
}

export default DashboardOrdersPage