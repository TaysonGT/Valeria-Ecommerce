import React from 'react'

interface Props {
    hide: ()=> void
    show: boolean
    direction?: 'right'|'left'
}

const DarkBackground:React.FC<Props> = ({hide, show, direction='right'})=>{
    return (
        <div 
            className={`
                w-screen h-screen fixed 
                top-0 z-106 bg-black opacity-0 duration-300
                ${direction=='right'?'right-full':'left-full'}
                ${show?
                    direction=='right'?'translate-x-full opacity-30':'-translate-x-full opacity-30'
                    :'translate-x-0'
                }
            `} 
            onClick={hide}
        />
    )
}

export default DarkBackground