import { IndianRupee } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDate } from '../customer/MenuItem';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../utils/axiosInstance';
import { getErrorMessage, serverUrlAPI } from '../../utils/Infos';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Loader from '../../components/Loader';

const DOrderItem = () => {

  const [openModal,setModalOpen] = useState(false);
  const navigate = useNavigate();

  const deliveryCodeInputRef = useRef();
  const [delivered,setDelivered] = useState(false);

  const queryClient = useQueryClient();


  useEffect(()=>{
     if(openModal)
     {
        document.body.style.overflow ="hidden"
     }else{
        document.body.style.overflow ="auto"
     }
  },[openModal])

  const location  = useLocation();
  
  const {orderDetails :orderItemDetails} = location.state;

  const { deliveryId, order } = orderItemDetails || {};

  const { orderItem, payMode, totalAmount ,Restauarnt ,deliveryAddress ,orderDate ,OrderedBy ,status  } = order||{};

  useEffect(()=>{
      if(status === "delivered")
      {
        setDelivered(true)
      }else{
        setDelivered(false);
      }
  },[status])

  const { MenuItem ,orderDetails } = orderItem[0] ||{};

  const { img, name } = MenuItem ||{};

  const {quantity} = orderDetails||{};

  const {name:restaurantName ,phoneNumber:restaurantContactNo} = Restauarnt;
  const {name:customerName ,phoneNumber:customerNumber} = OrderedBy;



  const orderDelivery = async()=>{
    const response = await axiosInstance.put(`${serverUrlAPI}deliveries/order/verify/status`,{
        deliveryId,
        deliveryCode : deliveryCodeInputRef.current.value
    })
    return response.data;
  }


  const orderDliveryMutation  = useMutation({
    mutationKey:["deliver-order",deliveryId],
    mutationFn:orderDelivery,
    onSuccess:(result)=>{
      toast.success("Order Delivered Successfully");
      setModalOpen(false);
      queryClient.invalidateQueries(["deliveries"]);
      setDelivered(true);
       
    },
    onError:(error)=>{
        toast.error(getErrorMessage(error))
    }
  })



  const handleSubmitClick = ()=>{

    if(deliveryCodeInputRef.current.value === "")
    {
        toast.error("Delivery Code Required");
        return;
    }

    orderDliveryMutation.mutate();

  }

  return (
    <>
      <article className='mb-4'>
         <button 
         className='text-[0.9rem] px-2 py-1 rounded-full'
         onClick={()=>navigate(-1)}>Back</button>
      </article>
      <section 
    className='p-2 md:p-5'>
      <h1 className='text-[1rem] md:text-[1.5rem]'>Order</h1>
      <article className='mt-3 flex justify-start items-start gap-2'>
          <img src={img} className='w-[80px] h-[80px] rounded-lg md:w-[120px] md:h-[120px]' alt="" />
          <div className='text-[0.8rem]'>
            <h1>{name}</h1>
            <h1>Quanity : {quantity}</h1>
            <h1>
            {payMode === "COD" ? (
              <span className="text-[0.7rem] px-2 py-[1px] rounded-full bg-green-700 text-white">
                Amount to collect
              </span>
            ) : (
              <span className="text-[0.7rem] px-[3px] py-[1px] rounded-full bg-green-700">
                Paid
              </span>
            )}
            <span className="flex justify-start items-center font-semibold">
              <IndianRupee size={11} /> {totalAmount}
            </span>
          </h1>
          <h1>Delivery Adddress : {deliveryAddress}</h1>
          <h1>Ordered On : {formatDate(orderDate)}</h1>
          </div>
      </article>
      <article className='mt-2 text-[0.8rem]'>
        <h1>Restaurant : {restaurantName}</h1>
         <h1>Contact No : {restaurantContactNo} </h1>

         <h1 className='mt-3'>Ordered By</h1>
         <h1>{customerName}</h1>
         <h1>{customerNumber}</h1>
      </article>

       {
        !delivered && <article className='flex justify-end items-centermy-3'>
        <button 
        className='text-[0.85rem] px-2 py-1 rounded-full bg-orange-600 text-white'
        onClick={()=>setModalOpen(true)}>Delivered</button>
    </article>
       }

    </section>
    {
        openModal && <section 
        className='fixed top-0 left-0 h-screen w-full flex justify-center items-center bg-black bg-opacity-30'
        onClick={()=>{
            setModalOpen(false)
        }}>
             
             <article 
             className='p-3 rounded-lg bg-white w-full max-w-[400px]'
             onClick={(e)=>e.stopPropagation()}>
                <h1>Enter the Delivery Code</h1>
                <input type="text" ref={deliveryCodeInputRef} className='mt-3 shadow-md p-2 rounded-lg w-full' placeholder='Delivery code' />
                <footer className='flex justify-end items-center gap-2 mt-5'>
                   <button 
                   className='text-[0.85rem] px-2 py-1 rounded-md'
                   onClick={()=>{
                    setModalOpen(false)
                }}>Cancel</button>
                   <button 
                   disabled={orderDliveryMutation.isPending}
                   className='text-[0.85rem] flex justify-center items-center gap-2 px-2 py-1 rounded-md bg-orange-600 text-white'
                   onClick={handleSubmitClick}>Submit {orderDliveryMutation.isPending && <Loader/>} </button>
                </footer>
             </article>
    
        </section>
    }
    </>

  )
}

export default DOrderItem
