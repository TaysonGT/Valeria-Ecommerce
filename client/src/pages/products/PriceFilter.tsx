import { useState } from 'react'
import { FaCaretDown } from 'react-icons/fa'

const PriceFilter = () => {
    const [collapse, setCollapse] = useState(true)
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(1600)
    return (
        <div className='mb-2'>
            <div className='select-none text-md py-1 border-b border-black cursor-pointer flex justify-between items-center mb-4' onClick={()=>setCollapse(prev=> !prev)}>
                Price
                <FaCaretDown className={'text-sm duration-300 '+ (collapse&& 'rotate-180')}/>
            </div>
            <div className={`flex items-center h-full duration-300 justify-between overflow-hidden ${collapse? 'max-h-30': 'max-h-0'}`}>
                <input 
                    type="number" 
                    className='border h-full border-gray-700 rounded-sm p-2 w-1/3' 
                    value={min}
                    onChange={(e)=>setMin(Math.max(parseInt(e.target.value),1))}
                    />
                <p>to</p>
                <input 
                    type="number" 
                    className='border h-full border-gray-700 rounded-sm p-2 w-1/3' 
                    value={max}
                    onChange={(e)=>setMax(Math.max(parseInt(e.target.value),5))}
                    />
            </div>
            
        </div>
    )
}

export default PriceFilter