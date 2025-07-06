
import React, { useEffect, useState } from 'react'
import FilterSect from './FilterSect'
import ProductCard from './ProductCard'
import { useParams, useSearchParams } from 'react-router'
import axios from 'axios'
// import { useAuth } from '../context/AuthContext';
import { productType } from '../../types/types'

export interface filterType {
    head: string;
    opts: {
        name: string;
        count: number;
    }[];
}

const list = [
    {
        head: "Availability",
        opts: [
            {name: 'In Stock', count: 54}, 
            {name: 'Out of Stock', count: 76}
        ]
    },
    {
        head: "Gender",
        opts: [
            {name: 'Men', count: 10}, 
            {name: 'Men Jeans & Bottoms', count: 3}
        ]
    },
    {
        head: "Fitting",
        opts: [
            {name: 'Oversized Fit', count: 50}, 
            {name: 'Slim Fit', count: 32}, 
            {name: 'Regular Fit', count: 64}, 
            {name: 'Relaxed Fit', count: 76}, 
            {name: 'Comfort Fit', count: 12}, 
            {name: 'Baggy Fit', count: 5}, 
            {name: 'All Sizes', count: 126}, 
            {name: 'All Seasons', count: 112}
        ] 
    }
]

const ProductsPage:React.FC = () => {
    const [results, setResults] = useState<productType[]>([])
    const [filters, setFilters] = useState<filterType[]>([])
    const [searchParams, setSearchParams] = useSearchParams()
    
    const handleFilter = (e:React.FormEvent<HTMLSelectElement>)=>{
        searchParams.set(e.currentTarget.name.toString(), e.currentTarget.value)
        setSearchParams(searchParams)
    }

    useEffect(()=>{
        axios.get('/products')
        .then(({data})=>{
            setResults(data.products)
        })
        setFilters(list)
    }, [searchParams])

    return (
        <div className='flex min-h-screen'>
            <div className='border-r border-gray-300 px-6 py-10 w-[300px]'>
                {filters?.map((filter, i)=>
                <FilterSect key={i} {... {filter, type: 'list'}}/>
                )}
                <FilterSect {... {i: 0, type: 'price'}} />
            </div>
            <div className='h-full'>
                <div className='py-4 px-10 flex gap-10 border-b border-gray-300'>
                    <div>
                        <label className='block'>Sort By:</label>
                        <select onInput={handleFilter} name='sort' className='p-2 border border-black rounded-sm'>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                            <option value="stock">Stock</option>
                        </select>
                    </div>
                    <div>
                        <label className='block'>Per Page:</label>
                        <select onInput={handleFilter} name='pagination' className='p-2 border border-black rounded-sm'>
                            <option value="10">10 Items</option>
                            <option value="20">20 Items</option>
                        </select>
                    </div>
                </div>
                <div className='grow  px-10 py-4 flex flex-wrap gap-8'>
                {results?.map((product)=>
                    <ProductCard key={product._id} {... {product}} />
                )}
                </div>
            </div>
        </div>
    )
}

export default ProductsPage