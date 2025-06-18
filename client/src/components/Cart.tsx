import React, { useEffect, useState } from 'react'

interface Props {
    show: boolean,
    setShow: (arg0: boolean) => void
}


const list = [
    {
        id: '132145646',
        name: "RFC Drip Hoodie - Red",
        description: "Lorem ipsum dolor sit amet.",
        price: 499,
        oldPrice: 599,
        quantity: 2,
        img: 'src/assets/1.jpg',
        feature: {
            name: "Sale 50%",
            color: "red"
        }
    },
    {
        id: '132456789',
        name: "RFC Drip Sweatshirt - Rose",
        description: "Lorem ipsum dolor sit amet.",
        price: 599,
        quantity: 1,
        oldPrice: 799,
        img: 'src/assets/2.jpg',
        feature: {
            name: "Sale 50%",
            color: "red"
        },
    },
]

const Cart:React.FC<Props> = ({show, setShow})=>{
    const [cartItems, setCartItems] = useState<typeof list>([])

    const handleEditItem = (e:React.MouseEvent<HTMLButtonElement>)=>{
    }
    
    const handleRemoveItem = (e:React.MouseEvent<HTMLButtonElement>, id:string)=>{
        setCartItems(prev=> prev.filter(item=>item.id!=id))
    }

    useEffect(()=>{
        setCartItems(list)
    },[])

    return (
        <div className={`fixed flex flex-col h-screen bg-white text-black left-full duration-300 z-[200] px-6 py-8 w-[300px] ${show&& '-translate-x-full'}`}>
            <div className='flex flex-col gap-1 border-b-1 border-gray-400 pb-1 '>
                <h1 className='text-lg font-bold'>Shopping Cart</h1>
                <p className='text-gray-800 font-light'>{list.length} Items</p>
            </div>
            <div className='flex flex-col gap-2 py-3'>
                {cartItems.map(item=>
                <div className='relative h-[80px] flex shadow-soft rounded overflow-hidden text-sm select-none group' key={item.id}>
                    <div className='text-xs absolute bottom-3 right-3 flex flex-col gap-1'>
                        <button
                            onClick={handleEditItem}
                            className='duration-200 px-1 hover:text-white hover:bg-green-600 text-green-600 border border-green-600 cursor-pointer'>Edit</button>
                        <button 
                            onClick={(e)=>handleRemoveItem(e, item.id)} 
                            className='duration-200 px-1 hover:text-white hover:bg-red-500 text-red-500 border border-red-500 cursor-pointer'>Remove</button>
                    </div>
                    <img className='h-full w-1/6 object-cover' src={item.img} alt="" />
                    <div className='py-2 px-6 overflow-hidden grow'>
                        <p className='text-nowrap overflow-x-hidden'>{item.name}</p>
                        <p className=''>Size: XL</p>
                        <p className=''>Price: ${item.price}</p>
                    </div>
                </div>
                )}
            </div>
            <button className='cursor-pointer py-2 px-4 bg-[#ffd041] hover:bg-[#e7c355] duration-150 mt-auto'>Checkout</button>
        </div>
    )
}

export default Cart