import React from 'react'
import RNavbar from '../../components/restaurant/RNavbar'
import { Outlet } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { serverUrlAPI } from '../../utils/Infos';
import { axiosInstance } from '../../utils/axiosInstance';
import PageLoder from '../../components/PageLoder';

const RWrapper = () => {

  const queryClient = useQueryClient();

  const fetcRestaurantData = async ()=>{
    const response = await axiosInstance.get(`${serverUrlAPI}restaurant/profile`);
    sessionStorage.setItem("user",JSON.stringify(response.data));
    return response.data;
  }

  const {data , isLoading} = useQuery({
    queryKey:["profile"],
    queryFn:fetcRestaurantData,
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
    <section className='w-full max-w-[1800px] mx-auto'>
       <RNavbar/>
       <Outlet/>
    </section>
  )
}

export default RWrapper
