import React, { useEffect } from 'react'
import Navbar from '../../components/customer/Navbar'
import { Outlet } from 'react-router-dom'
import { axiosInstance } from '../../utils/axiosInstance'
import { serverUrlAPI } from '../../utils/Infos'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import PageLoder from '../../components/PageLoder'

const Wrapper = () => {

  const queryClient = useQueryClient();

  const fetcCustomerData = async ()=>{
    const response = await axiosInstance.get(`${serverUrlAPI}user/profile`);
    sessionStorage.setItem("user",JSON.stringify(response.data));
    return response.data;
  }

  const {data , isLoading} = useQuery({
    queryKey:["profile"],
    queryFn:fetcCustomerData,
    staleTime:Infinity,
    refetchOnWindowFocus:false,
    enabled: (localStorage.getItem("token") ? (queryClient.getQueryData(["profile"]) ? false  : true) :true)
  })

  console.log(data)

  if(isLoading)
  {
    return <PageLoder/>
  }


  return (
    <section className='w-full max-w-[1800px] mx-auto '>
       <Navbar/>
        <section className='mx-auto w-full max-w-[1200px]'>
         <Outlet/>
        </section>
    </section>
  )
}

export default Wrapper
