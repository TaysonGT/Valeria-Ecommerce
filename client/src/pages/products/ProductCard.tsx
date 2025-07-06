import React, { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { Link } from 'react-router'
import { productType } from '../../types/types'

interface Props {
    product: productType
}

const ProductCard:React.FC<Props> = ({product})=>{
    const [favourite, setFavourite] = useState(false);
    const [inCart, setInCart] = useState(false);


    return (
        <div className='w-[250px] group h-auto rounded shadow-hard flex flex-col overflow-hidden hover:shadow-hover duration-200'>
            <div className="relative select-none h-[200px] overflow-hidden">
                <Link to={`/product/${product._id}`}>
                    <img loading='lazy' className='object-cover object-center h-full w-full group-hover:scale-105 duration-300' src={product.imgs[0].url} alt="1" />
                </Link>
                {
                    product.discountPrice&&
                    <span className='absolute top-[3px] right-[3px] p-1 bg-red-500 text-white rounded-sm text-xs font-bold'>
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
            <div className='p-4'>
                <Link to={`/product/${product._id}`}><p className='text-nowrap overflow-hidden'>{product.title}</p></Link>
                <div className='gap-2 items-center flex mt-1 mb-2 justify-center'>
                    {
                        product.discountPrice?
                        <>
                            <p className='text-red-600'>${product.discountPrice}</p>
                            <p className='line-through text-gray-700 text-sm'>${product.basePrice}</p>
                        </>
                        :
                        <p className='text-red-600'>${product.basePrice}</p>
                    }
                </div>
                <div className='flex justify-center gap-2 mb-3'>
                    {product.variants?.map((variant, i)=>
                        <div key={i} className='rounded-full px-2 py-1 bg-black text-white text-xs select-none cursor-pointer border border-black hover:text-black hover:bg-transparent duration-200'>
                            {variant.sizeCode}
                        </div>
                    )}
                </div>
                <button 
                    onClick={()=> setInCart(prev=>!prev)} 
                    className='cursor-pointer p-2 w-full text-md rounded-sm bg-[#ffd041] hover:bg-[#ffe084] text-gray-900 duration-150 '>
                    Add To Cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard