import { Link } from 'react-router'

const TrendingSection = () => {
  return (
    <section className='bg-white bg-[url(/imgs/landing/summer-shirts.webp)] bg-center bg-cover'>
      <div className='w-full p-20 bg-linear-to-r from-black/95 via-black/70 to-black/30'>
        <div className='text-start '>
          <h2 className='text-4xl md:text-5xl text-[#f7f7f7] mb-4 font-[Titan_One]'>Get Best Summer Fits</h2>
          <p className='text-xl text-[#f3f3f3] max-w-2xl'>Discover our curated collections designed to match your unique style and preferences.</p>
        </div>

        {/* <div className='w-full lg:h-150 h-100 rounded-lg  border-[#1f1f1f] overflow-hidden'>
            <img src="/imgs/landing/summer-shirts.webp" alt="" className='w-full object-cover h-full' />
        </div> */}

        <div className='text-start mt-12'>
          <Link
            to='/search'
            className='inline-block bg-black text-white border-white border px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300'
          >
            More Details
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TrendingSection