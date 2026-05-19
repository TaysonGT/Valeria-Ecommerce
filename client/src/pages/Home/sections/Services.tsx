import { FaShippingFast, FaShieldAlt, FaHeadset, FaUndo } from "react-icons/fa"
import { Link } from "react-router"

const services = [
    { 
      title: "Free Shipping",
      description: ["Enjoy free shipping on all orders over $50. Fast and reliable delivery to your doorstep with real-time tracking."],
      icon: <FaShippingFast className='text-5xl md:text-6xl text-white'/>
    },
    { 
      title: "Secure Payment",
      description: ["Your security is our priority. We use industry-standard encryption and accept all major credit cards and digital wallets."],
      icon: <FaShieldAlt className='text-5xl md:text-6xl text-white'/>
    },
    { 
      title: "24/7 Support",
      description: ["Our customer service team is here to help you anytime. Get instant answers to your questions via chat, email, or phone."],
      icon: <FaHeadset className='text-5xl md:text-6xl text-white'/>
    },
    {
      title: "Easy Returns",
      description: ["Not satisfied? Return any item within 30 days for a full refund. Simple, hassle-free returns with prepaid labels."],
      icon: <FaUndo className='text-5xl md:text-6xl text-white'/>
    }
  ]

const ServicesSection = () => {

  return (
    <section className={`w-full relative 2xl:py-26 py-20 px-6 sm:px-16 text-white bg-[#003f79]`}>
      <div className='flex gap-20 gap-y-10 flex-col lg:flex-row'>
        <div className='lg:flex-1 flex flex-col'>
          <div className={`text-left`}>
            <h1 className={`text-6xl min-[400px]:text-6xl md:text-6xl xl:text-7xl 2xl:text-8xl leading-tight uppercase font-extrabold`}>Why Choose Valeria?</h1>
            <p className={`text-lg md:text-xl lg:text-2xl leading-relaxed text-left mt-6`}>Experience shopping like never before with our premium services designed to make your online shopping journey seamless and enjoyable.</p>
          </div>
        </div>
        <div className="lg:flex-1 flex">
          {/* Services Section Image */}
          <img src={'/images/services-vector.svg'} alt='services' className=' object-contain w-full' height={1024} width={1024}/>
        </div>
      </div>
      <div className='mt-6 text-white'>
        <h1 className={`text-5xl lg:text-6xl text-center`} style={{fontWeight:700}}>Our Services</h1>
        <div className='flex justify-center flex-wrap gap-20 w-full mt-10 xl:mt-16'>
          {services.map((service, i)=>
            <div key={i} className='flex w-80 flex-col rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 overflow-hidden shadow-lg shadow-black/20 hover:scale-105 transition-transform duration-300'>
              <div className='flex justify-center items-center p-8 bg-white/10'>
                {service.icon}
              </div>
              <div className='flex flex-col gap-4 p-6 grow text-center'>
                <p className={`text-2xl font-bold text-white leading-snug`}>{service.title}</p>
                <p className={`text-base text-cyan-100 flex flex-col gap-2 leading-relaxed`}>
                  {service.description.map((d, i)=>
                    <span key={i}>{d}</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection