import { FaUsers, FaShoppingCart, FaStar, FaGlobe } from 'react-icons/fa'

const stats = [
  {
    icon: <FaUsers className='text-4xl text-blue-600' />,
    number: "50,000+",
    label: "Happy Customers",
    description: "Satisfied shoppers worldwide"
  },
  {
    icon: <FaShoppingCart className='text-4xl text-green-600' />,
    number: "100,000+",
    label: "Products Sold",
    description: "Items delivered successfully"
  },
  {
    icon: <FaStar className='text-4xl text-yellow-500' />,
    number: "4.9/5",
    label: "Average Rating",
    description: "Based on customer reviews"
  },
  {
    icon: <FaGlobe className='text-4xl text-purple-600' />,
    number: "25+",
    label: "Countries Served",
    description: "Global shipping available"
  }
]

const StatsSection = () => {
  return (
    <section className='py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4'>Trusted by Thousands</h2>
          <p className='text-xl text-blue-100 max-w-2xl mx-auto'>Join our growing community of satisfied customers who choose Valeria for their fashion needs.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {stats.map((stat, index) => (
            <div
              key={index}
              className='text-center bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105'
            >
              <div className='flex justify-center mb-4'>
                {stat.icon}
              </div>
              <div className='text-4xl md:text-5xl font-bold mb-2'>
                {stat.number}
              </div>
              <div className='text-xl font-semibold mb-2'>
                {stat.label}
              </div>
              <div className='text-blue-100 text-sm'>
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection