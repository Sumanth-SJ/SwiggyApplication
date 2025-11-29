import React from 'react'
import orderConfirm  from  '../../assets/orderConfirm.gif'
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
const navigate=useNavigate();
const handleOrderClick=()=>{
  navigate("/orders");
}
  return (
    <section className='w-full h-[80vh] flex justify-center items-center flex-col'>
        <img src={orderConfirm} alt="" className=' w-[300px] h-[300px]' />
        <span className='cursor-pointer text-[0.9rem]' onClick={handleOrderClick}>Go back to order</span>
    </section>
    
  )
}

export default OrderSuccess
