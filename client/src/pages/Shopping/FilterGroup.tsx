import React, { useState } from 'react'
import { FaCaretDown } from 'react-icons/fa';
import FilterElement from './FilterElement';

interface Props {
    filter: {
        title: string,
        opts: {code: string, name: string, count: number}[],
    }
}

const FilterGroup:React.FC<Props> = ({filter})=>{
    const [collapse, setCollapse] = useState(true)

    return (
        <div className='mb-6'>
            <div className='select-none text-md py-1 border-b border-black cursor-pointer flex justify-between items-center mb-2' onClick={()=>setCollapse(prev=> !prev)}>
                {filter.title}
                <FaCaretDown className={'text-sm duration-300 '+ (collapse&& 'rotate-180')}/>
            </div>
            <div className={`flex flex-col gap-2 duration-300 overflow-hidden ${collapse? 'max-h-96': 'max-h-0'}`}>
                {filter.opts?.map((op, o)=>
                    <FilterElement key={o} {... {parent: filter.title, option: op}}/>
                )}
            </div>
        </div>
    )  
     
}

export default FilterGroup;