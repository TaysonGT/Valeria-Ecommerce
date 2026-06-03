import React from 'react'
import { filterType } from '.'
import PriceFilter from './PriceFilter'
import FilterGroup from './FilterGroup'

interface Props {
    filters: filterType[]
}

const FilterSection: React.FC<Props> = ({filters})=>{
    return (
        <div className='px-6 py-10 flex-1 sticky top-24'>
            {filters.length>0?
            <>
            <div className='w-full'>
                {filters.map((filter, i)=>
                    filter.opts.length>1&& <FilterGroup key={`${filter.title}-${i}`} {... {filter}}/>
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
    )
}


export default FilterSection