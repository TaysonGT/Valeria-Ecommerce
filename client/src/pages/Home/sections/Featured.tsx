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
    <section className='md:py-20 py-16 bg-[#f8f8f8] flex justify-center font-[Comfortaa]'>
        <div className='md:px-10 max-w-350 sm:px-6 px-2 w-full flex flex-col items-center'>
          <div className='w-full flex sm:justify-between justify-center items-center gap-6'>
            <div className='flex gap-1.5 sm:items-start items-center sm:flex-row flex-col'>
              <h1 className='text-4xl font-bold'>Our Best Sellers</h1>
            </div>
            <Link to='/shop' className='self-end border hidden sm:inline-flex border-[#071c1f] z-2 bg-[#071c1f] px-3 py-2 text-white hover:bg-transparent hover:text-[#071c1f] before:bg-[#071c1f] gap-1 rtl text-base duration-300 rounded-md items-center group '>
              Start Shopping Now <RiArrowRightDoubleLine className='text-2xl duration-400 group-hover:translate-x-2'/>
            </Link>
          </div>
          {/* <p className='text-xl mt-1'>A selection of our highest quality products based on customers opinions</p> */}
          <div className='grid lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 min-[370px]:grid-cols-2 gap-2 sm:gap-4 mt-6 w-full'>
            {featuredProducts?.map((product, i)=>
            <div key={i} className='flex-1 h-full'>
              <ProductCard product={product} autoWidth={true} />
            </div>
            )}
          </div>
          <Link to='/shop' className='self-center border sm:hidden inline-flex border-[#071c1f] z-2 bg-[#071c1f] px-3 py-2 text-white hover:bg-transparent hover:text-[#071c1f] before:bg-[#071c1f] gap-1 rtl text-sm duration-300 rounded-md items-center group mt-10'>
            Start Shopping Now <RiArrowRightDoubleLine className='text-xl duration-400 group-hover:translate-x-2'/>
          </Link>
        </div>
    </section>
  )
}

export default FeaturedSection