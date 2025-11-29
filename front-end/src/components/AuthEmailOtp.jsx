import { ErrorMessage, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { emailValidation } from "../formik/FormValication";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getErrorMessage, serverUrl } from "../utils/Infos";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const AuthEmailOtp = () => {
    const [seachparam] = useSearchParams();
    const userType = seachparam.get("user")

    let redirectUrl="";
    if(userType === "customer")
    {
      redirectUrl = "/user/register"
    }else if(userType === "restaurant")
    {
      redirectUrl = "/restaurant/signup"
    }
    else if(userType === "delivery")
    {
      redirectUrl = "/delivery/signup"
    }

    const navigate = useNavigate();

    const requestOtp = async(val)=>{
        const data = { ...val ,userType}
        const response = await axios.post(serverUrl+"auth/otp",data);
        return response.data;  
    }



    const requestOtpMutation = useMutation({
       mutationKey:"otp-request",
       mutationFn:requestOtp,
       onSuccess:(data)=>{
             console.log(userType)
             const {success ,email} = data;
             toast.success("Otp sent successsfully to "+email)
             setTimeout(()=>{
                navigate(`/swiggy/auth/verify?email=${email}&redirectUrl=${redirectUrl+"?email="+email}&userType=${userType}`)
             },200)
       },
       onError:(error)=>{
           console.error(error)
           toast.error(getErrorMessage(error))
       }
     })

  const handleSignInClick =()=>{
    if(userType === "customer")
    {
      navigate("/user/login")
    }else if(userType === "restaurant")
    {
      navigate("/restaurant/signin")
    }
    else if(userType ==="delivery")
    {
      navigate("/delivery/signin")
    }
  }


  return (
    <section className="w-full h-screen flex justify-center flex-col md:flex-row  items-center relative overflow-hidden max-w-[1800px]">
       
       <article className="flex  md:flex-1 justify-center items-center md:items-center  flex-col">
           <span className="text-[2rem] md:text-[4rem] font-extrabold uppercase">Your <span className="text-[#feb80a]">hunger,</span> </span>
           <span className="text-[1.5rem] md:text-[3rem] font-normal  uppercase">their <span className="text-[#feb80a]">passion,</span>  </span>
           <span className="text-[1rem] md:text-[2rem] font-light uppercase"> our <span className="text-[#feb80a]">mission.</span> </span>
       </article>
       
       <article className="flex  md:flex-1 justify-center items-start md:items-center ">
       <article className="p-5 shadow-md shadow-gray-400  rounded-lg w-[300px] md:w-[350px] bg-white z-10 ">
        <h1 className="text-center text-3xl">Swiggy SignUp</h1>

        <Formik
         initialValues={{email:""}}
         validationSchema={emailValidation}
         onSubmit={(val)=>{
            requestOtpMutation.mutate(val)
         }}
        >
          {({handleChange,handleBlur,values}) => (
            <Form className="flex flex-col justify-start items-start">
              <div className="mt-3 w-full">
                <input
                  type="text"
                  name="email"
                  className="border border-gray-400 rounded-lg p-2 w-full"
                  placeholder="Email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                <ErrorMessage name="email" component={"p"} className="text-[0.7rem] text-red-500"/>
              </div>

              <div className="mt-3 w-full flex justify-center items-center">
                 <button type="submit" className={`w-[80%] p-1 bg-[#feb80a] rounded-xl flex justify-center items-center gap-1 ${requestOtpMutation.isPending ? "cursor-not-allowed " : ""}`}>Send OTP {requestOtpMutation.isPending ? <LoaderCircle className="w-4 h-4 animate-spin duration-[2000ms] ease-in-out" /> : <></>} </button>
              </div>
                
                <p className="mt-4 text-center text-[0.7rem] w-full">Already have an account? <span className="cursor-pointer ms-1" onClick={handleSignInClick}>SignIn</span></p>
            </Form>
          )}
        </Formik>
      </article>
       </article>


      
    </section>
  );
};

export default AuthEmailOtp;
