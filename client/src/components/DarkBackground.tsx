import React from 'react'

interface Props {
    setShow: (arg0: boolean)=> void
    show: boolean
}

const DarkBackground:React.FC<Props> = ({setShow, show})=>{
    return (
        <div 
            className={`w-screen h-screen fixed right-full top-0 z-[99] bg-black opacity-0 duration-300 ${show&& 'translate-x-full opacity-30'}`} 
            onClick={()=>setShow(false)}
        />
    )
}

export default DarkBackground