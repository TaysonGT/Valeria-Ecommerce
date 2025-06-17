import React, { useState } from 'react'

const PriceRange = ()=>{
    const [minVal, setMinVal] = useState<number>(100)
    const [maxVal, setMaxVal] = useState<number>(15000)
    const min = 0
    const max = 100

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const value = Math.min(Number(e.target.value), maxVal)
        setMinVal(value)
    }

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const value = Math.max(Number(e.target.value), minVal)
        setMaxVal(value)
    }

    return (
        <div className='relative w-full max-w-xs my-8'>
            <div className='h-1 bg-gray-300 rounded-full'>
                <div 
                    className='absolute h-1 bg-blue-500 rounded-full' 
                    style={{
                        left: `${minVal}%`,
                        width: `${maxVal-minVal}5`
                    }}
                />
            </div>
            <input 
                type="range" 
                min={min}
                max={max}
                value={minVal}
                onChange={handleMinChange}
                className='absolute w-full top-0 h-1 pointer-events-none opacity-0 z-20'
            />
            <input 
                type="range" 
                min={min}
                max={max}
                value={maxVal}
                onChange={handleMaxChange}
                className='absolute w-full top-0 h-1 pointer-events-none opacity-0 z-20'
            />
            <div 
                className='absolute w-4 h-4 bg-blue-500 rounded-full -translate-y-1/2 z-10'
                style={{left: `${minVal}%`, top: '50%'}}
            />
            <div 
                className='absolute w-4 h-4 bg-blue-500 rounded-full -translate-y-1/2 z-10'
                style={{left: `${maxVal}%`, top: '50%'}}
            />
            <div className='flex justify-between mt-4'>
                <span>{minVal}</span>
                <span>{maxVal}</span>
            </div>
        </div>
    )
}

export default PriceRange