import React from 'react'

const OfferSection = () => {
  return (
    <div className='relative bg-[url("/landing/shopping-bags.webp")] bg-cover bg-center p-20'>
        <div className='w-1/2 text-[#1b1b1b]'>
            <h1 className='text-5xl font-bold'>Limited Time Offer</h1>
            <p className='text-lg mt-2'>Get 30% off on all items + Free shipping on orders over $75. Don't miss out on these amazing deals!</p>
            <button className='border px-4 py-2 mt-4 hover:bg-black hover:text-white border-[#1b1b1b] duration-300 cursor-pointer'>Shop Sale Now</button>
        </div>
    </div>
  )
}

export default OfferSection