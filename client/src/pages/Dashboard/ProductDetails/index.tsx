import Loader from '../../../components/Loader'
import { LuImagePlus } from 'react-icons/lu'
import { TbTrash } from 'react-icons/tb'
import { IoClose, IoCrop, IoTrash } from 'react-icons/io5'
import { MdClose } from 'react-icons/md'
import { HiCheck, HiPlus } from 'react-icons/hi'
import { formatNumber } from '../../../utils/helpers'
import { FiEdit } from 'react-icons/fi'
import AddVariant from './dialogs/AddVariant'
import { useProductDetails } from '../../../hooks/useProduct'
import AddImage from './dialogs/AddImage'

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
        <div className='p-10 px-6 space-y-6 bg-[#fafafa] min-h-screen'>
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
                <h1 className='text-4xl font-[Elms_Sans]'>Product Details</h1>
                <p className='mt-2 font-light text-gray-600'>Preview, edit or delete product</p>
            </div>
            <div className='bg-white shadow-xs border border-gray-200 rounded-md p-6 space-y-4'>
                <h1 className='text-2xl font-[Elms_Sans] mb-8'>Primary Details</h1>
                <div className='flex gap-3 w-full overflow-y-auto bg-white rounded-md'>
                    <div className="flex items-center justify-center">
                        <button onClick={()=>setShowAddImage(true)} className="flex flex-col items-center justify-center w-full h-full border border-gray-300 bg-gray-50 rounded-lg cursor-pointer px-10">
                            <div className="flex flex-col items-center justify-center text-gray-600 pt-5 pb-6">
                                <LuImagePlus className='text-4xl'/>
                                <p className="mb-2 text-sm mt-2">Add image or drag and drop</p>
                                <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            {/* <button  className="hidden" /> */}
                        </button>
                    </div> 
                    {product?.imgs.map((image, i)=>
                    <div key={i} className='flex flex-col rounded-lg overflow-hidden border border-gray-300 bg-[#f3f3f3] w-80'>
                        <img className='object-cover w-full h-60 shrink-0' src={image.url} alt={image.altText}/>
                        <div className='flex justify-between py-3 px-4 bg-[#f7f7f7] border-t border-gray-300'>
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
                    </div>
                    )}
                </div>
                <div className='space-y-2 mt-8 pt-6 border-t border-gray-100'>
                    <div className='flex gap-6'>
                        <form onSubmit={saveEdit} className='flex-1'>
                            <label className='block mb-1'>Product Name</label>
                            <div className='relative group'>
                                <span onClick={()=>startEdit('title')} className={`p-2 hover:text-blue-500 text-blue-700 absolute cursor-pointer top-1/2 -translate-y-1/2 text-xl ${editField==='title'?'right-0 opacity-0':'right-2 opacity-100'} duration-150`}><FiEdit className=''/></span>
                                <div className={`flex text-3xl ${editField==='title'&&!saving?'right-2 opacity-100 pointer-events-auto':'opacity-0 pointer-events-none right-0'} absolute top-1/2 -translate-y-1/2 duration-150`}>
                                    <button type='submit'><HiCheck className='text-green-500 hover:text-green-400 cursor-pointer'/></button>
                                    <IoClose onClick={cancelEdit} className='text-red-500 hover:text-red-400 cursor-pointer'/>
                                </div>
                                <Loader className={`absolute top-1/2 -translate-y-1/2 ${(editField==='title'&&saving)?'right-4 opacity-100':'right-0 opacity-0'}`}/>
                                <input onChange={(e)=>setEditValue(e.target.value)} type='text' className={`border mb-3 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5 shadow-xs outline-0 ${editField==='title'&&'focus:ring-indigo-500 focus:border-indigo-500 ring ring-indigo-500'}`} readOnly={editField!=='title'} value={editField==='title'?editValue:product?.title}/>
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
                                <input onChange={(e)=>setEditValue(e.target.value)} type='number' className={`border mb-3 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5 shadow-xs outline-0 ${editField==='basePrice'&&'focus:ring-indigo-500 focus:border-indigo-500 ring ring-indigo-500'}`} readOnly={editField!=='basePrice'} value={editField==='basePrice'?editValue:product?.basePrice}/>
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
                        <textarea onChange={(e)=>setEditValue(e.target.value)} className={`border bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5 shadow-xs outline-0 ${editField==='description'&&'focus:ring-indigo-500 focus:border-indigo-500 ring ring-indigo-500'}`} readOnly={editField!=='description'} value={editField==='description'?editValue:product?.description}/>
                    </form>
                    <div className='flex gap-3 items-center mt-4'>
                        <label className='block'>Categories</label>
                        <button className='px-1 pr-1.5 py-1 border bg-[#00a54a] hover:bg-[#00b150] text-white text-sm rounded-lg flex items-center gap-1 cursor-pointer'><HiPlus/> Add</button>
                    </div>
                    <div className='px-3 py-2.5 border flex bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md focus:ring-indigo-500 outline-0 focus:border-indigo-500 w-full shadow-xs mb-3 gap-2 overflow-x-auto'>
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
                <div className='flex justify-between'>
                    <h1 className='text-2xl'>Product Variants</h1>
                    <button onClick={()=>setShowAddVariant(true)} className='px-4 py-2 border rounded cursor-pointer'>Add</button>
                </div>
                <div className='flex gap-4 mt-4'>
                    {product?.variants.map(variant=>(
                        <div className='relative p-2 border group border-[#c1c1c1] rounded-sm shadow-lg flex flex-col' key={variant._id}>
                            <div onClick={()=>removeVariant(variant._id)} className='absolute p-1 px-1.5 pl-2 cursor-pointer flex gap-2 items-center text-sm rounded-md bg-red-500 text-white group-hover:top-2 right-2 top-0 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none duration-150'>
                                <IoTrash className=''/> Remove
                            </div>
                            <div className='p-2'>
                                <table className=''>
                                    <tbody>
                                        <tr className=''>
                                            <td className='font-bold  px-2 py-1'>Size:</td> 
                                            <td className='text-center  px-2 py-1'>
                                                {variant.sizeCode}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='font-bold  px-2 py-1'>Adjustment:</td> 
                                            {variant.priceAdjustment?
                                            <td className='text-center  px-2 py-1'>
                                                {formatNumber(variant.priceAdjustment)}
                                            </td>:
                                            <td className='text-center text-[#6f6f6f]  px-2 py-1'>
                                                --
                                            </td>
                                            }
                                        </tr>
                                        <tr className=''>
                                            <td className='font-bold  px-2 py-1'>Stock:</td> 
                                            <td className='text-center  px-2 py-1'>
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
            </div>
        </div>
        )
        
  )
}

export default ProductDetails