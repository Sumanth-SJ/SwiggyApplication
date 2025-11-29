import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/delivery/Navbar'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../utils/axiosInstance'
import { serverUrl } from '../../utils/Infos'
import PageLoder from '../../components/PageLoder'

const DWrapper = () => {

  const queryClient = useQueryClient();

  const fetchProfileData = async()=>{

    const response = await axiosInstance.get(`${serverUrl}delivery/profile`);

    return response.data;

  }

  const {data ,isLoading ,isError,error} = useQuery({
    queryKey:["profile"],
    queryFn:fetchProfileData,
    staleTime:Infinity,
    enabled: (localStorage.getItem("token") ? (queryClient.getQueryData(["profile"]) ? false  : true) :true)
  })

  if(isError)
  {
    console.log(error)
  }

  if(isLoading)
  {
    return <PageLoder/>
  }

  console.log(data)

  return (
    <section className='w-full max-w-[1800px] mx-auto '>
       <Navbar/>
        <section className='mx-auto w-full max-w-[1200px]'>
         <Outlet/>
        </section>
    </section>
  )
}

export default DWrapper
