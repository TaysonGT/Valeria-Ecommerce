import { useEffect, useState } from 'react'
import { productType, variantType } from '../../types/types'
import { Link, useParams } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaShoppingCart, FaStar, FaTwitter } from 'react-icons/fa'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Navigation} from 'swiper/modules'
import { MdNavigateNext, MdOutlineCompareArrows, MdRemoveShoppingCart } from 'react-icons/md'
import { useCart } from '../../context/CartContext'
import PaymentImg from '/payment-4.png'
import { IoHeart } from 'react-icons/io5'
import 'swiper/css'
import 'swiper/css/navigation';

const ProductPage = () => {
    const [product, setProduct] = useState<productType>()
    const [relatedProducts, setRelatedProducts] = useState<productType[]>([])
    const [isLoading,setIsLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [selectedVariant, setSelectedVariant] = useState<variantType>()
    const {productId} = useParams()

    const {isInCart, addToCart, removeFromCart} = useCart()

    const fetchProduct = async()=>{
        setIsLoading(true)
        setSelectedVariant(undefined)
        setSelectedImage(0)
        setQuantity(1)

        await axios.get(`/products/${productId}`)
        .then(({data})=>{
            setProduct(data.product)
            setSelectedVariant(data.product.variants[0])
            fetchRelated()
        }).catch(({response: {data}})=>{
            toast.error(data.message)
            console.log(data)
        }).finally(()=>setIsLoading(false))
    }
    
    const fetchRelated = async()=>{
        setRelatedProducts([])
        await axios.get(`/products/related/${productId}`)
        .then(({data})=>{
            setRelatedProducts(data.relatedProducts)
        }).catch(({response: {data}})=>{
            toast.error(data.message)
            console.log(data)
        }).finally(()=>setIsLoading(false))
    }

    useEffect(()=>{
        fetchProduct()
    },[productId])
  
    return isLoading?
        <div className='h-screen flex justify-center items-center'>
            <Loader size={35} thickness={7}/>
        </div>
        :
        <div className='flex flex-col h-full bg-[#f3f3f3] p-4'>
            {!product?
                <div className='m-auto'>
                    <h1 className='text-5xl font-bold text-gray-600'>Product Not Found!</h1>
                    <Link className='text-blue-600 text-xl mt-2 flex items-end' to={'/shop'}>Go back to shopping page <MdNavigateNext className='text-2xl'/></Link>
                </div>
                :<>
                {/* <div className='w-full flex gap-4'>
                    <div className='w-1/4 h-100 overflow-hidden border-r border-gray-100 bg-[#fcfcfc]'>
                        <img src="" alt="" className='w-full'/>
                    </div>
                    <div className='grow bg-[#fcfcfc] p-6'>
                        <h1 className='text-3xl font-bold'>{product.title}</h1>

                    </div>  
                </div> */}
                <div className='flex basis-0 gap-4 w-[80%] mx-auto'>
                    <div className='w-2/3 bg-white'>
                        <div className='flex'>
                            <div className='p-4'>
                                <div className='h-100 w-full border border-gray-200 bg-[#F7f7F7]'>
                                    <img className='h-full w-full object-contain' src={product?.imgs[selectedImage].url.replace('src/assets', '/test-images').replace('.jpg','.webp')} alt={product?.imgs[selectedImage].altText} />
                                </div>
                                <div className='w-100 h-24 mt-1 overflow-hidden'>
                                    <Swiper 
                                    spaceBetween={4}
                                    slidesPerView={4}
                                    modules={[Navigation]}
                                    navigation={true}
                                    className='h-full w-full'>
                                        {product?.imgs.map((img, i)=>
                                            <SwiperSlide>
                                                <div className={`h-full w-24 border cursor-pointer bg-[#F2F6F7] ${i===selectedImage? 'border-[#FFB400]': 'border-transparent'}`}>
                                                    <img key={i} onClick={()=>setSelectedImage(i)} className={`h-full w-full object-contain`} src={img.url.replace('src/assets', '/test-images').replace('.jpg','.webp')} alt={img.altText} />
                                                </div>
                                            </SwiperSlide>
                                        )}
                                    </Swiper>
                                </div>
                            </div>
                            <div className='grow pl-2 p-8 pb-0'>
                                <div className='flex gap-2 text-lg text-[#FFB400]'>
                                    {[...Array(5)].map((_, i)=>
                                        <FaStar key={i}/>
                                    )}
                                    <p className='text-sm'>(95 Reviews)</p>
                                </div>
                                
                                <h1 className='text-2xl font-bold mt-4'>{product.title}</h1>
                                <div className='flex items-center gap-4 text-[#FFB400] mt-2 font-bold'>
                                    <p className='text-4xl font-bold'>${product.discountPrice||product.basePrice}</p>
                                    {product.discountPrice&& <p className='line-through text-3xl opacity-50'>${product.basePrice}</p>}
                                </div>

                                <p className='text-md text-gray-500 mt-4'>{product?.description}</p>
                                <div className='mt-4 flex items-center gap-4 py-4 border-y border-gray-100'>
                                    <p className='text-gray-600'>Category:</p>
                                    <div className='w-full flex flex-wrap items-center gap-2 font-[Comfortaa] text-sm'>
                                        {product.collections.map((collection)=>
                                            <p className='capitalize font-bold p-1 px-1.5 rounded-md bg-violet-900 text-white'>{collection.title}</p>
                                        )}
                                        {product.categories.map((category)=>
                                            <p className='capitalize font-bold p-1 px-1.5 rounded-md bg-rose-800 text-white'>{category.name}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className='mt-4'>
                                    {!isInCart(product._id) ?
                                    <>
                                        <div className='flex gap-2 items-center'>
                                            <p>Available:</p>
                                            {product.variants.map((variant)=>
                                                <button onClick={()=>setSelectedVariant(variant)} className={`px-3 py-1 border rounded font-bold text-sm ${selectedVariant===variant&& 'bg-black text-white'} duration-75 cursor-pointer`}>{variant.sizeCode}</button>
                                            )}
                                        </div>
                                        <div className='flex gap-4 mt-3'>
                                            <div className="flex items-stretch">
                                                <button onClick={()=>setQuantity(prev=>Math.max(prev-1,1))} className="border border-gray-200 p-2 w-10 aspect-square">-</button>
                                                <input onChange={(e)=>setQuantity(parseInt(e.target.value))} className="text-center flex items-center justify-center border border-gray-300 w-10 aspect-square" type="number" min={1} value={quantity} />
                                                <button onClick={()=>setQuantity(prev=>prev+1)} className="border border-gray-200 p-2 w-10 aspect-square">+</button>
                                            </div>
                                            <button onClick={()=>addToCart(product, quantity, selectedVariant)} className='text-white border-[#FFB400] hover:border-[#071c1f] bg-[#FFB400] z-2 px-4 py-2.5 hover:bg-transparent cursor-pointer hover:text-[#071c1f] border ltr duration-300 text-nowrap flex items-center gap-2 '><FaShoppingCart/> Add to Cart</button>
                                        </div>
                                    </>
                                    :
                                        <button onClick={()=>removeFromCart(product._id)} className='px-4 py-2.5 text-white bg-red-600 border-red-600 hover:bg-transparent cursor-pointer hover:text-black border hover:border-black z-2 before:bg-red-600 rtl duration-300 text-nowrap flex items-center gap-2 '><MdRemoveShoppingCart/> Remove From Cart</button> 
                                    }
                                </div>
                                <div className='flex gap-6 mt-5 px-2 text-sm'>
                                    <button className='flex gap-2 items-center font-bold hover:text-[#FFB400] duration-200 cursor-pointer'><IoHeart className='text-xl'/>Add to Wishlist</button>
                                    <button className='flex gap-2 items-center font-bold hover:text-[#FFB400] duration-200 cursor-pointer'><MdOutlineCompareArrows className='text-xl'/>Compare</button>
                                </div>
                                <div className='mt-4 py-6 flex items-center gap-4 border-y border-gray-200'>
                                    <p className='text-gray-600'>Share:</p>
                                    <div className='flex items-center gap-6'>
                                        <a className='hover:text-[#FFB400] duration-100 cursor-pointer' href='#'><FaFacebookF/></a>
                                        <a className='hover:text-[#FFB400] duration-100 cursor-pointer' href='#'><FaTwitter/></a>
                                        <a className='hover:text-[#FFB400] duration-100 cursor-pointer' href='#'><FaLinkedinIn/></a>
                                        <a className='hover:text-[#FFB400] duration-100 cursor-pointer' href='#'><FaInstagram/></a>
                                    </div>
                                </div>
                                <div className='py-4 border-gray-200'>
                                    <p className='font-bold text-lg'>Guaranteed Safe Checkout</p>
                                    <div className='bg-white mt-2'>
                                        <img src={PaymentImg} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='px-6 pb-6'>
                            <div className="flex border-b border-gray-300 font-bold text-lg gap-8">
                                <p className={`p-2 border-b-3`}>Description</p>
                            </div>
                            <div className='p-4 text-gray-600 leading-7'>
                                <p >{product?.description}</p>
                                <p className='mt-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at quam a urna fermentum euismod. Nullam non justo vitae odio cursus tincidunt. Sed vel augue at nisi sodales fermentum. Integer euismod, nunc vel congue facilisis, nunc urna aliquet nunc, eu aliquet nunc nunc eu nunc.</p>
                                <p className='mt-4'>Phasellus euismod, nunc vel congue facilisis, nunc urna aliquet nunc, eu aliquet nunc nunc eu nunc. Donec euismod, nunc vel congue facilisis, nunc urna aliquet nunc, eu aliquet nunc nunc eu nunc.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-10 w-1/3 shrink-0">
                        <div className="p-10 pb-4 bg-white">
                            <h1 className="text-xl font-bold border-b border-gray-200 pb-4">Related Products</h1>
                            <div className="flex flex-col">
                                {relatedProducts?.map((rProduct, i)=>
                                    <Link to={`/products/${rProduct._id}`} key={i} className="flex gap-6 items-center py-3 not-last:border-b border-gray-200">
                                        <div className='h-25 aspect-square bg-[#f3f3f3]'>
                                            <Link to={`/products/${rProduct._id}`}>
                                                <img src={rProduct.imgs[0].url.replace('src/assets','/test-images')} className='h-full w-full object-contain' alt={rProduct.imgs[0].altText}/>
                                            </Link>
                                        </div>
                                        <div className='grow flex flex-col gap-2'>
                                            <div className='flex gap-2 text-[#FFB400]'>
                                                {[...Array(5)].map((_, i)=>
                                                    <FaStar key={i}/>
                                                )}
                                            </div>
                                            <p className="capitalize font-bold">{rProduct.title}</p>
                                            <div className='text-[#FFB400] font-bold items-center gap-2 flex text-lg'>
                                                <p >${rProduct.discountPrice||rProduct.basePrice}</p>
                                                {rProduct.discountPrice&&
                                                    <p className='line-through opacity-60 mr-2 text-sm'>${rProduct?.basePrice}</p>
                                                }
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="w-full overflow-hidden shadow-lg">
                            <Link to='#'>
                                <img className="h-full" src="/src/assets/imgs/promo/13.jpg" alt="" />
                            </Link>
                        </div>
                    </div>
                </div>
                </>
            }
        </div>
}

export default ProductPage