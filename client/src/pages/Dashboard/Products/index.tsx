import { useEffect, useRef, useState } from 'react'
import { FiGrid, FiList } from 'react-icons/fi'
import { IoFilter, IoPeople, IoSearch } from 'react-icons/io5'
import { LuDollarSign, LuPackage, LuShoppingCart } from 'react-icons/lu'
import { MdAdd, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { productType } from '../../../types'
import { formatDateDisplay, formatNumber } from '../../../utils/helpers'
import axios from 'axios'
import NavigationController from '../../../components/ui/NavigationController'
import { useSearch } from '../../../context/SearchContext'
import { filterType } from '../../Shopping'
import Loader from '../../../components/Loader'
import { Link } from 'react-router'

const ProductsPage = () => {
  const [products, setProducts] = useState<productType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<filterType[]>([])
  const [searchString, setSearchString] = useState('')
  const {searchParams, setSearchParams, setMaxPages, maxPages, pageCount, changePage} = useSearch()
   
  const searchSubmitHandler = (e:React.SubmitEvent<HTMLFormElement>)=> {
    e.preventDefault(); 
    const newParams = new URLSearchParams()
    const trimmed = searchString.trim()

    if(trimmed){
      newParams.set('q', encodeURIComponent(trimmed))
    }else{
      newParams.delete('q')
    }

    setSearchParams(newParams)
  }
  
  const lastQ = useRef<string>(searchParams.get('q'))

  const analytics = [
    {
      title: 'Total Products',
      type: 'number',
      amount: 1248,
      growthLoss: 4.2,
      icon: <LuPackage/>
    },
    {
      title: 'Total Revenue',
      type: 'currency',
      amount: 84320,
      growthLoss: 12.5,
      icon: <LuDollarSign/>
    },
    {
      title: 'Total Orders',
      type: 'number',
      amount: 142,
      growthLoss: -1.4,
      icon: <LuShoppingCart/>
    },
    {
      title: 'Customers',
      type: 'number',
      amount: 3240,
      growthLoss: 2.1,
      icon: <IoPeople/>
    }
  ]

  useEffect(()=>{
    setProducts([])
    setIsLoading(true)
    const currentQ = searchParams.get('q');
    axios.get(`/products/search?${searchParams.toString()}`)
    .then(({data})=>{
        setProducts(data.products)
        setMaxPages(Math.ceil(data.totalCount/parseInt(searchParams.get('pagination')||'10')))
        if (!filters.length || currentQ !== lastQ.current) {
          setFilters(data.filters);
          lastQ.current = currentQ;
        }
        setIsLoading(false)
    })

  }, [searchParams])
    
  return (
    <div className='p-10 font-sans min-h-screen'>
      <div className='flex justify-between items-center'>
        <div className=''>
          <h1 className='text-4xl font-[Elms_Sans]'>Products</h1>
          <p className='mt-2 font-light text-gray-600'>Manage inventory, pricing and availability across your store</p>
        </div>
        <div className='flex gap-2'>
          <button className='flex items-center gap-2 p-3 pr-4 bg-blue-500 text-white rounded-md cursor-pointer hover:opacity-85 duration-150'>
            <MdAdd className='text-xl'/>Add Product
          </button>
        </div>
      </div>
      {/* <div className='grid grid-cols-4 gap-4 mt-4'>
        {analytics.map((box, i)=>
          <div key={i} className='p-2 border border-gray-200 rounded-xl'>
            <div className='flex justify-between items-center px-2'>
              <div className='flex items-center gap-3'>
                <span className='p-2 rounded-full bg-gray-100 text-[#3d3d3d] border border-[#d9d9d9]'>
                  {box.icon}
                </span>
                <p className='font-semibold text-[#4d4d4d]'>{box.title}</p>
              </div>
              <HiOutlineDotsVertical className='cursor-pointer'/>
            </div>
            <div className='rounded-lg bg-gray-50 mt-2 p-4 px-3 border border-[#e7e7e7]'>
              <p className='text-3xl'>{formatNumber(box.amount, box.type as 'currency'|'number')}</p>
              <div className='flex justify-between w-full items-end mt-2 text-sm'>
                {box.growthLoss&&
                  <p className={`${box.growthLoss>0? 'text-green-500': 'text-red-500'} flex items-center gap-1`}>
                    {box.growthLoss>0?<HiArrowUp/>:<HiArrowDown/>}{Math.abs(box.growthLoss)}%
                  </p>
                }
                <p className='text-gray-600 font-light ml-auto'>Last 7 days</p>
              </div>
            </div>
          </div>
        )}
      </div> */}
      <div className='mt-4'>
        <div className='flex justify-between'>
          <div className='flex items-stretch gap-2 font-light'>
            <form onSubmit={searchSubmitHandler} className="relative">
              <button type='submit' className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                <IoSearch className='text-[#b7b7b7]'/>
              </button>
              <input type="search" onChange={(e)=>setSearchString(e.target.value)} id="search" className="h-full block w-75 p-2 ps-9 border border-[#b7b7b7] bg-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-[#b7b7b7]" placeholder="Search by product ID or name" />
            </form>
            <div className='flex items-center gap-2 px-3 rounded-md text-sm border border-[#b7b7b7] text-[#b7b7b7] bg-white'>
              <IoFilter/>
              Filter
            </div>
            <div className='flex p-2 text-xl border border-[#b7b7b7] rounded-md bg-white'>
              <div className='pr-2 text-[#b7b7b7] border-r border-[#b7b7b7]'><FiGrid/></div>
              <div className='pl-2 text-black'><FiList/></div>
            </div>
          </div>
          <div className='flex self-end gap-2 rounded-xl font-[Elms_Sans] p-1.5 px-2 bg-[#787878] border border-[#d9d9d9]'>
            <button className='bg-white shadow-sm text-black px-2 p-1 text-sm rounded-lg cursor-pointer'>All</button>
            <button className='text-[#f9f9f9] px-2 p-1 text-sm rounded-lg cursor-pointer'>Active</button>
            <button className='text-[#f9f9f9] px-2 p-1 text-sm rounded-lg cursor-pointer'>Inactive</button>
            <button className='text-[#f9f9f9] px-2 p-1 text-sm rounded-lg cursor-pointer'>Out</button>
            <button className='text-[#f9f9f9] px-2 p-1 text-sm rounded-lg cursor-pointer'>Something</button>
          </div>
        </div>
        {isLoading ? (
          <div className='flex justify-center py-20'>
            <Loader size={36} thickness={7} />
          </div>
        )
        :products.length>0?
        <div className='rounded-xl shadow-sm shadow-black/20 overflow-hidden border bg-white border-[#e7e7e7] my-4 '>
          <table className='text-sm border-collapse w-full text-left'>
            <thead className=''>
              <tr className='text-[#797979]'>
                <th className='py-3 px-4 border-b border-r border-[#e7e7e7] w-8'>
                  <input type='checkbox' className='scale-115'/>
                </th>
                <th className='py-3 px-4 border-b border-[#e7e7e7]'>Product</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7]'>ID</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7]'>Creation Date</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-center'>Variants</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-center'>Base Price</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-center'>Status</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-center'></th>
              </tr>
            </thead>
            <tbody className='bg-white text-sm'>
              {products?.map((product, idx) => (                  
                <tr key={idx} className='group odd:bg-[#fefefe] text-[#1f1f1f]'>
                  <td className='py-2 px-4  border-b border-r group-last:border-b-0 border-[#e7e7e7] w-8'>
                    <input type='checkbox' className='scale-115'/>
                  </td>
                  <td className='py-2 px-4 pr-20  border-b group-last:border-0 border-[#e7e7e7] w-[0.1%]'>
                    <div className=' flex gap-4 items-center text-base text-nowrap text-ellipsis'>
                      <img className=' w-12 h-12 rounded-xl overflow-hidden shrink-0 object-cover object-center' src={product.imgs[0]?.url||'/logo.png'} alt="" />
                      {product.title}
                    </div>
                  </td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] font-light'>
                    <p className='font-normal'>{product._id.slice(-7)}</p>
                  </td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] font-light'>
                    {formatDateDisplay(product.createdAt)}
                  </td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] text-center'>{product.variants.length}</td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] text-center'>{formatNumber(product.basePrice)}</td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] text-center'>
                    <span className={`capitalize p-2 border ${product.publicationStatus==='active'?'border-green-600 bg-green-100 text-green-600':'border-red-600 bg-red-100 text-red-600'} rounded-lg`}>{product.publicationStatus}</span>
                  </td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7]'>
                    <div className='flex justify-center'>
                      <Link to={`/dashboard/products/${product._id}`} className='p-2 pl-3.5 inline-flex items-center hover:bg-[#3b3b3b] text-white bg-[#1e1e1e] duration-300 justify-center gap-1.5 border border-[#1e1e1e] rounded-full'>
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
    </div>
  )
}

export default ProductsPage