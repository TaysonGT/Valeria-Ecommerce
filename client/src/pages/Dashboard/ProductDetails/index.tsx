import Loader from '../../../components/Loader'
import { LuImagePlus } from 'react-icons/lu'
import { TbTrash } from 'react-icons/tb'
import { IoClose, IoCrop, IoInformationCircle, IoTrash } from 'react-icons/io5'
import { MdClose } from 'react-icons/md'
import { HiCheck, HiPlus } from 'react-icons/hi'
import { formatNumber } from '../../../utils/helpers'
import { FiEdit } from 'react-icons/fi'
import AddVariant from './dialogs/AddVariant'
import { useProductDetails } from '../../../hooks/useProduct'
import AddImage from './dialogs/AddImage'
import { Button } from '../../../components/ui/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import {Navigation} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation';


const ProductDetails = () => {
    const {
        product,
        isLoading,
        saving,
        editField,
        editValue,
        showAddVariant,
        showAddImage,
        setEditValue,
        setShowAddVariant,
        setShowAddImage,
        startEdit,
        cancelEdit,
        saveEdit,
        removeCategory,
        removeVariant,
        setPrimaryImage,
        refetch
    } = useProductDetails();


  return (
    isLoading? (
            <div className='h-screen flex justify-center items-center'>
                <Loader size={35} thickness={7}/>
            </div>
        )
        :
        (
        <div className='md:p-10 sm:px-6 px-2 p-6 md:space-y-6 space-y-4 bg-[#fafafa] min-h-screen overflow-x-hidden w-full'>
            <AddVariant {...{
                productId: product?._id,
                show: showAddVariant,
                hide: ()=>setShowAddVariant(false),
                onSave: refetch
            }} />
            
            <AddImage {...{
                productId: product?._id,
                show: showAddImage,
                hide: ()=>setShowAddImage(false),
                onSave: refetch
            }} />

            <div className='px-4'>
                <h1 className='md:text-4xl sm:text-3xl text-2xl font-[Elms_Sans]'>Product Details</h1>
                <p className='md:text-base text-sm mt-2 font-light text-[#777]'>Preview, edit or delete product</p>
            </div>
            <div className='bg-white shadow-xs border border-gray-200 rounded-md md:p-6 p-4 space-y-4 overflow-x-hidden'>
                <div className='flex justify-between items-center gap-4 mb-8 flex-wrap gap-y-2'>
                    <h1 className='md:text-2xl text-xl font-[Elms_Sans]'>Primary Details</h1>
                    <Button onClick={()=>setShowAddImage(true)} variant='primary' className='gap-2 px-3 pl-2.5 py-2.5 items-center md:hidden flex text-sm'>
                        <LuImagePlus className='text-xl'/>
                        Upload
                    </Button>
                </div>
                <div className='w-full flex gap-4 overflow-x-hidden'>
                    <div className='shrink-0 hidden md:block'>
                        <button onClick={()=>setShowAddImage(true)} className="flex flex-col items-center justify-center w-full h-full border border-[#d9d9d9] bg-[#fdfdfd] rounded-lg cursor-pointer px-10">
                            <div className="flex flex-col items-center justify-center text-[#777] pt-5 pb-6">
                                <LuImagePlus className='text-4xl'/>
                                <p className="mb-2 text-sm mt-2">Add image or drag and drop</p>
                                <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                        </button>
                    </div> 
                    <Swiper 
                    slidesPerView="auto"
                    modules={[Navigation]}
                    navigation={true}
                    spaceBetween={15}
                    className='grow min-w-0'>
                        {product?.imgs.map((image, i)=>
                            <SwiperSlide className='flex flex-col rounded-lg border border-[#d9d9d9] bg-[#fdfdfd] w-75! shrink-0! overflow-hidden' key={i}>
                                <img className='object-cover w-full h-60 shrink-0' src={image.url} alt={image.altText}/>
                                <div className='flex justify-between py-3 px-4 bg-[#fdfdfd] border-t border-[#d9d9d9]'>
                                    <div className='flex gap-2 items-center text-sm'>
                                        <input type="radio" onClick={()=>setPrimaryImage(image._id)} defaultChecked={image.isPrimary} className='w-5 h-5' name="main" id="" />
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
                                {/* </div>
                                <div key={i} > */}
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
                <div className='space-y-2 mt-8 pt-6 border-t border-gray-100'>
                    <div className='flex md:gap-6 gap-2 md:flex-row flex-col'>
                        <form onSubmit={saveEdit} className='flex-1'>
                            <label className='block mb-1'>Product Name</label>
                            <div className='relative group'>
                                <span onClick={()=>startEdit('title')} className={`p-2 hover:text-blue-500 text-blue-700 absolute cursor-pointer top-1/2 -translate-y-1/2 text-xl ${editField==='title'?'right-0 opacity-0':'right-2 opacity-100'} duration-150`}><FiEdit className=''/></span>
                                <div className={`flex text-3xl ${editField==='title'&&!saving?'right-2 opacity-100 pointer-events-auto':'opacity-0 pointer-events-none right-0'} absolute top-1/2 -translate-y-1/2 duration-150`}>
                                    <button type='submit'><HiCheck className='text-green-500 hover:text-green-400 cursor-pointer'/></button>
                                    <IoClose onClick={cancelEdit} className='text-red-500 hover:text-red-400 cursor-pointer'/>
                                </div>
                                <Loader className={`absolute top-1/2 -translate-y-1/2 ${(editField==='title'&&saving)?'right-4 opacity-100':'right-0 opacity-0'}`}/>
                                <input onChange={(e)=>setEditValue(e.target.value)} type='text' className={`border mb-3 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5  outline-0 ${editField==='title'&&'focus:ring-indigo-500 focus:border-indigo-500 ring ring-indigo-500'}`} readOnly={editField!=='title'} value={editField==='title'?editValue:product?.title}/>
                            </div>
                        </form>
                        <form onSubmit={saveEdit} className='flex-1'>
                            <label className='block mb-1'>Base Price</label>
                            <div className='relative group'>
                                <span onClick={()=>startEdit('basePrice')} className={`p-2 hover:text-blue-500 text-blue-700 absolute cursor-pointer top-1/2 -translate-y-1/2 text-xl ${editField==='basePrice'?'right-0 opacity-0':'right-2 opacity-100'} duration-150`}><FiEdit className=''/></span>
                                <div className={`flex text-3xl ${editField==='basePrice'&&!saving?'right-2 opacity-100 pointer-events-auto':'opacity-0 pointer-events-none right-0'} absolute top-1/2 -translate-y-1/2 duration-150`}>
                                    <button type='submit'><HiCheck className='text-green-500 hover:text-green-400 cursor-pointer'/></button>
                                    <IoClose onClick={cancelEdit} className='text-red-500 hover:text-red-400 cursor-pointer'/>
                                </div>
                                <Loader className={`absolute top-1/2 -translate-y-1/2 ${(editField==='basePrice'&&saving)?'right-4 opacity-100':'right-0 opacity-0'}`}/>
                                <input onChange={(e)=>setEditValue(e.target.value)} type='number' className={`border mb-3 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5  outline-0 ${editField==='basePrice'&&'focus:ring-indigo-500 focus:border-indigo-500 ring ring-indigo-500'}`} readOnly={editField!=='basePrice'} value={editField==='basePrice'?editValue:product?.basePrice}/>
                            </div>
                        </form>
                    </div>
                    <label className='block'>Description</label>
                    <form onSubmit={saveEdit} className='relative group'>
                        <span onClick={()=>startEdit('description')} className={`p-2 hover:text-blue-500 text-blue-700 absolute cursor-pointer top-2 text-xl ${editField==='description'?'right-0 opacity-0':'opacity-100 right-2 '} duration-150`}><FiEdit className=''/></span>
                        <div className={`flex text-3xl ${editField==='description'&&!saving?'right-2 opacity-100 pointer-events-auto':'opacity-0 pointer-events-none right-0'} absolute top-2 duration-150`}>
                            <button type='submit'><HiCheck className='text-green-500 hover:text-green-400 cursor-pointer'/></button>
                            <IoClose onClick={cancelEdit} className='text-red-500 hover:text-red-400 cursor-pointer'/>
                        </div>
                        <Loader className={`absolute top-4 ${(editField==='description'&&saving)?'right-4 opacity-100':'right-0 opacity-0'}`}/>
                        <textarea onChange={(e)=>setEditValue(e.target.value)} className={`border bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5  outline-0 ${editField==='description'&&'focus:ring-indigo-500 focus:border-indigo-500 ring ring-indigo-500'}`} readOnly={editField!=='description'} value={editField==='description'?editValue:product?.description}/>
                    </form>
                    <div className='flex gap-3 items-center mt-4'>
                        <label className='block'>Categories</label>
                        <button className='px-1 pr-1.5 py-1 border bg-[#00a54a] hover:bg-[#00b150] text-white text-sm rounded-lg flex items-center gap-1 cursor-pointer'><HiPlus/> Add</button>
                    </div>
                    <div className='px-3 py-2.5 border flex bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md focus:ring-indigo-500 outline-0 focus:border-indigo-500 w-full  mb-3 gap-2 overflow-x-auto'>
                        {product?.categories.map(c=>
                            <span key={c._id} className='text-blue-700 flex items-center gap-1 bg-blue-50 rounded p-1 pl-2 border border-blue-700'>
                                {c.name}
                                <MdClose onClick={()=>removeCategory(c._id)} className='cursor-pointer'/>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className=' bg-white p-6 shadow-xs border border-gray-200 '>
                <div className='flex justify-between items-center gap-4 flex-wrap gap-y-2'>
                    <h1 className='md:text-2xl text-xl'>Product Variants</h1>
                    <Button variant='primary' onClick={()=>setShowAddVariant(true)} className='px-4 py-2 border rounded cursor-pointer text-sm'>Add Variant</Button>
                </div>
                <div className='flex gap-4 mt-4 flex-wrap sm:hidden justify-center'>
                    {product?.variants.map(variant=>(
                        <div className='relative p-2 flex-1 border group border-[#c1c1c1] rounded-sm shadow-sm flex flex-col w-full min-[550px]:w-auto' key={variant._id}>
                            <div onClick={()=>removeVariant(variant._id)} className='absolute p-1 px-1.5 pl-2 cursor-pointer flex gap-2 items-center text-sm rounded-md bg-red-500 text-white group-hover:top-2 right-2 top-0 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none duration-150'>
                                <IoTrash className=''/> Remove
                            </div>
                            <div className='p-2 '>
                                <table className='w-full'>
                                    <tbody>
                                        <tr className=''>
                                            <td className='font-bold  px-2 py-1'>Size:</td> 
                                            <td className='text-right px-2 pl-6 py-1'>
                                                {variant.sizeCode}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='font-bold  px-2 py-1'>Adjustment:</td> 
                                            {variant.priceAdjustment?
                                            <td className='text-right px-2 pl-6 py-1'>
                                                {formatNumber(variant.priceAdjustment)}
                                            </td>:
                                            <td className='text-right text-[#6f6f6f] px-2 pl-6 py-1'>
                                                --
                                            </td>
                                            }
                                        </tr>
                                        <tr className=''>
                                            <td className='font-bold  px-2 py-1'>Stock:</td> 
                                            <td className='text-right px-2 pl-6 py-1'>
                                                {variant.inventory.stock}
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <button className='text-sm p-2 rounded-lg border bg-blue-500 text-white font-bold'>
                                More Details
                            </button>
                        </div>
                    ))}
                </div>
                <table className='mt-4 w-full sm:table hidden'>
                    <thead>
                        <tr>
                            <th className='font-bold p-2  border border-[#c1c1c1]'>Size</th>
                            <th className='font-bold p-2  border border-[#c1c1c1]'>Adjustment</th>
                            <th className='font-bold p-2  border border-[#c1c1c1]'>Stock</th>
                            <th className='font-bold p-2  border border-[#c1c1c1]'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    {product?.variants.map(variant=>(
                        <tr className='relative p-2 rounded-sm shadow-sm ' key={variant._id}>
                            
                            <td className='text-center px-2 py-1  border border-[#c1c1c1]'>
                                {variant.sizeCode}
                            </td>
                            <td className='text-center px-2 py-1  border border-[#c1c1c1]'>
                                {variant.priceAdjustment?
                                    formatNumber(variant.priceAdjustment)
                                    :
                                    '--'
                                }
                            </td>
                            <td className='text-center px-2 py-1  border border-[#c1c1c1]'>
                                {variant.inventory.stock}
                            </td>
                            <td className='text-center px-4 py-2 w-[0.1%]  border border-[#c1c1c1]'>
                                <div className='flex gap-2 justify-center'>
                                    <button className='text-sm p-2 rounded-lg border bg-blue-500 text-white font-bold flex items-center gap-2'>
                                        <IoInformationCircle/> Details
                                    </button>
                                    <div onClick={()=>removeVariant(variant._id)} className='p-1 px-1.5 pl-2 cursor-pointer flex gap-2 items-center text-sm rounded-md bg-red-500 text-white duration-150'>
                                        <IoTrash className=''/> Remove
                                    </div>
                                </div>
                            </td>
                        </tr>

                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        )
        
  )
}

export default ProductDetails