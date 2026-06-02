import { useEffect, useRef, useState } from 'react'
import { FiGrid, FiList } from 'react-icons/fi'
import { HiArrowDown, HiArrowUp, HiOutlineDotsVertical } from 'react-icons/hi'
import { IoFilter, IoPeople, IoSearch } from 'react-icons/io5'
import { LuDollarSign, LuPackage, LuShoppingCart } from 'react-icons/lu'
import { MdAdd, MdDoubleArrow } from 'react-icons/md'
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
    
    if(searchString){
      newParams.set('q', encodeURIComponent(searchString))
    }

    setSearchParams(newParams)
  }
  
  const lastQ = useRef<string>(searchParams.get('q'))

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
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <div className=''>
          <h1 className='text-4xl font-[Elms_Sans]'>Products</h1>
          <p className='mt-2 font-light text-gray-600'>Manage inventory, pricing and availability across your store</p>
        </div>
        <div className='flex gap-2'>
          <button className='flex items-center gap-2 p-3 pr-4 bg-linear-to-b from-purple-700 to-purple-800 text-white rounded-md cursor-pointer hover:opacity-85 duration-150'>
            <MdAdd className='text-xl'/>Add Product
          </button>
        </div>
      </div>
      <div className='grid grid-cols-4 gap-4 mt-4'>
        <div className='p-2 border border-gray-200 rounded-xl'>
          <div className='flex justify-between items-center px-2'>
            <div className='flex items-center gap-2'>
              <span className='p-2 rounded-full bg-gray-100 text-gray-600'>
                <LuPackage/>
              </span>
              <p className='uppercase'>Total Products</p>
            </div>
            <HiOutlineDotsVertical className='cursor-pointer'/>
          </div>
          <div className='rounded-lg bg-gray-50 mt-2 p-3'>
            <p className='text-3xl'>1,248</p>
            <div className='flex justify-between items-end mt-2 text-sm'>
              <p className='text-green-500 flex items-center gap-1'><HiArrowUp/>4.2%</p>
              <p className='text-gray-600 font-light'>Last 7 days</p>
            </div>
          </div>
        </div>
        
        <div className='p-2 border border-gray-200 rounded-xl'>
          <div className='flex justify-between items-center px-2'>
            <div className='flex items-center gap-2'>
              <span className='p-2 rounded-full bg-gray-100 text-gray-600'>
                <LuDollarSign/>
              </span>
              <p className='uppercase'>Total Revenue</p>
            </div>
            <HiOutlineDotsVertical className='cursor-pointer'/>
          </div>
          <div className='rounded-lg bg-gray-50 mt-2 p-3'>
            <p className='text-3xl'>$84,320</p>
            <div className='flex justify-between items-end mt-2 text-sm'>
              <p className='text-green-500 flex items-center gap-1'><HiArrowUp/>12.5%</p>
              <p className='text-gray-600 font-light'>Last 7 days</p>
            </div>
          </div>
        </div>
        
        <div className='p-2 border border-gray-200 rounded-xl'>
          <div className='flex justify-between items-center px-2'>
            <div className='flex items-center gap-2'>
              <span className='p-2 rounded-full bg-gray-100 text-gray-600'>
                <LuShoppingCart/>
              </span>
              <p className='uppercase'>Total Orders</p>
            </div>
            <HiOutlineDotsVertical className='cursor-pointer'/>
          </div>
          <div className='rounded-lg bg-gray-50 mt-2 p-3'>
            <p className='text-3xl'>142</p>
            <div className='flex justify-between items-end mt-2 text-sm'>
              <p className='text-red-500 flex items-center gap-1'><HiArrowDown/>1.4%</p>
              <p className='text-gray-600 font-light'>Last 7 days</p>
            </div>
          </div>
        </div>
        
        <div className='p-2 border border-gray-200 rounded-xl'>
          <div className='flex justify-between items-center px-2'>
            <div className='flex items-center gap-2'>
              <span className='p-2 rounded-full bg-gray-100 text-gray-600'>
                <IoPeople/>
              </span>
              <p className='uppercase'>Customers</p>
            </div>
            <HiOutlineDotsVertical className='cursor-pointer'/>
          </div>
          <div className='rounded-lg bg-gray-50 mt-2 p-3'>
            <p className='text-3xl'>3,240</p>
            <div className='flex justify-between items-end mt-2 text-sm'>
              <p className='text-green-500 flex items-center gap-1'><HiArrowUp/>2.1%</p>
              <p className='text-gray-600 font-light'>Last 7 days</p>
            </div>
          </div>
        </div>
        
      </div>
      <div className='mt-4'>
        <div className='flex justify-between'>
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
          <div className='flex self-end gap-2 rounded-xl font-[Elms_Sans] p-1.5 px-2 bg-[#f3f3f3]'>
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
        :products.length>0?
        <div className='rounded-xl overflow-hidden border border-[#e7e7e7] my-4 '>
          <table className='text-sm border-collapse w-full text-left'>
            <thead className=''>
              <tr className=''>
                <th className='py-3 px-4 border-b border-r border-[#e7e7e7] text-[#7c7c7c] w-8'>
                  <input type='checkbox' className='scale-115'/>
                </th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-[#7c7c7c]'>Product</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-[#7c7c7c]'>ID</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-[#7c7c7c]'>Creation Date</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-[#7c7c7c] text-center'>Variants</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-[#7c7c7c] text-center'>Base Price</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-[#7c7c7c] text-center'>Status</th>
                <th className='py-3 px-4 border-b border-[#e7e7e7] text-[#7c7c7c] text-center'></th>
              </tr>
            </thead>
            <tbody className='bg-white text-sm'>
              {products?.map((product, idx) => (                  
                <tr key={idx} className='group text-[#1f1f1f]'>
                  <td className='py-2 px-4 group-odd:bg-gray-50 border-b border-r group-last:border-b-0 border-[#e7e7e7] w-8'>
                    <input type='checkbox' className='scale-115'/>
                  </td>
                  <td className='py-2 px-4 pr-20 group-odd:bg-gray-50 border-b group-last:border-0 border-[#e7e7e7] w-[0.1%]'>
                    <div className=' flex gap-4 items-center text-base text-nowrap text-ellipsis'>
                      <img className=' w-12 h-12 rounded-xl overflow-hidden shrink-0 object-cover object-center' src={product.imgs[0]?.url||'/logo.png'} alt="" />
                      {product.title}
                    </div>
                  </td>
                  <td className='py-2 px-4 group-odd:bg-gray-50 border-b group-last:border-0 border-[#e7e7e7] font-light'>
                    <p className='font-normal'>{product._id.slice(-7)}</p>
                  </td>
                  <td className='py-2 px-4 group-odd:bg-gray-50 border-b group-last:border-0 border-[#e7e7e7] font-light'>
                    {formatDateDisplay(product.createdAt)}
                  </td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] text-center'>{product.variants.length}</td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] text-center'>{formatNumber(product.basePrice)}</td>
                  <td className='py-2 px-4  border-b group-last:border-0 border-[#e7e7e7] text-center'>
                    <span className={`capitalize p-2 border ${product.publicationStatus==='active'?'border-green-600 bg-green-100 text-green-600':'border-red-600 bg-red-100 text-red-600'} rounded-lg`}>{product.publicationStatus}</span>
                  </td>
                  <td className='py-2 px-4 group-odd:bg-gray-50 border-b group-last:border-0 border-[#e7e7e7]'>
                    <div className='flex justify-center'>
                      <Link to={`/dashboard/products/${product._id}`} className='p-1 pl-3.5 inline-flex items-center hover:bg-[#3b3b3b] text-white bg-[#1e1e1e] duration-300 justify-center gap-1.5 border border-[#1e1e1e] rounded-full'>
                        Details
                        <span className='p-1.25 border-2 duration-300 border-white rounded-full text-base'><MdDoubleArrow/></span>
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