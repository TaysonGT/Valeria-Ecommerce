import { useEffect, useState } from 'react'
import { productType } from '../../../types'
import { useParams } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../../../components/Loader'
import { LuImagePlus } from 'react-icons/lu'
import { TbTrash } from 'react-icons/tb'
import { IoCrop } from 'react-icons/io5'
import { MdClose } from 'react-icons/md'
import { HiPlus } from 'react-icons/hi'
import { FaPlus } from 'react-icons/fa'
import { formatNumber } from '../../../utils/helpers'

const ProductDetails = () => {
    const [product, setProduct] = useState<productType>()
    const [isLoading,setIsLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const {productId} = useParams()

    const fetchProduct = async()=>{
        setIsLoading(true)
        setSelectedImage(0)

        await axios.get(`/products/${productId}`)
        .then(({data})=>{
            setProduct(data.product)
        }).catch(({response: {data}})=>{
            toast.error(data.message)
            console.log(data)
        }).finally(()=>setIsLoading(false))
    }
    
    useEffect(()=>{
        fetchProduct()
    },[productId])

  return (
    isLoading? (
            <div className='h-screen flex justify-center items-center'>
                <Loader size={35} thickness={7}/>
            </div>
        )
        :
        (
        <div className='p-10 px-6 space-y-6 bg-[#fafafa] min-h-screen'>
            <div className='px-4'>
                <h1 className='text-4xl font-[Elms_Sans]'>Product Details</h1>
                <p className='mt-2 font-light text-gray-600'>Preview, edit or delete product</p>
            </div>
            <div className='bg-white shadow-md rounded-md p-6 space-y-4'>
                <h1 className='text-2xl font-[Elms_Sans] mb-8'>Main Details</h1>
                <div className='flex gap-3 w-full overflow-y-auto bg-white rounded-md'>
                    <div className="flex items-center justify-center">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full border border-gray-300 bg-gray-50 rounded-lg cursor-pointer px-10">
                            <div className="flex flex-col items-center justify-center text-gray-600 pt-5 pb-6">
                                <LuImagePlus className='text-4xl'/>
                                <p className="mb-2 text-sm mt-2">Add image or drag and drop</p>
                                <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div> 
                    {product?.imgs.map((image, i)=>
                    <div key={i} className='flex flex-col rounded-lg overflow-hidden border border-gray-300 bg-[#f3f3f3] w-80'>
                        <img className='object-cover w-full h-60 shrink-0' src={image.url} alt={image.altText}/>
                        <div className='flex justify-between py-3 px-4 bg-[#f7f7f7] border-t border-gray-300'>
                            <div className='flex gap-2 items-center text-sm'>
                                <input type="radio" defaultChecked={image.isPrimary} className='w-5 h-5' name="main" id="" />
                                Primary
                            </div>
                            <div className='flex gap-2'>
                                <button className='p-1 text-xl rounded-sm cursor-pointer border text-indigo-500 border-indigo-500'>
                                    <IoCrop/>
                                </button>
                                <button className='p-1 text-xl rounded-sm cursor-pointer border text-red-500 border-red-500'>
                                    <TbTrash/>
                                </button>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
                <div className='space-y-2 mt-8 pt-6 border-t border-gray-100'>
                    <div className='flex gap-6'>
                        <div className='flex-1'>
                            <label className='block mb-1'>Product Name</label>
                            <input className='border mb-3 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2.5 shadow-xs' readOnly value={product?.title}/>
                        </div>
                        <div className='flex-1'>
                            <label className='block mb-1'>Base Price</label>
                            <input className='border mb-3 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2.5 shadow-xs' readOnly value={product?.basePrice}/>
                        </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <label className='block'>Categories</label>
                        <button className='px-2 pr-3 py-1.5 border bg-[#00a54a] hover:bg-[#00b150] text-white text-base rounded-lg flex items-center gap-1 cursor-pointer'><HiPlus/> Add</button>
                    </div>
                    <div className='px-3 py-2.5 border flex bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-xs mb-3 gap-2 overflow-x-auto'>
                        {product?.categories.map(c=>
                            <span className='text-blue-700 flex items-center gap-1 bg-blue-50 rounded p-1 pl-2 border border-blue-700'>
                                {c.name}
                                <MdClose className='cursor-pointer'/>
                            </span>
                        )}
                    </div>
                    <label className='block mt-4'>Description</label>
                    <textarea className='border bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2.5 shadow-xs' readOnly value={product?.description}/>
                </div>
            </div>
            <div className=' bg-white p-6 shadow-md'>
                <div className='flex justify-between'>
                    <h1 className='text-2xl'>Product Variants</h1>
                    <button className='px-4 py-2 border rounded'>Preivew</button>
                </div>
                <div className='flex gap-4 mt-4'>
                    {product?.variants.map(variant=>(
                        <div className='p-4 py-6 border border-[#c1c1c1] rounded-md' key={variant._id}>
                            <div className='grid grid-cols-[1fr_1fr] gap-3'>
                                <span className='font-light'>Size:</span> 
                                <span className='text-center'>
                                    {variant.sizeCode}
                                </span>
                            </div>
                            <div className='grid grid-cols-[1fr_1fr] gap-3'>
                                <span className='font-light'>Adjustment:</span> 
                                <span className='text-center'>
                                    {variant.priceAdjustment?formatNumber(variant.priceAdjustment):'-'}
                                </span>
                            </div>
                            <div className='grid grid-cols-[1fr_1fr] gap-3'>
                                <span className='font-light'>Stock:</span> 
                                <span className='text-center'>
                                    {variant.inventory.stock}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        )
        
  )
}

export default ProductDetails