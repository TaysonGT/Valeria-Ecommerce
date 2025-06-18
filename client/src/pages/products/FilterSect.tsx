import React, { useState } from 'react'
import { FaCaretDown } from 'react-icons/fa';

interface Props {
    filter?: {
        head: string,
        opts: {name: string, count: number}[],
    },
    type: string,
}

const FilterSect:React.FC<Props> = ({filter, type})=>{
    const [collapse, setCollapse] = useState(true)
    if(type == 'list' && filter){
        return (
            
                <div className='mb-2'>
                    <div className='select-none text-md py-1 border-b border-black cursor-pointer flex justify-between items-center mb-2' onClick={()=>setCollapse(prev=> !prev)}>
                        {filter.head}
                        <FaCaretDown className={'text-sm duration-300 '+ (collapse&& 'rotate-180')}/>
                    </div>
                    <div className={`flex flex-col gap-2 duration-300 overflow-hidden ${collapse? 'max-h-30': 'max-h-0'}`}>
                        {filter.opts.map((opt, o)=>
                        <div key={o} className='font-light cursor-pointer flex justify-between gap-4 items-center'>
                            <p className='flex gap-2 items-center'><span>{opt.name}</span> ({opt.count})</p>
                            <input className='cursor-pointer' type='checkbox' name={opt.name}/>
                        </div>
                        )}
                    </div>
                </div>
        )  
    }else return (
        <div className='mb-2'>
            <div className='select-none text-md py-1 border-b border-black cursor-pointer flex justify-between items-center mb-4' onClick={()=>setCollapse(prev=> !prev)}>
                Price
                <FaCaretDown className={'text-sm duration-300 '+ (collapse&& 'rotate-180')}/>
            </div>
            <div className={`flex items-center duration-300 justify-between overflow-hidden ${collapse? 'max-h-30': 'max-h-0'}`}>
                <input 
                    type="number" 
                    className='border border-gray-700 rounded-sm p-2 w-1/3' 
                    defaultValue={0}/>
                <p>to</p>
                <input 
                    type="number" 
                    className='border border-gray-700 rounded-sm p-2 w-1/3' 
                    defaultValue={1600}/>
            </div>
            
        </div>
    )
     
}

export default FilterSect;