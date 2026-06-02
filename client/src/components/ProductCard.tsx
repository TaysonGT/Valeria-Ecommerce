import React, { useState } from 'react'
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa'
import { Link } from 'react-router'
import { productType, } from '../types'

interface Props {
    product: productType
    autoWidth?: boolean
}

const ProductCard:React.FC<Props> = ({product, autoWidth=false})=>{
    const [favourite, setFavourite] = useState(false);

    return (
        <div className={`${!autoWidth?'w-80 h-auto':'h-full w-full'} bg-white group  shadow-black/20 flex flex-col overflow-hidden hover:shadow-hover duration-200 border-[#c4c4c4] border font-[Comfortaa]`}>
            <Link to={`/products/${product._id}`} className='flex flex-col h-full'>
                <div className="relative select-none h-80 border-b border-[#dadada] overflow-hidden">
                    <img loading='lazy' className='object-cover object-top h-full w-full group-hover:scale-105 duration-300' src={product.imgs[0].url} alt="1" />
                    {
                        product.discountPrice&&
                        <span className='absolute top-0.75 right-0.75 p-1 bg-red-500 text-white rounded-sm text-xs font-bold'>
                        Discount %{Math.ceil(100-(product.discountPrice/product.basePrice!)*100)}</span>
                    }
                    <button onClick={()=> setFavourite(prev=>!prev)} className='absolute top-0 left-0 cursor-pointer text-red-500 hover:text-red-400 duration-150 p-2 text-xl'>
                        {favourite?
                            <FaHeart/>
                            :
                            <FaRegHeart/>
                        }
                    </button>
                </div>
                <div className='p-4 flex flex-col flex-1 gap-1 font-light'>
                    <div className='flex gap-1.25'>
                        <FaStar className='text-[#FFB400] text-lg'/>
                        <span className='text-sm text-gray-600'>4.5 (59 Reviews)</span>
                    </div>
                    <p className='text-lg'>{product.title}</p>
                    <div className='gap-2 flex text-xl'>
                        {
                            product.discountPrice?
                            <>
                                <p className='font-semibold'>${product.discountPrice}</p>
                                <p className='line-through text-gray-700 text-sm'>${product.basePrice}</p>
                            </>
                            :
                            <p className='font-semibold'>${product.basePrice}</p>
                        }
                    </div>
                    <div>
                        <p className='text-sm'>Available Sizes:</p>
                        <div className='flex justify-start gap-1.5'>
                            {product.variants?.map((variant, i)=>
                                <div key={i} className={`border-black px-2 py-px text-xs select-none border`}>
                                    {variant.sizeCode}
                                </div>
                            )}
                        </div>
                        {/* <div className='flex justify-start mt-1'>
                            {product.variants?.map((variant, i)=>
                                <div key={i} className={`border-black pr-2 not-first:pl-2 text-xs select-none not-last:border-r`}>
                                    {variant.sizeCode}
                                </div>
                            )}
                        </div> */}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCard