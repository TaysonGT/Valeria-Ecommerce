import React, { createContext, useContext, useEffect, useState } from 'react'
import { SetURLSearchParams, useSearchParams } from 'react-router';


type pageAction = "next" | "previous" | "start" | "end"

interface SearchContextType {
    pageCount: number;
    maxPages: number;
    resetParams: ()=> void;
    searchParams: URLSearchParams;
    handleSort: (e:React.FormEvent<HTMLSelectElement>) => void;
    changePage: (action: pageAction) => void;
    setSearchParams: SetURLSearchParams;
    isLoading: boolean;
    setMaxPages: React.Dispatch<React.SetStateAction<number>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider:React.FC<React.PropsWithChildren<{}>> = ({children})=>{
    const [maxPages, setMaxPages] = useState<number>(0)
    const [searchParams, setSearchParams] = useSearchParams()
    const [pageCount, setPageCount] = useState<number>(parseInt(searchParams.get('page') || '1'))
    const [isLoading, setIsLoading] = useState<boolean>(true)

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

    const handleSort = (e:React.FormEvent<HTMLSelectElement>)=>{
        const params = new URLSearchParams(searchParams)
        if(e.currentTarget.value!='none'){
            params.set(e.currentTarget.name.toString().toLowerCase(), e.currentTarget.value)
        }else params.delete(e.currentTarget.name.toString().toLowerCase());
        setSearchParams(params)
    }

    useEffect(()=>{
        setPageCount(parseInt(searchParams.get('page')||'1'))
    }, [searchParams])

    return (
    <SearchContext.Provider
        value={{
            pageCount,
            maxPages,
            resetParams,
            searchParams,
            handleSort,
            changePage,
            setMaxPages,
            setSearchParams,
            isLoading,
            setIsLoading
        }}
    >
        {children}
    </SearchContext.Provider>
    );
}



export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};