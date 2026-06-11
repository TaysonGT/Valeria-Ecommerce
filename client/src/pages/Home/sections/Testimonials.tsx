import { FaStar } from 'react-icons/fa'

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, NY",
    rating: 5,
    text: "Absolutely love shopping at Valeria! The quality of their products is outstanding and the customer service is exceptional. My orders always arrive quickly and beautifully packaged.",
    avatar: "/* Replace with customer avatar */"
  },
  {
    name: "Michael Chen",
    location: "Los Angeles, CA",
    rating: 5,
    text: "I've been a loyal customer for over a year now. The fashion pieces are unique and stylish. The free shipping threshold is great and returns are hassle-free.",
    avatar: "/* Replace with customer avatar */"
  },
  {
    name: "Emma Rodriguez",
    location: "Miami, FL",
    rating: 5,
    text: "Valeria has the most beautiful jewelry collection I've ever seen. The attention to detail and craftsmanship is remarkable. Highly recommend for special occasions!",
    avatar: "/* Replace with customer avatar */"
  }
]

const TestimonialsSection = () => {
  return (
    <section className='py-20 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-[Comfortaa]'>What Our Customers Say</h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>Don't just take our word for it - hear from our satisfied customers who love shopping with Valeria.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300'
            >
              <div className='flex items-center mb-4'>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className='text-yellow-400 w-5 h-5' />
                ))}
              </div>

              <p className='text-gray-700 text-lg leading-relaxed mb-6 italic'>
                "{testimonial.text}"
              </p>

              <div className='flex items-center'>
                <div className='w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4'>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className='font-semibold text-gray-900'>{testimonial.name}</h4>
                  <p className='text-gray-600 text-sm'>{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='text-center mt-12'>
          <div className='flex items-center justify-center space-x-1 mb-4'>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className='text-yellow-400 w-6 h-6' />
            ))}
            <span className='ml-2 text-gray-700 font-semibold'>4.9 out of 5 stars</span>
          </div>
          <p className='text-gray-600'>Based on 2,500+ customer reviews</p>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection