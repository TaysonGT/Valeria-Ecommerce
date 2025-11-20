import React from 'react'
import FilterSect from './FilterSect'
import { filterType } from '.'
import PriceFilter from './PriceFilter'

interface Props {
    filters: filterType[]
}

const FiltersList: React.FC<Props> = ({filters})=>{
    return (
        <div className='border-r border-gray-300 px-6 py-10 w-1/5 min-h-screen'>
            {filters.length?
            <>
            <div>
                {filters.map((filter, i)=>
                    filter.opts.length>1&& <FilterSect key={`${filter.title}-${i}`} {... {filter}}/>
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


export default FiltersList