import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProductCard from '../../components/ProductCard';
import { Link } from 'react-router';
import { FaRegHeart, FaStar } from 'react-icons/fa';

interface productType {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

const TestPage = () => {
  const [products, setProducts] = useState<productType[]>()
  useEffect(()=>{
    axios.get('https://fakestoreapi.com/products')
      .then(({data}) => {
        setProducts(data)
        console.log(JSON.stringify(data, null, 2))
      })
  },[])
  return (
    <div className='grid grid-cols-4 gap-4 p-8'>
      {
        products?.map(product=>
          <div className={`w-70 h-auto bg-white group rounded shadow-hard flex flex-col overflow-hidden hover:shadow-hover duration-200`}>
            <Link to={`/products/${product.id}`}>
                  <div className="relative select-none h-80 overflow-hidden">
                      <img loading='lazy' className='object-cover object-center h-full w-full group-hover:scale-105 duration-300' src={product.image} alt="1" />
                      <button onClick={()=> undefined} className='absolute top-0 left-0 cursor-pointer text-red-500 hover:text-red-400 duration-150 p-2 text-xl'>
                        <FaRegHeart/>
                      </button>
                  </div>
                  <div className='p-4 flex flex-col  gap-1 font-light'>
                      <div className='flex gap-1.25'>
                          <FaStar className='text-[#FFB400] text-lg'/>
                          <span className='text-sm text-gray-600'>{product.rating.rate} ({product.rating.count} Reviews)</span>
                      </div>
                      <p className='text-lg'>{product.title}</p>
                      <div className='gap-2 flex text-xl mt-auto'>
                        <p className='font-semibold'>${product.price}</p>
                      </div>
                      {/* <div className=''>
                          <p className='text-sm'>Available Sizes:</p>
                          <div className='flex justify-start gap-1.5'>
                              {product.variants?.map((variant, i)=>
                                  <div key={i} className={`rounded-sm border-black px-2 py-0.5 text-xs select-none border`}>
                                      {variant.sizeCode}
                                  </div>
                              )}
                          </div>
                      </div> */}
                  </div>
              </Link>
          </div>
        )
      }
    </div>
  )
}

export default TestPage