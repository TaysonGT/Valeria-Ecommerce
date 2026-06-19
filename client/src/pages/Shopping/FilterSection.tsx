import React, { useEffect, useState } from 'react'
import { filterType } from '.'
import PriceFilter from './PriceFilter'
import FilterGroup from './FilterGroup'
import DarkBackground from '../../components/DarkBackground'

interface Props {
    filters: filterType[]
}

const FilterSection: React.FC<Props> = ({filters})=>{
    const [showMobile, setShowMobile] = useState<boolean>(false);

    useEffect(()=>{
        const handler = ()=> setShowMobile(s=>!s)
        window.addEventListener('toggle-filters', handler)
        return ()=> window.removeEventListener('toggle-filters', handler)
    },[])

    return (
        <>
        {/* Desktop / tablet filters */}
        <div className='hidden md:block p-6 flex-1 sticky top-24'>
            {filters?.length?
            <>
            <div className='w-full'>
                {filters.map((filter, i)=>
                    filter.opts?.length>1&& <FilterGroup key={`${filter.title}-${i}`} {... {filter}}/>
                )}
            </div>
            <PriceFilter/>
            </>
            :
            <div className="flex flex-col gap-4">
                <div className='w-full h-6 bg-gray-100 rounded-md'/>
                <div className='w-full h-6 bg-gray-100 rounded-md'/>
                <div className='w-full h-6 bg-gray-100 rounded-md'/>
                <div className='w-full h-6 bg-gray-100 rounded-md'/>
            </div>
            }
        </div>

        {/* Mobile filters drawer */}
        <DarkBackground show={showMobile} hide={()=>setShowMobile(false)} direction='left'/>
        <div className={`fixed left-0 top-0 bottom-0 w-80 ${showMobile?'translate-x-0':'-translate-x-full'} duration-300 bg-white z-120 p-4 overflow-y-auto border-r border-gray-200`}>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-xl font-bold'>Filters</h3>
                <button onClick={()=>setShowMobile(false)} className='text-xl'>×</button>
            </div>
            <div className='modal-inner'>
                {filters?.length?
                    <>
                        <div className='w-full'>
                            {filters.map((filter, i)=>
                                filter.opts?.length>1&& <FilterGroup key={`${filter.title}-${i}`} {... {filter}}/>
                            )}
                        </div>
                        <PriceFilter/>
                    </>
                    :
                    <div className="flex flex-col gap-4">
                        <div className='w-full h-6 bg-gray-100 rounded-md'/>
                        <div className='w-full h-6 bg-gray-100 rounded-md'/>
                        <div className='w-full h-6 bg-gray-100 rounded-md'/>
                        <div className='w-full h-6 bg-gray-100 rounded-md'/>
                    </div>
                }
            </div>
        </div>
        </>
    )
}


export default FilterSection