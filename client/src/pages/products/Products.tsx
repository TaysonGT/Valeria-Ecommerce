
import React, { useEffect, useState } from 'react'
import FilterSect from './FilterSect'
import PriceRange from './PriceRange'
import ProductCard from './ProductCard'
import { useParams } from 'react-router'
// import { useAuth } from '../context/AuthContext';

const filters = [
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
const products = [
    {
        id: '132145646',
        name: "RFC Drip Hoodie - Red",
        description: "Lorem ipsum dolor sit amet.",
        price: 499,
        oldPrice: 599,
        img: 'src/assets/1.jpg',
        feature: {
            name: "Sale 50%",
            color: "red"
        }
    },
    {
        id: '132145646',
        name: "RFC Drip Sweatshirt - Rose RFC Drip Sweatshirt - Rose",
        description: "Lorem ipsum dolor sit amet.",
        price: 599,
        oldPrice: 799,
        img: 'src/assets/2.jpg',
        feature: {
            name: "Sale 50%",
            color: "red"
        },
    },
    {
        id: '132145646',
        name: "RFC Drip Hoodie - Red",
        description: "Lorem ipsum dolor sit amet.",
        price: 499,
        oldPrice: 599,
        img: 'src/assets/1.jpg',
        feature: {
            name: "Sale 50%",
            color: "red"
        }
    },
    {
        id: '132145646',
        name: "RFC Drip Sweatshirt - Rose",
        description: "Lorem ipsum dolor sit amet.",
        price: 599,
        oldPrice: 799,
        img: 'src/assets/2.jpg',
        feature: {
            name: "Sale 50%",
            color: "red"
        },
    },
]
const ProductsPage:React.FC = () => {
    const params = useParams()
    const [results, setResults] = useState<typeof products>([])

    useEffect(()=>{
        if(params){
            setResults(products)
        }
    }, [params])

    return (
        <div className='flex min-h-screen'>
            <div className='border-r border-gray-300 px-6 py-10 w-[300px]'>
                {filters?.map((filter, i)=>
                <FilterSect key={i} {... {filter, type: 'list'}}/>
                )}
                <FilterSect {... {i: 0, type: 'price'}} />
            </div>
            <div className='grow p-10 flex flex-wrap gap-6'>
                {results.map((product)=>
                    <ProductCard key={product.id} {... {product}} />
                )}
            </div>
        </div>
    )
}

export default ProductsPage