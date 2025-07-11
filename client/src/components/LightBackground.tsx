import React from 'react'

interface Props {
    setShow: (arg0: boolean)=> void
    show: boolean
}

const LightBackground:React.FC<Props> = ({setShow, show})=>{
    return (
        <div 
            className={`w-screen h-screen fixed top-full left-0 z-[99] bg-white opacity-0 duration-300 ${show&& '-translate-y-full opacity-30'}`} 
            onClick={()=>setShow(false)}
        />
    )
}

export default LightBackground