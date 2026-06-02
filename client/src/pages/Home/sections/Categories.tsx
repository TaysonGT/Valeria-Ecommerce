import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ICategory } from '../../../types'

const CategoriesSection = () => {
  const [categories, setCategories] = useState<ICategory[]>([])

  useEffect(()=>{
    axios.get('/products/categories')
    .then(({data})=>{
      if(!data.success){
        toast.error(data.message)
        return
      }
      setCategories(data.categories.filter((c:ICategory)=>
        ['T-Shirts','Hoodies', 'Jackets'].includes(c.name)
      ))
    })
  },[])

  return (
    <section className='py-20 bg-white font-[Comfortaa]'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>Shop by Category</h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Discover our curated collections designed to match your unique style and preferences.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {categories?.map((category, index) => (
            <Link
              key={index}
              to={'#'}
              className='group relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              <div className='aspect-square relative'>
                <div className='w-120 h-120 bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center'>
                  <img className='w-full h-full object-center object-cover' src={category.bannerImage?.url} alt={category.bannerImage?.altText}/>
                </div>
                <div className='absolute inset-0 bg-black/40 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                  <div className='text-center text-white'>
                    <h3 className='text-4xl font-bold mb-2'>{category.name}</h3>
                    <p className='text-sm'>{category.path}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className='text-center mt-12'>
          <Link
            to='/search'
            className='inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300'
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection