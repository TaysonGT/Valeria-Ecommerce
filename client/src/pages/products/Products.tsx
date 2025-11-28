import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { productType } from '../../types/types'
import ProductsList from './ProductsList'
import FiltersList from './FiltersList'
import { useSearch } from '../../context/SearchContext'

export interface filterType {
    title: string;
    opts: {
        code: string;
        name: string;
        count: number;
    }[];
}

// const list = [
//     {
//         head: "Availability",
//         opts: [
//             {code:'in', name: 'In Stock', count: 54}, 
//             {code:'out', name: 'Out of Stock', count: 76}
//         ]
//     },
//     {
//         head: "Gender",
//         opts: [
//             {code:"men", name: 'Men', count: 10}, 
//             {code:"mjb", name: 'Men Jeans & Bottoms', count: 3}
//         ]
//     },
//     {
//         head: "Fitting",
//         opts: [
//             {code:'ovs', name: 'Oversized Fit', count: 50}, 
//             {code:'slm', name: 'Slim Fit', count: 32}, 
//             {code:'rgl', name: 'Regular Fit', count: 64}, 
//             {code:'rlx', name: 'Relaxed Fit', count: 76}, 
//             {code:'cmf', name: 'Comfort Fit', count: 12}, 
//             {code:'bgy', name: 'Baggy Fit', count: 5},
//         ] 
//     }
// ]

const ProductsPage:React.FC = () => {
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
        <div className='flex'>
            <FiltersList {...{filters}}/>
            <ProductsList {... {results, isLoading, filters}}/>
        </div>
    )
}

export default ProductsPage