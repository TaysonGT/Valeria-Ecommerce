import { useEffect, useState } from 'react'
import ProductCard from '../../../components/ProductCard'
import { productType } from '../../../types'
import axios from 'axios'
import { Link } from 'react-router'
import { RiArrowRightDoubleLine } from 'react-icons/ri'

const FeaturedSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<productType[]>([])

  useEffect(()=>{
    axios.get('/products/featured')
    .then(({data})=>{
      setFeaturedProducts(data.products)
    })
  },[])
  return (
    <section className='py-20 bg-[#f8f8f8] flex justify-center'>
        <div className='md:px-20 px-6 w-full flex flex-col items-center'>
            <div className='w-full flex justify-between items-center'>
                <div className='flex gap-1.5 items-start'>
                    <h1 className='text-4xl font-bold'>Our Best Sellers</h1>
                    <span className='rounded-md bg-red-500 text-white p-1 px-1.5 text-sm'>Up to 70%</span>
                </div>
                <Link to='/shop' className='self-end border border-[#071c1f] z-2 bg-[#071c1f] px-3 py-2 text-white hover:bg-transparent hover:text-[#071c1f] before:bg-[#071c1f] gap-1 rtl text-base inline-flex duration-300 rounded-md items-center group '>
                    Start Shopping Now <RiArrowRightDoubleLine className='text-2xl duration-400 group-hover:translate-x-2'/>
                </Link>
                {/* <Link to='/products' className='self-end border-b gap-1 rtl text-lg font-bold inline-flex items-center py-1 group mt-10 text-blue-800 hover:text-blue-700 '>
                    Start Shopping Now <RiArrowRightDoubleLine className='text-2xl duration-150 group-hover:translate-x-1'/>
                </Link> */}
            </div>
            {/* <p className='text-xl mt-1'>A selection of our highest quality products based on customers opinions</p> */}
            <div className='grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2 md:gap-10 gap-4 mt-6 w-full'>
              {featuredProducts?.map((product, i)=>
              <div key={i} className='flex-1 h-full bg-red-200'>
                <ProductCard product={product} autoWidth={true} />
              </div>
              )}
            </div>
        </div>
    </section>
  )
}

export default FeaturedSection