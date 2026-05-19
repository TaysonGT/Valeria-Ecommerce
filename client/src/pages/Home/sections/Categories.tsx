import { Link } from 'react-router'
import { FaTshirt, FaGem, FaHome, FaShoppingBag } from 'react-icons/fa'

const categories = [
  {
    name: "Fashion",
    icon: <FaTshirt className='text-4xl text-white' />,
    description: "Trendy clothing and accessories",
    image: "/* Replace with fashion category image */",
    link: "/search?category=fashion"
  },
  {
    name: "Jewelry",
    icon: <FaGem className='text-4xl text-white' />,
    description: "Elegant jewelry and accessories",
    image: "/* Replace with jewelry category image */",
    link: "/search?category=jewelry"
  },
  {
    name: "Home & Living",
    icon: <FaHome className='text-4xl text-white' />,
    description: "Beautiful home decor and essentials",
    image: "/* Replace with home category image */",
    link: "/search?category=home"
  },
  {
    name: "Accessories",
    icon: <FaShoppingBag className='text-4xl text-white' />,
    description: "Stylish bags and accessories",
    image: "/* Replace with accessories category image */",
    link: "/search?category=accessories"
  }
]

const CategoriesSection = () => {
  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>Shop by Category</h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Discover our curated collections designed to match your unique style and preferences.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              <div className='aspect-square relative'>
                {/* Placeholder for category image */}
                <div className='w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center'>
                  {category.icon}
                </div>
                <div className='absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                  <div className='text-center text-white'>
                    <h3 className='text-2xl font-bold mb-2'>{category.name}</h3>
                    <p className='text-sm'>{category.description}</p>
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