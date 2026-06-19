import React, { useState } from "react"
import { useSearch } from "../../context/SearchContext";

interface Props {
    parent: string;
    option:{
        code: string,
        name: string, 
        count: number
    }
}

const FilterElement:React.FC<Props> = ({parent, option}) =>{
    const param = parent.toLowerCase()
    const { searchParams, setSearchParams } = useSearch()
    const [checked, setChecked] = useState<boolean>(searchParams.get(param)?.includes(option.code) || false) 

    const handleCheck = ()=>{
        const newParams = new URLSearchParams(searchParams)
        newParams.set('page', '1')
        const current = newParams.get(param) 
        const params = current?.split(',') || []
        if(checked) {
            if(params.length>1){
                newParams.set(param, params.filter(p=> p!= option.code).join(','))
            }else{
                newParams.delete(param)
            }
        }else{
            params.push(option.code.toString())
            newParams.set(param, params.join(','))
        }
        setChecked(prev=>!prev)
        setSearchParams(newParams)
    }

    return (
        <div onClick={handleCheck} className='font-light cursor-pointer flex justify-between gap-4 items-center'>
            <p className='flex gap-2 items-center justify-between grow text-[#383838] capitalize'><span>{option.name}</span><span>({option.count})</span></p>
            <input className='cursor-pointer' type='checkbox' name={option.name} onChange={()=>handleCheck} checked={checked} />
        </div>
    )
}

export default FilterElement;