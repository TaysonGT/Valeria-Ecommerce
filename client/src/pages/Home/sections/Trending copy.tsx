import { Link } from 'react-router'

const TrendingSection = () => {
  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-8'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-[Comfortaa]'>Get Best Summer Fits</h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Discover our curated collections designed to match your unique style and preferences.</p>
        </div>

        <div className='w-full lg:h-150 h-100 rounded-lg  border-[#1f1f1f] overflow-hidden'>
            <img src="/imgs/landing/summer-shirts.webp" alt="" className='w-full object-cover h-full' />
        </div>

        <div className='text-center mt-12'>
          <Link
            to='/search'
            className='inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300'
          >
            More Details
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TrendingSection