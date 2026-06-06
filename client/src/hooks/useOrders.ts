import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import { IOrder } from "../types";

type pageAction = "next" | "previous" | "start" | "end"

export const useOrders = () => {
    const [maxPages, setMaxPages] = useState<number>(0)
    const [searchParams, setSearchParams] = useSearchParams()
    const [pageCount, setPageCount] = useState<number>(parseInt(searchParams.get('page') || '1'))
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [ordersCount, setOrdersCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const lastQ = useRef<string>(searchParams.get('q'))
    
    const fetchOrders = async()=>{
        setOrders([])
        setIsLoading(true)
        const currentQ = searchParams.get('q');
        if (currentQ !== lastQ.current) {
          lastQ.current = currentQ;
        }
        axios.get('/admin/orders', {params: searchParams})
        .then(({data})=>{
            if(data.success){
                setOrders(data.orders)
                setMaxPages(data.pagination.totalPages)
                setOrdersCount(data.pagination.totalItems)
                return;
            }
            toast.error(data.message)
            setIsLoading(false)
        }).finally(()=>setIsLoading(false))
    }
    
    const updatePageParam = (page?: string)=>{
        const params = new URLSearchParams(searchParams)
        if(page) params.set('page', page) 
        else !params.get('page')&& params.set('page', '1') 
    
        setPageCount(parseInt(params.get('page')!))
        setSearchParams(params)
    }

    const changePage = (action: pageAction)=>{
        const page = JSON.stringify(actionNav(action, pageCount, maxPages))
        updatePageParam(page)
    }
    
    const actionNav = (action: pageAction, count: number, endPage: number)=>{
        switch(action){
            case "next": return Math.min(count+1, endPage)
            case "previous": return Math.max(count-1, 1)
            case "start": return 1
            case "end": return endPage
        }
    }
    
    const resetParams = ()=>{
        setSearchParams(new URLSearchParams())
    }

    const handleSort = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        const params = new URLSearchParams(searchParams)
        if(e.target.value!='none'){
            params.set(e.target.name.toString().toLowerCase(), e.target.value)
        }else params.delete(e.target.name.toString().toLowerCase());

        if(e.target.name==='sort'&&e.target.value==='none'){
            params.delete('order');
        }

        setSearchParams(params)
    }
    
    
    useEffect(()=>{
        fetchOrders()    
    }, [searchParams])

    return {
        // State
        orders,
        handleSort,
        changePage,
        ordersCount,
        resetParams,
        maxPages,
        pageCount,
        isLoading,
        refetch: fetchOrders,
    };
}