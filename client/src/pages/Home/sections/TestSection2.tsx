import { Link } from 'react-router'
import { FaTshirt, FaGem, FaHome, FaShoppingBag } from 'react-icons/fa'
import { MdArrowRight } from 'react-icons/md'
import { FiArrowRight } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { LuClock12 } from 'react-icons/lu'

const TestSection2 = () => {
  const [clock, setClock] = useState(0)
  const [endDate, setEndDate] = useState(new Date().setHours(new Date().getHours()+2))

  const displayClock = (time:number)=>{
    const d = Math.floor(time/60/60/24)
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
    <section className='bg-white border-6 border-amber-300'>
      <div className='w-full flex items-center relative bg-[url(/test-images/test-2.jpg)] bg-no-repeat bg-cover bg-center'>
        <div className='p-20 flex flex-col gap-8  h-full bg-linear-to-l from-black/30 to-black/90 w-full'>
          <div className='flex items-start gap-6'>
            <p className='text-5xl text-red-400 font-light font-[Elms_Sans]'>Limited Edition</p>
            <p className='bg-indigo-200 py-1 px-4 pl-2 border border-white text-indigo-800 font-bold text-xl flex items-center gap-2'><LuClock12 className=''/>{displayClock(clock)}</p>
          </div>
          <p className='text-white text-9xl font-extrabold'>Buy 2 <span className='text-amber-300'>Get 1 Free</span></p>
          <Link to={'/shop'} className='text-5xl flex gap-4 items-center bg-black text-white self-start px-10 pr-4 py-4 rounded-full font-[Elms_Sans] mt-8 hover:bg-white hover:text-black duration-200 border-white border cursor-pointer'>
            Discover Offers
            <FiArrowRight className='text-5xl'/>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TestSection2