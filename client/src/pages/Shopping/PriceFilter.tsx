import { useState } from 'react'
import { FaCaretDown } from 'react-icons/fa'
import { useSearch } from '../../context/SearchContext'

const PriceFilter = () => {
    const [collapse, setCollapse] = useState(true)
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(20000)

    const { searchParams, setSearchParams } = useSearch()
    
    const applyPrice = (e: React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if(min===0&&max===20000) return;
        const newParams = new URLSearchParams(searchParams)
        newParams.set('minPrice', min.toString())
        newParams.set('maxPrice', max.toString())
        setSearchParams(newParams)
    }
    
    const resetPrice = ()=>{
        setMin(0)
        setMax(20000)
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('minPrice')
        newParams.delete('maxPrice')
        setSearchParams(newParams)
    }

    return (
        <form onSubmit={applyPrice} className='mb-2 w-full overflow-x-hidden'>
            <div className='select-none text-md py-1 border-b border-black cursor-pointer flex justify-between items-center mb-4' onClick={()=>setCollapse(prev=> !prev)}>
                Price
                <FaCaretDown className={'text-sm duration-300 '+ (collapse&& 'rotate-180')}/>
            </div>
            <div className={`duration-300 overflow-y-hidden ${collapse? 'max-h-30': 'max-h-0'}`}>
                <div className={`flex gap-2 items-center`}>
                    <div className='flex-1'>
                        <p>Min</p>
                        <input 
                            type="number" 
                            className='border h-full border-gray-700 rounded-sm p-2 w-full' 
                            value={min}
                            onChange={(e)=>setMin(Math.max(Math.min(parseInt(e.target.value),max),1))}
                            />
                    </div>
                    <div className='flex-1'>
                        <p>Max</p>
                        <input 
                            type="number" 
                            className='border h-full border-gray-700 rounded-sm p-2 w-full' 
                            value={max}
                            onChange={(e)=>setMax(Math.max(Math.max(parseInt(e.target.value),min),5))}
                            />
                    </div>
                </div>
                <div className='flex gap-2 mt-4 font-sans'>
                    <button type='submit' className='bg-[#0077c7] text-white px-4 flex-1 py-2 cursor-pointer'>Apply</button>
                    <button className='bg-black text-white px-4 flex-1 py-2 cursor-pointer' onClick={resetPrice}>Reset</button>
                </div>
            </div>
        </form>
    )
}

export default PriceFilter