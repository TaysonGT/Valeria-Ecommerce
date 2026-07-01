import Loader from '../../../components/Loader'
import { LuImagePlus } from 'react-icons/lu'
import { TbTrash, TbTruckDelivery } from 'react-icons/tb'
import { IoClose, IoCrop, IoTrash } from 'react-icons/io5'
import { MdClose } from 'react-icons/md'
import { HiCheck, HiPlus, HiStar } from 'react-icons/hi'
import { formatNumber } from '../../../utils/helpers'
import { FiEdit, FiShoppingBag, FiTrendingDown, FiTrendingUp } from 'react-icons/fi'
import AddVariant from './dialogs/AddVariant'
import { useProductDetails } from '../../../hooks/useProduct'
import AddImage from './dialogs/AddImage'
import { Button } from '../../../components/ui/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import {Navigation} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation';
import { FaDollarSign, FaEdit } from 'react-icons/fa'
import EditVariant from './dialogs/EditVariant'


const ProductDetails = () => {
    const {
        product,

        isLoading,
        saving,

        editField,
        editValue,
        startEdit,
        cancelEdit,
        saveEdit,

        showAddImage,
        showAddVariant,
        showEditVariant,

        setShowAddVariant,
        setShowEditVariant,
        setShowAddImage,
        setEditValue,
        
        setPrimaryImage,
        setSelectedVariant,
        selectedVariant,
        
        removeCategory,
        removeVariant,
        removeImage,
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
        <div className='md:p-4 p-2 md:space-y-6 space-y-4 bg-[#fafafa] min-h-screen overflow-x-hidden w-full'>
            <AddVariant {...{
                productId: product?._id,
                show: showAddVariant,
                hide: ()=>setShowAddVariant(false),
                onSave: refetch
            }} />
            
            <EditVariant {...{
                productId: product?._id,
                variant: selectedVariant,
                show: showEditVariant&&!!selectedVariant,
                hide: ()=>setShowEditVariant(false),
                onSave: refetch
            }} />
            
            <AddImage {...{
                productId: product?._id,
                show: showAddImage,
                hide: ()=>setShowAddImage(false),
                onSave: refetch
            }} />

            <div className='bg-white shadow-xs border border-[#d3d3d3] md:p-8 md:py-6 rounded-xl p-6 space-y-4 overflow-x-hidden'>
                <h1 className='md:text-3xl text-2xl font-[Elms_Sans]'>Product Details</h1>
                <div className='space-y-2'>
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
                        <button className='px-2 pr-2.5 py-1 border bg-[#00a54a] hover:bg-[#00b150] text-white text-sm rounded-lg flex items-center gap-1 cursor-pointer font-[Sans]'><HiPlus/> Add</button>
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
            <div className='bg-white shadow-xs border border-[#d3d3d3] md:p-8 md:py-6 rounded-xl p-6 space-y-4 overflow-x-hidden'>
                <div className='flex justify-between items-center gap-4 flex-wrap gap-y-2'>
                    <h1 className='md:text-3xl text-2xl font-[Elms_Sans]'>Images</h1>
                    <Button onClick={()=>setShowAddImage(true)} variant='primary' className='gap-2 px-3 pl-2.5 py-2.5 items-center flex text-sm'>
                        <LuImagePlus className='text-xl'/>
                        Upload
                    </Button>
                </div>
                <div className='w-full flex gap-4 overflow-x-hidden'>
                    <Swiper 
                    key={product?.imgs.find(i=>i.isPrimary)?._id}
                    slidesPerView="auto"
                    modules={[Navigation]}
                    navigation={true}
                    spaceBetween={15}
                    className='grow min-w-0'>
                        {product?.imgs.sort((b,a) => Number(a.isPrimary) - Number(b.isPrimary)).map((image, i)=>
                            <SwiperSlide className='flex flex-col rounded-lg border border-[#d9d9d9] bg-[#fdfdfd] w-75! shrink-0! overflow-hidden' key={i}>
                                <img className='object-cover w-full h-60 shrink-0' src={image.url} alt={image.altText}/>
                                <div className='flex justify-between py-3 px-4 bg-[#fdfdfd] border-t border-[#d9d9d9]'>
                                    <div className='flex gap-2 text-sm'>
                                        {/* <input type="radio" onClick={()=>setPrimaryImage(image._id)} defaultChecked={image.isPrimary} className='w-5 h-5' name="main" id="" />
                                        Primary */}
                                        {!image.isPrimary?
                                            <button disabled={saving} onClick={()=>setPrimaryImage(image._id)} className='bg-black hover:bg-[#1f1f1f] p-2 px-3 text-white rounded-md'>
                                                Set Primary
                                            </button>
                                            :
                                            <span className='text-2xl px-3 py-1 border-primary-700 bg-primary-50 border-2 text-primary-600 rounded-xl flex items-center'>
                                                <HiStar/>
                                            </span>
                                        }
                                    </div>
                                    <div className='flex gap-2'>
                                        <button disabled={saving} className='p-1 px-2 text-xl rounded-sm cursor-pointer border border-[#1f1f1f] bg-[#f9f9f9] text-[#1f1f1f]'>
                                            <IoCrop/>
                                        </button>
                                        <button disabled={saving} onClick={()=>removeImage(image._id)} className='p-1 px-2 text-xl rounded-sm cursor-pointer border text-white border-red-500 bg-red-500'>
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
            </div>
            <div className='flex flex-col gap-4 bg-white md:p-8 md:py-6 rounded-xl p-6 shadow-xs border border-[#d3d3d3] '>
                <div className='flex justify-between items-center gap-4 flex-wrap gap-y-2'>
                    <h1 className='md:text-3xl text-2xl font-[Elms_Sans]'>Variants</h1>
                    <Button variant='primary' onClick={()=>setShowAddVariant(true)} className='px-4 py-2.5 border rounded cursor-pointer text-sm bg-primary-600 hover:bg-primary-500'>Add Variant</Button>
                </div>
                <div className='flex gap-4  flex-wrap sm:hidden justify-center'>
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
                <div className='sm:block hidden border border-[#c1c1c1] bg-[#434b61] overflow-hidden'>
                    <table className='w-full'>
                        <thead>
                            <tr className='text-white '>
                                <th className='font-bold p-2'>Size</th>
                                <th className='font-bold p-2'>Adjustment</th>
                                <th className='font-bold p-2'>Stock</th>
                                <th className='font-bold p-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        {product?.variants.map(variant=>(
                            <tr className='relative p-2 rounded-sm not-last:border-b bg-[#f8faff] odd:bg-[#fdfeff] border-[#c1c1c1]' key={variant._id}>
                                
                                <td className='text-center px-2 py-1'>
                                    {variant.sizeCode}
                                </td>
                                <td className='text-center px-2 py-1'>
                                    {variant.priceAdjustment?
                                        formatNumber(variant.priceAdjustment)
                                        :
                                        '--'
                                    }
                                </td>
                                <td className='text-center px-2 py-1'>
                                    {variant.inventory.stock}
                                </td>
                                <td className='text-center px-4 py-2 w-[0.1%]'>
                                    <div className='flex gap-2 justify-center'>
                                        <button onClick={()=>{
                                          setSelectedVariant(variant)
                                          setShowEditVariant(true)
                                        }} className='text-sm p-1 px-3 pr-3 cursor-pointer rounded-lg border bg-primary-500 text-white font-bold flex items-center gap-2'>
                                            <FaEdit/> Edit
                                        </button>
                                        <button onClick={()=>removeVariant(variant._id)} className='p-1 px-2 pr-3 cursor-pointer flex gap-2 items-center text-sm rounded-md bg-red-500 text-white duration-150'>
                                            <IoTrash className=''/> Remove
                                        </button>
                                    </div>
                                </td>
                            </tr>

                        ))}
                        </tbody>
                    </table>
                </div>
                <Button variant='danger' className='cursor-pointer self-end'>
                    Reset Stock
                </Button>
            </div>
            <div className='bg-white shadow-xs border border-[#d3d3d3] md:p-8 md:py-6 rounded-xl p-6 space-y-4 overflow-x-hidden'>
                <h1 className='md:text-3xl text-2xl font-[Elms_Sans]'>Lifecycle</h1>
                <div className='flex gap-2 flex-wrap '>
                    <div className="bg-white rounded-xl shadow-sm shadow-black/10 p-6 border border-[#e9e9e9]">
                        <div className="flex justify-between items-end gap-4 flex-wrap-reverse">
                            <div>
                                <p className="text-sm text-gray-500">Outgoing Orders</p>
                                <p className="text-2xl font-bold mt-1">3</p>
                                <p className="text-sm text-gray-500 mt-2">Avg Order: {formatNumber(40.65)}</p>
                            </div>
                            <div className="p-3 bg-purple-50 border-purple-300 border rounded-lg">
                                <TbTruckDelivery className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm shadow-black/10 p-6 border border-[#e9e9e9]">
                        <div className="flex justify-between items-end gap-4 flex-wrap-reverse">
                            <div>
                                <p className="text-sm text-gray-500">Total Orders</p>
                                <p className="text-2xl font-bold mt-1">38</p>
                                <p className="text-sm text-gray-500 mt-2">Avg Order: {formatNumber(46.65)}</p>
                            </div>
                            <div className="p-3 bg-green-50 border-green-300 border rounded-lg">
                                <FiShoppingBag className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm shadow-black/10 p-6 border border-[#e9e9e9]">
                        <div className="flex justify-between items-end gap-4 flex-wrap-reverse">
                            <div>
                                <p className="text-sm text-gray-500">Total Revenue</p>
                                <p className="text-2xl font-bold mt-1">{formatNumber(1679.34)}</p>
                                <div className={`flex items-center gap-1 mt-2 text-sm ${true ? 'text-green-600' : 'text-red-600'}`}>
                                {true ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                                <span>{Math.abs(34.32)}% vs last period</span>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 border-blue-300 border rounded-lg">
                                <FaDollarSign className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-8 pt-6 border-t border-[#d9d9d9] space-y-4'>
                    <div className='flex gap-4 items-center'>
                        <h3 className='text-xl font-[Elms_Sans]'>Publication Status</h3>
                        <p className={`p-1 px-3 rounded-lg text-base border inline-block capitalize font-semibold ${product?.publicationStatus==='active'?'bg-green-50 text-green-600 border-green-300':'bg-amber-50 text-amber-600 border-amber-600'}`}>{product?.publicationStatus}</p>
                    </div>
                    <div className='flex flex-col gap-2 items-start'>
                        {
                            product?.publicationStatus==='active'?
                            <Button className='cursor-pointer bg-mist-600 hover:bg-mist-500 text-white'>
                                Deactivate Product
                            </Button>
                            :
                            <Button className='cursor-pointer bg-green-600 hover:bg-green-500'>
                                Activate Product
                            </Button>
                        }
                    </div>
                </div>
                <div className='pt-6 mt-8 border-t border-[#d9d9d9] space-y-4'>
                    <div className='flex gap-4 items-center'>
                        <h3 className='text-xl font-[Elms_Sans]'>Actions</h3>
                    </div>
                    <div className='flex gap-4 flex-col items-start'>
                        
                        <Button variant='danger' className='cursor-pointer'>
                            Delete Product
                        </Button>
                        <p className='text-sm font-bold text-red-600'>Make sure this product is not included in any current order before deleting.</p>
                    </div>
                </div>
            </div>
        </div>
        )
        
  )
}

export default ProductDetails