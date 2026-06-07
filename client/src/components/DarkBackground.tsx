import React from 'react'

interface Props {
    hide: ()=> void
    show: boolean
}

const DarkBackground:React.FC<Props> = ({hide, show})=>{
    return (
        <div 
            className={`w-screen h-screen fixed right-full top-0 z-106 bg-black opacity-0 duration-300 ${show&& 'translate-x-full opacity-30'}`} 
            onClick={hide}
        />
    )
}

export default DarkBackground