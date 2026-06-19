import React, { useState } from 'react'
import { Modal } from '../../../../components/ui/Modal'
import { Button } from '../../../../components/ui/Button'
import { HiPlus, HiTrash } from 'react-icons/hi'
import { FiUploadCloud } from 'react-icons/fi'
import { IoClose, IoTrash } from 'react-icons/io5'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

interface Variant {
  id: string
  sizeCode: string
  priceAdjustment?: number
  stock?: number
}

interface AddProductProps {
  show: boolean
  hide: () => void
  onSave?: (payload: any) => Promise<any> | any
}

const emptyVariant = (): Variant => ({ id: String(Date.now()) + Math.random().toString(36).slice(2), sizeCode: '', priceAdjustment: 0, stock: 0 })

const AddProduct: React.FC<AddProductProps> = ({ show, hide, onSave }) => {
  const [title, setTitle] = useState('')
  const [basePrice, setBasePrice] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [categoryInput, setCategoryInput] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [variants, setVariants] = useState<Variant[]>([emptyVariant()])
  const [saving, setSaving] = useState(false)
  
  const nav = useNavigate()

  const addCategory = () => {
    const val = categoryInput.trim()
    if (!val) return
    if (!categories.includes(val)) setCategories(prev => [...prev, val])
    setCategoryInput('')
  }

  const removeCategory = (c: string) => setCategories(prev => prev.filter(x => x !== c))

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const arr = Array.from(files)
    setImages(prev => [...prev, ...arr])
    const newPreviews = arr.map(f => URL.createObjectURL(f))
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => setVariants(prev => [...prev, emptyVariant()])
  
  const updateVariant = (id: string, patch: Partial<Variant>) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v))
  }

  const removeVariant = (id: string) => setVariants(prev => prev.filter(v => v.id !== id))

  const resetForm = () => {
    setTitle('')
    setBasePrice('')
    setDescription('')
    setCategories([])
    setCategoryInput('')
    setImages([])
    setImagePreviews([])
    setVariants([emptyVariant()])
  }

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const payload = {
      title,
      basePrice: typeof basePrice === 'number' ? basePrice : Number(basePrice || 0),
      description,
      categories,
      // images: images (File[]) - caller should handle upload / multipart
      variants: variants.map(v => ({ sizeCode: v.sizeCode, priceAdjustment: v.priceAdjustment || 0, inventory: { stock: v.stock || 0 } })),
      publicationStatus: 'active'
    }

    try {
      setSaving(true)
      if (onSave) {
        // onSave is responsible for calling the API and handling files if required
        await onSave({ ...payload, _images: images })
      } else {
        // Example axios template (commented):
        const form = new FormData()
        form.append('title', payload.title)
        form.append('basePrice', String(payload.basePrice))
        form.append('description', payload.description)
        payload.categories.forEach(c => form.append('categories[]', c))
        payload.variants.forEach(c => form.append('variants[]', JSON.stringify(c)))
        images.forEach((f) => form.append('images', f))
        
        axios.post('/products', form, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(({data})=>{
            if(!data.success){
                return toast.error(data.message)
            }
            toast.success(data.message)
            nav(`/dashboard/products/${data.product._id}`)
        }).catch(error=>
            toast.error(error.response.data.message)
        ).finally(()=>setSaving(false))

        console.warn('onSave not provided - payload prepared:', payload)
      }

      resetForm()
      hide()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={show} onClose={hide} title="Add Product" size="lg">
      <form onSubmit={submit} className='space-y-4 font-[Sans]'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block mb-1'>Product Name</label>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} className='border rounded-md w-full px-3 py-2' />
          </div>
          <div>
            <label className='block mb-1'>Base Price</label>
            <input value={basePrice as any} onChange={(e)=>setBasePrice(e.target.value ? Number(e.target.value) : '')} type='number' className='border rounded-md w-full px-3 py-2' />
          </div>
        </div>

        <div>
          <label className='block mb-1'>Description</label>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className='border rounded-md w-full px-3 py-2 min-h-25'></textarea>
        </div>

        <div>
          <label className='block mb-1'>Categories</label>
          <div className='flex gap-2 mb-2'>
            <input value={categoryInput} onChange={(e)=>setCategoryInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); addCategory() } }} className='border rounded-md px-3 py-2 grow w-20' placeholder='Type category and press Enter' />
            <Button type='button' variant='outline' className='pl-2 text-sm'  onClick={addCategory} icon={<HiPlus/>}>Add</Button>
          </div>
          <div className='flex gap-2 flex-wrap'>
            {categories.map((c)=> (
              <span key={c} className='px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded flex items-center gap-2'>
                {c}
                <button type='button' onClick={()=>removeCategory(c)} className='text-red-500'><HiTrash/></button>
              </span>
            ))}
          </div>
        </div>

        <div>
            <div className='flex justify-between gap-4 items-center flex-wrap gap-y-2'>
                <label className='block '>Images</label>
                <label className="relative inline-flex gap-2 items-center cursor-pointer text-white bg-primary-600 hover:bg-primary-500 box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md text-sm px-4 py-2 pl-3 focus:outline-none pointer-cursor">
                    <input type="file" onChange={handleImageChange} className='w-full h-full absolute top-0 left-0 -z-1 opacity-0' />
                    <FiUploadCloud className='text-xl'/>
                    <p className="text-sm">Upload</p>
                </label>
            </div>
            {/* <input type='file' accept='image/*' className='cursor-pointer border rounded p-2 px-3 focus:ring-brand focus:border-brand block w-full shadow-xs' multiple onChange={handleImageChange} />             */}
            {/* {
            images.length<1&&
            <div className="flex items-center justify-center w-full">
                <div className="flex flex-col items-center justify-center w-full h-40 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base">
                    {
                        images.length<1?

                        <div className="flex flex-col items-center justify-center text-body pt-5 pb-6 relative">
                            <label className="inline-flex gap-2 items-center cursor-pointer text-white bg-primary-600 hover:bg-primary-500 box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md text-sm px-4 py-2 pl-3 focus:outline-none pointer-cursor">
                                <input type="file" onChange={handleImageChange} className='w-full h-full absolute top-0 left-0 -z-1' />
                                <FiUploadCloud className='text-4xl'/>
                                <p className="text-sm">Upload Images</p>
                            </label>
                        </div>
                        :
                        <label className="relative flex flex-col items-center justify-center w-full h-full border border-[#d9d9d9] bg-[#fdfdfd] rounded-lg cursor-pointer px-10">
                            <input type="file" onChange={handleImageChange} className='w-full h-full absolute top-0 left-0 -z-1' />
                            <div className="flex flex-col items-center justify-center text-[#777] pt-5 pb-6">
                                <LuImagePlus className='text-4xl'/>
                                <p className="mb-2 text-sm mt-2">Add image or drag and drop</p>
                                <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                        </label>
                    }
                </div>
            </div>} */}

            <div className='flex gap-2 mt-2.5 p-2 flex-wrap border border-[#d3d3d3] border-dashed rounded-lg'>
                {!imagePreviews?.length?
                <div className='text-[#939393] text-center w-full py-4'>
                    No images
                </div>

                :
                imagePreviews.map((p, i)=> (
                <div key={p} className='relative w-28 h-28 border rounded overflow-hidden'>
                    <img src={p} alt='' className='object-contain w-full h-full' />
                    <button type='button' onClick={()=>removeImage(i)} className='absolute hover:bg-red-500 hover:text-white rounded-full cursor-pointer top-1 right-1 bg-white/80 px-1 text-sm text-red-600'><IoClose/></button>
                </div>
                ))}
            </div>
        </div>

        <div>
          <div className='flex justify-between items-center mb-2'>
            <label className='block'>Variants</label>
            <Button type='button' variant='outline' className='pl-2 text-sm' onClick={addVariant} icon={<HiPlus/>}>Add Variant</Button>
          </div>
          <div className='space-y-2'>
            {variants.map(v=> (
              <div key={v.id} className='flex gap-2 items-center'>
                <div className='flex-1'>
                    <p className='text-sm text-nowrap'>Size Code</p>
                    <input value={v.sizeCode} onChange={(e)=>updateVariant(v.id, { sizeCode: e.target.value })} placeholder='Size code' className='border rounded px-2 py-1 w-full' />
                </div>
                <div className='flex-1'>
                    <p className='text-sm text-nowrap'>Price Adjustment</p>
                    <input type='number' value={v.priceAdjustment as any} onChange={(e)=>updateVariant(v.id, { priceAdjustment: Number(e.target.value) })} placeholder='Price adj' className='border rounded px-2 py-1 w-full' />
                </div>
                <div className='flex-1'>
                    <p className='text-sm text-nowrap'>Stock</p>
                    <input type='number' value={v.stock as any} onChange={(e)=>updateVariant(v.id, { stock: Number(e.target.value) })} placeholder='Stock' className='border rounded px-2 py-1 w-full' />
                </div>
                <button type='button' onClick={()=>removeVariant(v.id)} disabled={variants.length<=1} className={`text-white bg-red-600 hover:bg-red-500 py-2 px-3 rounded-md shrink disabled:cursor-not-allowed disabled:bg-[#989898] cursor-pointer self-end`}>
                    <IoTrash/>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='flex gap-2 justify-end'>
          <Button type='button' variant='ghost' onClick={hide}>Cancel</Button>
          <Button type='submit' variant='primary' disabled={saving}>{saving? 'Saving...' : 'Create Product'}</Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddProduct
