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
            <Link to={`/products/${product._id}`} className={`${!autoWidth?'sm:w-80 h-auto w-full':''} min-h-0 bg-white group shadow-black/20 flex flex-col overflow-hidden hover:shadow-hover duration-200 border-[#c4c4c4] border font-[Comfortaa] h-full`}>
                {/* <div className="relative select-none sm:h-80 grow sm:grow-0 border-b border-[#dadada] overflow-hidden">
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
                </div> */}
                <div className="relative select-none grow sm:h-70 h-60 border-b overflow-hidden border-[#dadada]">
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
                    <p className='sm:text-lg text-base'>{product.title}</p>
                    <div className='gap-2 flex sm:text-xl'>
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
                        <p className='sm:text-sm text-xs'>Available Sizes:</p>
                        <div className='flex justify-start gap-1.5 flex-wrap'>
                            {product.variants?.map((variant, i)=>
                                <div key={i} className={`border-black sm:px-2 px-1 py-px text-xs select-none border`}>
                                    {variant.sizeCode}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
    )
}

export default ProductCard