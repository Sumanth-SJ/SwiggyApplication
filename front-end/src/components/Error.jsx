import React from 'react'
import dog from '../assets/img/dog-peeking.webp'
const Error = ({message = "Something Went Wrong"}) => {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <img src={dog} alt="" className='w-[500px] h-[400px]' />
      <p className='text-[0.9rem] text-center w-full'>{message}</p>
    </div>
  )
}

export default Error
