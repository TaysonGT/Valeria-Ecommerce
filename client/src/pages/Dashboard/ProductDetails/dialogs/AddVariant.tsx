import React, { ChangeEvent, useState } from 'react'
import { Modal } from '../../../../components/ui/Modal';
import { variantType } from '../../../../types';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Props{
    show: boolean;
    hide: ()=>void;
    onSave: ()=>void;
    productId?: string;
}

const AddVariant:React.FC<Props> = ({show, hide, onSave, productId}) => {
    const [formData,setFormData] = useState<Omit<variantType,'_id'>>({
        sizeCode: '',
        priceAdjustment: 0,
        inventory:{
            barcode: '',
            reserved: 0,
            stock: 0,
            warehouseLocation: ''
        }
    })

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            const numericChild = ['priceAdjustment', 'reserved', 'stock', 'quantity'].includes(child);
            
            setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent as keyof typeof prev] as any,
                [child]: numericChild ? parseFloat(value) : value
            }
            }));
        } else {
            const numericFields = ['priceAdjustment', 'reserved', 'stock'];
            setFormData(prev => ({
            ...prev,
            [name]: numericFields.includes(name) ? parseFloat(value) : value
            }));
        }
    };

    const submitHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!productId) return;
        console.log(productId)
        axios.post(`/products/${productId}/variants`, formData)
        .then(({data})=>{
            if(data.success){
                toast.success(data.message)
                hide()
                onSave()
            }else{
                toast.error(data.error)
            }
        }).catch(error=>{
            toast.error(error.response.data.message)
        })
    };

  return (
    <Modal isOpen={show} onClose={hide} title='Add Variant' size='xl'>
        <form className='' onSubmit={submitHandler}>
            <label className='block mb-1'>Size Code</label>
            <input onChange={inputHandler}  name='sizeCode' type='string' className={`border mb-3 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5 shadow-xs outline-0`} />
            <label className='block mb-1'>Price Adjustment</label>
            <input onChange={inputHandler} name='priceAdjustment' type='number' className={`border mb-3 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5 shadow-xs outline-0`} />
            <label className='block mb-1'>Barcode</label>
            <input onChange={inputHandler} name='inventory.barcode' type='number' className={`border mb-3 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5 shadow-xs outline-0`} />
            <label className='block mb-1'>Reserved</label>
            <input onChange={inputHandler} name='inventory.reserved' type='number' className={`border mb-3 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5 shadow-xs outline-0`} />
            <label className='block mb-1'>Stock</label>
            <input onChange={inputHandler}  name='inventory.stock' type='number' className={`border mb-3 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5 shadow-xs outline-0`} />
            <label className='block mb-1'>Warehouse Location</label>
            <input onChange={inputHandler} name='inventory.warehouseLocation' type='string' className={`border mb-6 bg-[#fcfcfc] border-gray-300 text-base text-[#1f1f1f] rounded-md block w-full px-3 py-2.5 shadow-xs outline-0`} />
            <div className='flex gap-2 justify-end'>
                <button type='submit' className='px-3 py-2 cursor-pointer border bg-blue-600 text-white rounded-md'>Save</button>
                <button onClick={hide} className='px-3 py-2 cursor-pointer border border-[#5f5f5f] text-[#5f5f5f] rounded-md'>Cancel</button>
            </div>
        </form>
    </Modal>
  )
}

export default AddVariant