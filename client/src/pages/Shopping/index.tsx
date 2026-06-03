import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { productType } from '../../types'
import ResultSection from './ResultSection'
import { useSearch } from '../../context/SearchContext'
import FilterSection from './FilterSection'

export interface filterType {
    title: string;
    opts: {
        code: string;
        name: string;
        count: number;
    }[];
}

const ShoppingPage:React.FC = () => {
    const [results, setResults] = useState<productType[]>([])
    const [filters, setFilters] = useState<filterType[]>([])
    const {searchParams, setMaxPages} = useSearch()
    const lastQ = useRef<string>(searchParams.get('q'))

    const {isLoading, setIsLoading} = useSearch()

    useEffect(()=>{
        setResults([])
        setIsLoading(true)
        const currentQ = searchParams.get('q');
        axios.get(`/products/search?${searchParams.toString()}`)
        .then(({data})=>{
            setResults(data.products)
            setMaxPages(Math.ceil(data.totalCount/parseInt(searchParams.get('pagination')||'10')))
            if (!filters.length || currentQ !== lastQ.current) {
                setFilters(data.filters);
                lastQ.current = currentQ;
            }
            setIsLoading(false)
        })
    }, [searchParams])

    return (
        <div className='flex w-full relative items-start'>
            <FilterSection {...{filters}}/>
            <ResultSection {... {results, isLoading, filters}}/>
        </div>
    )
}

export default ShoppingPage