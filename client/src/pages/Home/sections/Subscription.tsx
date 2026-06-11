import { Link } from 'react-router';
import { FaCcMastercard, FaCcVisa, FaFacebookF, FaInstagram, FaTiktok, FaYoutube} from 'react-icons/fa';

const paymentMethods = [
  {src: '/imgs/landing/payment-methods/icon-1.webp'},
  {src: '/imgs/landing/payment-methods/icon-2.webp'},
  {src: '/imgs/landing/payment-methods/icon-3.webp'},
]

const footerLinks = [
  {
    head: "Customer Service",
    links: [
      {
        text: "VALERIA Terms And Condition",
        path: "/"
      },
      {
        text: "VALERIA Privacy Policy",
        path: "/"
      },
      {
        text: "Delivery And Returns",
        path: "/"
      },
      {
        text: "Terms of Service",
        path: "/"
      },
      {
        text: "Refund policy",
        path: "/"
      },
    ]
  },
  {
    head: "ABOUT",
    links: [
      {
        text: "About VALERIA",
        path: "/"
      },
      {
        text: "How To Purchase",
        path: "/"
      }
    ]
  },
  {
    head: "CONTACT US",
    links: [
      {
        text: "Contact Us",
        path: "/"
      }
    ]
  },
]

const SubscriptionSection = () => {
  return (
    <section className='bg-black text-white w-full overflow-x-hidden'>
        <div className='text-center py-16 px-10 flex flex-col items-center w-full'>
          <h1 className='uppercase text-4xl mb-3 font-[Elms_Sans]'>Stay in Style</h1>
          <p className='text-slate-100 mb-6 max-w-2xl'>Be the first to know about exclusive drops, limited-time offers, styling tips, and behind-the-scenes content from Valeria.</p>
          <form className='flex gap-2 font-[Comfortaa] w-full justify-center flex-col sm:flex-row   '>
            <input  className='bg-white min-w-0 w-full grow md:w-100 sm:grow-0 px-4 py-3 text-black text-center sm:text-left' placeholder='Enter your email address' type="email" />
            <button className='bg-[#ffc720] hover:bg-[#ffd351] uppercase text-black py-3 px-5 duration-150 cursor-pointer font-semibold'>
              Subscribe
            </button>
          </form>
          <p className='text-slate-300 text-sm mt-4'>No spam, unsubscribe at any time.</p>
        </div>
        <div className='grid md:grid-cols-4 grid-cols-2 md:gap-10 border-t border-gray-500 py-16 w-full px-10'>
          {footerLinks.map((sec, i)=>
            <div key={i}>
              <h1 className='mb-6 text-sm'>{sec.head}</h1>
              <div className='flex flex-col gap-4 text-gray-400 text-sm'>
                {sec.links.map((link, x)=>
                  <Link key={x} className='block hover:underline hover:text-white duration-300' to={link.path}>{link.text}</Link>
                )}
              </div>
            </div>
          )}
          <div className='flex flex-col md:gap-6 gap-2'>
            <div>
              <h1 className='mb-6 text-sm'>Keep In Touch</h1>
              <div className='flex gap-4 text-xl flex-wrap'>
                <Link to='/' className='relative group rounded-full p-2 hover:bg-white hover:scale-[1.15] border-t duration-300'>
                  <FaFacebookF className='group-hover:text-black duration-300'/>
                </Link>
                <Link to='/' className='relative group rounded-full p-2 hover:bg-white hover:scale-[1.15] border-t duration-300'>
                  <FaInstagram className='group-hover:text-black duration-300'/>
                </Link>
                <Link to='/' className='relative group rounded-full p-2 hover:bg-white hover:scale-[1.15] border-t duration-300'>
                  <FaTiktok className='group-hover:text-black duration-300'/>
                </Link>
                <Link to='/' className='relative group rounded-full p-2 hover:bg-white hover:scale-[1.15] border-t duration-300'>
                  <FaYoutube className='group-hover:text-black duration-300'/>
                </Link>
              </div>
            </div>
            <div>
              <h1 className='text-sm mb-4'>Payment Accept</h1>
              <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
                <FaCcVisa size={40}/>
                <FaCcMastercard size={40}/>
                {paymentMethods.map((method, y)=>
                  <img key={y} className='w-20 h-full' src={method.src} alt="none" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default SubscriptionSection