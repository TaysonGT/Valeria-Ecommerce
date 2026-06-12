import React from 'react'
import { IoClose, IoRemoveCircle } from 'react-icons/io5'
import { RiCloseFill } from 'react-icons/ri'
import { useNavigate } from 'react-router'
import { useCart } from '../context/CartContext'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { formatNumber } from '../utils/helpers'

interface Props {
    show: boolean,
    setShow: (arg0: boolean) => void
}

const Cart:React.FC<Props> = ({show, setShow})=>{
    const nav = useNavigate()
    const {total, cartItems, removeFromCart, clearCart, editItemQuantity} = useCart()

    return (
        <div className={`fixed flex flex-col ${!show&&'pointer-events-none'} top-0 h-screen bg-white text-black left-full duration-300 z-110 p-10 sm:w-100 ${show&& '-translate-x-full'}`}>
            <div className='flex flex-col gap-1 border-b border-gray-400 pb-6 relative'>
                <h1 className='text-lg font-bold font-[Playfair]'>Cart</h1>
                <RiCloseFill onClick={()=>setShow(false)} className='text-red-700 hover:text-red-400 duration-150 cursor-pointer text-3xl absolute top-0 right-0'/>
            </div>
            <div className='flex flex-col grow overflow-y-auto relative gap-2 py-3'>
            {cartItems.length>0?
                <>
                <button onClick={clearCart} className='rounded-sm bg-red-600 text-white px-3 py-2 font-bold text-sm self-start cursor-pointer hover:bg-red-400 duration-200 flex items-center gap-2'><IoRemoveCircle className='text-lg'/>Clear</button>
                {cartItems.map(item=>
                <div className='relative py-4 shrink-0 flex items-start shadow-soft text-sm select-none group border-b border-gray-200 overflow-hidden' key={item.product._id}>
                    <div onClick={()=>removeFromCart(item.product._id)} className='absolute top-4 right-0 shadow-md z-200 -translate-1/2 rounded-full bg-white hover:bg-red-500 hover:text-white duration-150 cursor-pointer p-1'><IoClose/></div>
                    <div className='relative w-20 aspect-square rounded-md overflow-hidden shrink-0 bg-[#F2F6F7]'>
                        <img className='w-full h-full object-cover' src={item.product.imgs[0]?.url||'/logo.png'} alt="" />
                    </div>
                    <div className='px-4 grow truncate min-w-0 text-sm'>
                        <p className='text-nowrap font-bold truncate min-w-0'>{item.product.title}</p>
                        <p className='text-nowrap truncate min-w-0'>Size: {item.variant.sizeCode}</p>
                        <div className='flex mt-2'>
                            <button onClick={()=>editItemQuantity(item.product._id, 'increment')} className=' w-6 aspect-square flex items-center justify-center bg-green-500 text-white cursor-pointer'><FaAngleUp/></button>
                            <input type="number" className='w-10 text-center bg-gray-100 outline-none' defaultValue={item.quantity} />
                            <button onClick={()=>editItemQuantity(item.product._id, 'decrement')} className=' w-6 aspect-square flex items-center justify-center bg-red-500 text-white cursor-pointer'><FaAngleDown/></button>
                        </div>
                        <p className='mt-2'>{formatNumber(item.product.discountPrice||item.product.basePrice)} x {item.quantity}</p>
                        <p className=''>Cost: {formatNumber((item.product.discountPrice||item.product.basePrice)*item.quantity)}</p>
                    </div>
                </div>
                )}
                </>:
                <p className='text-center font-[Playfair] text-lg mt-10 text-gray-600'>Your cart is currently empty.</p>
            }
            </div>
            <div className='flex font-bold text-lg py-4 mb-4 border-y border-gray-200 justify-between gap-4'>
                <p>Subtotal:</p>
                <p className='text-[#1f1f1f]'>{formatNumber(total)}</p>
            </div>
            <div className='flex text-nowrap mt-auto gap-4 text-base'>
                <button onClick={()=>{
                    nav('/cart')
                    setShow(false)
                    }} className='flex-1 px-8 py-2.5 font-bold z-0 bg-[#043aff] hover:bg-transparent hover:text-[#071c1f] border border-[#043aff] hover:border-[#071c1f] duration-400 text-white ltr btn cursor-pointer'>View Cart</button>
                <button onClick={()=>{
                    nav('/checkout')
                    setShow(false)
                    }} className='flex-1 px-8 py-2.5 font-bold z-0 hover:bg-transparent bg-[#071c1f] border border-[#071c1f] duration-400 text-white hover:text-[#071c1f] rtl before:bg-[#071c1f] btn cursor-pointer'>Checkout</button>
            </div>
            <p className='mt-4 font-[Playfair]'>Free Shippping on All Orders Over $100!</p>
        </div>
    )
}

export default Cart