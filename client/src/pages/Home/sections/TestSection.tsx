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

const TestSection = () => {
  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-8'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>Get Best Summer Fits</h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Discover our curated collections designed to match your unique style and preferences.</p>
        </div>

        <div className='w-full'>
            <img src="/test-images/banner-1.webp" alt="" className='w-full cover' />
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

export default TestSection