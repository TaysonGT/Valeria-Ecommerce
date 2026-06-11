import { Link } from 'react-router'
import { FiArrowRight } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { LuClock12 } from 'react-icons/lu'

const LimitedOffer = () => {
  const [clock, setClock] = useState(0)
  const [endDate] = useState(new Date().setHours(new Date().getHours()+2))

  const displayClock = (time:number)=>{
    // const d = Math.floor(time/60/60/24)
    const h = Math.floor(time/60/60)%60
    const m = Math.floor(time/60)%60
    const s = time%60

    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
  }

  const decrement = ()=>{
    let time =  Math.floor((new Date(endDate).getTime() - new Date().getTime()) /1000)
    setClock(time)
    if (time>0) {
      setClock(time)
    }else{
      setClock(0)
    }
  }

  useEffect(()=>{
    const newinterval = setInterval(decrement,1000)
    return ()=> clearInterval(newinterval)
  },[])

  return (
    <section className='bg-white border-6 border-amber-300 font-sans'>
      <div className='w-full flex items-center relative bg-[url(/imgs/landing/limited-offer.jpg)] bg-no-repeat bg-cover bg-center'>
        <div className='p-16 py-14 flex flex-col sm:items-center gap-6 h-full bg-linear-to-l from-black/30 to-black/90 w-full text-center'>
          <p className='text-5xl text-red-400 font-light font-[Elms_Sans]'>Limited Edition</p>
          <p className='text-amber-300 text-7xl leading-tight uppercase font-[Titan_One]'>Buy 2 <span className='text-white'>Get</span> <span className='text-primary-200'>1 Free</span></p>
          <Link to={'/shop'} className='text-4xl flex gap-4 items-center bg-black text-white px-8 pr-5 py-3 rounded-full font-[Elms_Sans] hover:bg-white hover:text-black duration-200 border-white border cursor-pointer '>
            Discover Offers
            <FiArrowRight className='text-4xl'/>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LimitedOffer