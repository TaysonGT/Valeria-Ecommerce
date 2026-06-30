import { useEffect, useRef, useState } from 'react'
import { productType, variantType } from '../../types'
import { Link, useParams } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaShoppingCart, FaStar, FaTwitter } from 'react-icons/fa'
import {Swiper, SwiperSlide} from 'swiper/react'
import { Swiper as SwiperType } from 'swiper'
import {Autoplay, Navigation, Pagination} from 'swiper/modules'
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

    const swiperRef = useRef<SwiperType|null>(null);

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
        <div className='grow bg-[#f3f3f3] flex-col flex font-[Outfit] p-3'>
            {!product?
                <div className='mx-auto py-20 space-y-2'>
                    <h1 className='text-6xl sm:text-8xl font-extrabold text-gray-600'>404</h1>
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-600'>Product Not Found!</h1>
                    <Link className='text-blue-600 text-lg lg:text-xl mt-2 flex items-end' to={'/shop'}>Go back to shopping page <MdNavigateNext className='text-2xl'/></Link>
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
                <div className='flex basis-0 w-full flex-col xl:flex-row gap-3'>
                    <div className='grow bg-white border border-[#d9d9d9] p-6'>
                        <div className='flex flex-col md:flex-row gap-2'>
                            <div className='md:hidden space-y-2 flex justify-between gap-8 flex-wrap gap-y-2'>
                                <div className='flex gap-8 items-center gap-y-2 flex-wrap'>
                                    <h1 className='text-2xl font-bold'>{product.title}</h1>
                                    <div className=' gap-2 text-lg text-[#FFB400] flex md:hidden'>
                                        {[...Array(5)].map((_, i)=>
                                            <FaStar key={i}/>
                                        )}
                                        <p className='text-sm'>(95 Reviews)</p>
                                    </div>
                                </div>
                                
                            </div>
                            <div className='w-full min-w-0 mt-1 md:mt-0'>
                                <div className='h-60 md:h-100 aspect-square w-full border border-[#d3d3d3] bg-[#fcfcfc]'>
                                    <img className='h-full w-full object-contain' src={product?.imgs[selectedImage]?.url} alt={product?.imgs[selectedImage]?.altText} />
                                </div>
                                <div className='sm:w-100 h-24 mt-1 overflow-hidden'>
                                    <Swiper 
                                    spaceBetween={4}
                                    slidesPerView={4}
                                    modules={[Navigation, Pagination, Autoplay]}
                                    loop={true}
                                    navigation={true}
                                    onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
                                    onSlideChange={(swiper: SwiperType) => setSelectedImage(swiper.realIndex)}
                                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                                    className='h-full w-full'>
                                        {product?.imgs.sort((a, b) => Number(a.isPrimary) - Number(b.isPrimary)).map((img, i)=>
                                            <SwiperSlide className='w-24 ' key={i}>
                                                <div className={`h-full border cursor-pointer bg-[#fcfcfc] ${i===selectedImage? 'border-[#FFB400]': 'border-[#d3d3d3]'}`}>
                                                    <img key={i} onClick={()=>setSelectedImage(i)} className={`h-full w-full object-cover`} src={img.url} alt={img.altText} />
                                                </div>
                                            </SwiperSlide>
                                        )}
                                    </Swiper>
                                </div>
                            </div>
                            <div className='grow py-4 lg:py-2 lg:pl-4 pb-0 space-y-4 lg:space-y-2'>
                                <div className=' gap-2 text-lg text-[#FFB400] hidden md:flex'>
                                    {[...Array(5)].map((_, i)=>
                                        <FaStar key={i}/>
                                    )}
                                    <p className='text-sm'>(95 Reviews)</p>
                                </div>
                                
                                <h1 className='text-2xl font-bold hidden md:block'>{product.title}</h1>
                                <div className='items-end gap-2 md:gap-4 font-bold flex'>
                                    <p className='text-3xl md:text-4xl font-bold'>${product.discountPrice||product.basePrice}</p>
                                    {product.discountPrice&& <p className='line-through text-xl md:text-3xl text-[#aaa]'>${product.basePrice}</p>}
                                </div>

                                <p className='text-md text-gray-500'>{product?.description}</p>
                                <div className='flex items-center flex-wrap gap-y-2 gap-4 py-4 border-y border-gray-100'>
                                    <p className='text-gray-600'>Category:</p>
                                    <div className='w-full flex flex-wrap items-center gap-2 font-[Comfortaa] text-sm'>
                                        {product.collections.map((collection)=>
                                            <p key={collection.collectionId} className='capitalize font-bold p-1 px-1.5 rounded-md bg-violet-900 text-white'>{collection.title}</p>
                                        )}
                                        {product.categories.map((category)=>
                                            <p key={category._id} className='capitalize font-bold p-1 px-1.5 rounded-md bg-rose-800 text-white'>{category.name}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className='py-4 space-y-4'>
                                    {!isInCart(product._id) ?
                                    <>
                                        <div className='flex gap-2 items-center flex-wrap'>
                                            <p>Available:</p>
                                            <div className='flex gap-2 items-center flex-wrap'>
                                                {product.variants.map((variant)=>
                                                    <button key={variant._id} onClick={()=>setSelectedVariant(variant)} className={`px-3 py-1 border rounded font-bold text-xs  ${selectedVariant===variant&& 'bg-black text-white'} duration-75 cursor-pointer`}>{variant.sizeCode}</button>
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex flex-wrap gap-4 gap-y-2 text-sm '>
                                            <div className="flex items-stretch">
                                                <button onClick={()=>setQuantity(prev=>Math.max(prev-1,1))} className="border border-gray-200 cursor-pointer p-2 w-10 aspect-square">-</button>
                                                <input onChange={(e)=>setQuantity(parseInt(e.target.value))} className="text-center flex items-center justify-center border border-gray-300 w-10 aspect-square" type="number" min={1} value={quantity} />
                                                <button onClick={()=>setQuantity(prev=>prev+1)} className="border border-gray-200 cursor-pointer p-2 w-10 aspect-square">+</button>
                                            </div>
                                            <button onClick={()=>addToCart(product, quantity, selectedVariant)} className='text-white border-[#FFB400] hover:border-[#071c1f] bg-[#FFB400] z-2 px-4 py-2.5 hover:bg-transparent cursor-pointer hover:text-[#071c1f] border ltr duration-300 text-nowrap flex items-center gap-2 '>
                                                <FaShoppingCart/> 
                                                Add to Cart
                                            </button>
                                        </div>
                                    </>
                                    :
                                        <button onClick={()=>removeFromCart(product._id)} className='text-sm px-4 py-2.5 text-white bg-red-600 border-red-600 hover:bg-transparent cursor-pointer hover:text-black border hover:border-black z-2 before:bg-red-600 rtl duration-300 text-nowrap flex items-center gap-2 '><MdRemoveShoppingCart/> Remove From Cart</button> 
                                    }
                                </div>
                                <div className='flex gap-6 mt-2 px-2 text-sm'>
                                    <button className='flex gap-2 items-center font-bold hover:text-[#FFB400] duration-200 cursor-pointer'><IoHeart className='text-xl'/>Add to Wishlist</button>
                                    <button className='flex gap-2 items-center font-bold hover:text-[#FFB400] duration-200 cursor-pointer'><MdOutlineCompareArrows className='text-xl'/>Compare</button>
                                </div>
                                <div className='py-6 flex items-center gap-4 border-y border-gray-200'>
                                    <p className='text-gray-600'>Share:</p>
                                    <div className='flex items-center gap-6'>
                                        <a className='hover:text-[#FFB400] duration-100 cursor-pointer' href='#'><FaFacebookF/></a>
                                        <a className='hover:text-[#FFB400] duration-100 cursor-pointer' href='#'><FaTwitter/></a>
                                        <a className='hover:text-[#FFB400] duration-100 cursor-pointer' href='#'><FaLinkedinIn/></a>
                                        <a className='hover:text-[#FFB400] duration-100 cursor-pointer' href='#'><FaInstagram/></a>
                                    </div>
                                </div>
                                <div className='py-4 border-gray-200 text-center md:text-start '>
                                    <p className='font-bold text-base lg:text-lg'>Guaranteed Safe Checkout</p>
                                    <div className='bg-white mt-2'>
                                        <img src={PaymentImg} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='pb-4'>
                            <div className="flex border-b border-gray-300 font-bold text-base md:text-lg gap-8">
                                <p className={`p-2 border-b-3`}>Description</p>
                            </div>
                            <div className='p-2 md:p-4 space-y-2 md:space-y-4 text-sm md:text-base text-[#676767] leading-relaxed'>
                                <p >{product?.description}</p>
                                <p className=''>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at quam a urna fermentum euismod. Nullam non justo vitae odio cursus tincidunt. Sed vel augue at nisi sodales fermentum. Integer euismod, nunc vel congue facilisis, nunc urna aliquet nunc, eu aliquet nunc nunc eu nunc.</p>
                                <p className=''>Phasellus euismod, nunc vel congue facilisis, nunc urna aliquet nunc, eu aliquet nunc nunc eu nunc. Donec euismod, nunc vel congue facilisis, nunc urna aliquet nunc, eu aliquet nunc nunc eu nunc.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-10 md:w-115 lg:grow shrink-0">
                        <div className="p-6 pb-4 border border-[#d9d9d9] shadow-md shadow-black/10 bg-white">
                            <h1 className="text-xl font-bold border-b border-gray-200 pb-2 mb-2">Related Products</h1>
                            <div className="flex flex-col">
                                {relatedProducts?.length? 
                                    relatedProducts.map((rProduct, i)=>
                                        <Link to={`/products/${rProduct._id}`} key={i} className="flex gap-4 md:gap-6 items-center py-3 not-last:border-b border-gray-200">
                                            <div className='h-25 aspect-square bg-[#f3f3f3] border border-[#d3d3d3]'>
                                                <img src={rProduct.imgs.find(i=>i.isPrimary)?.url||rProduct.imgs[0].url} className='h-full w-full object-cover' alt={rProduct.imgs[0].altText}/>
                                            </div>
                                            <div className='grow flex flex-col gap-2'>
                                                <div className='flex gap-1 text-[#FFB400]'>
                                                    {[...Array(5)].map((_, i)=>
                                                        <FaStar key={i}/>
                                                    )}
                                                </div>
                                                <p className="capitalize font-bold">{rProduct.title}</p>
                                                {/* <p className="capitalize font-bold">{rProduct.title}</p> */}
                                                <div className='text-[#1f1f1f] font-bold items-center gap-2 flex text-base md:text-lg'>
                                                    <p>${rProduct.discountPrice||rProduct.basePrice}</p>
                                                    {rProduct.discountPrice&&
                                                        <p className='line-through text-[#aaa] mr-2 text-sm'>${rProduct?.basePrice}</p>
                                                    }
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                    :
                                    <div className='py-16 flex items-center justify-center'>
                                        <Loader size={40} thickness={7}/>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                </>
            }
        </div>
}

export default ProductPage