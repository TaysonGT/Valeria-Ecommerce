import React, { useRef } from "react"

interface Props {
    option:{
        name: string, 
        count: number
    }
}

const FilterOpt:React.FC<Props> = ({option}) =>{
    const checkRef = useRef<HTMLInputElement>(null)

    const handleCheck = ()=>{
        checkRef.current!.checked = !checkRef.current?.checked
    }

    return (
        <div onClick={()=>handleCheck} className='font-light cursor-pointer flex justify-between gap-4 items-center'>
            <p className='flex gap-2 items-center' onClick={handleCheck}><span>{option.name}</span> ({option.count})</p>
            <input className='cursor-pointer' type='checkbox' name={option.name} ref={checkRef} />
        </div>
    )
}

export default FilterOpt;