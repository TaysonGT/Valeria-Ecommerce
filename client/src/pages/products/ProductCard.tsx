import React, { useState } from 'react'
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa'
import { Link } from 'react-router'
import { productType, variantType } from '../../types/types'
import { useCart } from '../../context/CartContext'
import { MdRemoveShoppingCart } from 'react-icons/md'

interface Props {
    product: productType
    autoWidth?: boolean
}

const ProductCard:React.FC<Props> = ({product, autoWidth=false})=>{
    const [favourite, setFavourite] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<variantType>();
    const {addToCart, removeFromCart, isInCart} = useCart()


    return (
        <div className={`${!autoWidth?'w-[250px] h-auto':'h-full w-full'} bg-white group rounded shadow-hard flex flex-col overflow-hidden hover:shadow-hover duration-200`}>
            <div className="relative select-none h-[200px] overflow-hidden">
                <Link to={`/products/${product._id}`}>
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
            <div className='p-4 flex flex-col grow'>
                <Link to={`/product/${product._id}`}><p className='text-nowrap text-center overflow-hidden'>{product.title}</p></Link>
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
                {
                    isInCart(product._id)?
                    <button onClick={()=>removeFromCart(product._id)} className=' px-4 text-sm w-full py-2 bg-red-600   text-white hover:bg-transparent cursor-pointer hover:border-red-600 hover:text-red-600 z-2 border border-red-600 ltr duration-300 text-nowrap flex items-center justify-center gap-2 mt-auto'><MdRemoveShoppingCart /> Remove From Cart</button> 
                    :
                    <>
                    <div className='flex justify-center gap-2 mb-3'>
                        {product.variants?.map((variant, i)=>
                            <div key={i} onClick={()=>selectedVariant?._id==variant._id?setSelectedVariant(undefined):setSelectedVariant(variant)} className={`rounded-full px-2 py-1 ${variant._id===selectedVariant?._id&&' bg-black text-white'} text-xs select-none cursor-pointer border border-black duration-200 active:bg-gray-300`}>
                                {variant.sizeCode}
                            </div>
                        )}
                    </div>
                    <button onClick={()=>addToCart(product, 1, selectedVariant)} className='px-4 text-sm w-full py-2 hover:bg-transparent cursor-pointer hover:text-[#071c1f] bg-[#FFB400] before:bg-[#FFB400] hover:before:bg-[#071c1f] text-white z-2 relative rtl duration-300 text-nowrap flex items-center justify-center gap-2 border border-[#FFB400] hover:border-[#071c1f] mt-auto'><FaShoppingCart/> Add to Cart</button>
                    </>
                }
            </div>
        </div>
    )
}

export default ProductCard