import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { AiFillClockCircle } from "react-icons/ai";
import { FaCircle } from "react-icons/fa";

const upcomingStatuses = [
    {
        value: "pending",
        label: "Pending"
    },
    {
        value: "processing",
        label: "Processing"
    },
    {
        value: "shipped",
        label: "Shipped"
    }
]

const otherStatuses = [
    {
        value: "delivered",
        label: "Delivered"
    },
    {
        value: "cancelled",
        label: "Cancelled"
    }
]

const ShippingStatus = ({status = 'pending'}: {status: string}) => {

    const icon = (i:number)=>{
        const statusIndex = upcomingStatuses.findIndex((v) => v.value === status)
        if(upcomingStatuses.some(s=>s.value===status)){
            if(status === 'shipped'){
                return <IoCheckmarkCircle className={`text-green-500 text-xl rounded-full aspect-square self-end bg-white border`}/>
            } else 
                if(statusIndex === i){
                return <AiFillClockCircle className="text-blue-400 text-xl rounded-full aspect-square self-end bg-white border"/>
            }
            else if(statusIndex > i){
                return <IoCheckmarkCircle className={`text-green-500 text-xl rounded-full aspect-square self-end bg-white border`}/>
            }else {
                return <FaCircle className={`text-gray-400 text-xl rounded-full aspect-square self-end bg-white border`}/>
            }
        }else if(otherStatuses.some(s=>s.value===status)){
            if(status === 'delivered'){
                return <IoCheckmarkCircle className={`text-green-500 text-xl rounded-full aspect-square self-end bg-white border`}/>
            }else {
                return <IoCloseCircle className={`text-red-500 text-xl rounded-full aspect-square self-end bg-white border`}/>
            }
        }else {
            return <AiFillClockCircle className={`text-gray-400 text-xl rounded-full aspect-square self-end bg-white border`}/>
        }
    }

  return upcomingStatuses.some((s) => s.value === status) ? (
        <div className="flex gap-2">
            {upcomingStatuses.map((s,i)=>(
                <div key={s.value} className={`flex items-center gap-2`}>
                    {icon(i)}
                    <p className="flex items-center gap-1">
                        <span className={`text-sm`}>{s.label}</span>
                        {upcomingStatuses.length-1 > i && <MdKeyboardDoubleArrowRight className="text-base"/>}
                    </p>
                </div>
            ))}
        </div>
  )
  : <div className="flex gap-2">
        {icon(status === 'delivered' ? 0 : 1)}
        <p className="flex items-center gap-1">
            <span className={`text-sm capitalize`}>{status}</span>
        </p>
    </div>
}

export default ShippingStatus