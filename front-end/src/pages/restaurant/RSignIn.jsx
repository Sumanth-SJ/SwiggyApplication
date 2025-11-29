import { ErrorMessage, Form, Formik } from "formik";
import { Eye, EyeOff, LockKeyhole, Mail,} from "lucide-react";
import React, { useState } from "react";
import { customerLoginValidation, restaurantSignupSchema } from "../../formik/FormValication";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getErrorMessage, serverUrl } from "../../utils/Infos";
import Loader from "../../components/Loader";
import chef from '../../assets/img/cheif.png'

const RSignIn = () => {

  const navigate = useNavigate();  
  const [showPassword,setShowPassword] = useState(false);

  const handlePassworModeChange =()=>{
    setShowPassword((prev)=>!prev)
  } 


  const handleSignUpClick = ()=>{
     navigate("/restaurant/signup")
  }


  const signInhandler = async(data)=>{
    const response = await axios.post(serverUrl+"auth/restaurant/singin",data);
    return response.data;
  }


  const signInMutation = useMutation({
    mutationKey:"restaurant-signin",
    mutationFn:signInhandler,
    onSuccess:(data)=>{
         const {token} = data;
         localStorage.setItem("token",token); 
         toast.success("Logged In Successfully")
         setTimeout(()=>{
             navigate("/restaurant")  
         },500)
    },
    onError:(error)=>{
      console.error(error)
      toast.error(getErrorMessage(error));
    }
  })

  


  return (
    <section className="w-full h-screen bg-white relative flex justify-center items-center gap-0 p-4">
       <article className="hidden md:block  p-4 shadow-md me-[200px] translate-y-[-10%] rounded-lg">
         <h1 className="text-2xl font-semibold text-center">Where Every Bite Tells a Story!</h1>
          <img src={chef} alt="" className="scale-75" />
          <p className="text-[0.8rem] text-center">✨ "Serving the Magic of Flavor to the World!"</p>
       </article>

       <article className="p-2 md:p-5 w-[300px] md:w-[400px] translate-y-[10%]  rounded-lg shadow-md bg-white">
        <h1 className="text-center text-3xl">Restaurant Login</h1>
        <Formik
         initialValues={{email:"",password:""}}
         validationSchema={customerLoginValidation}
         onSubmit={(val)=>{
          signInMutation.mutate(val)
         }}
        >
          {({ handleChange, handleBlur, values }) => {
            return (
              <Form className="flex flex-col justify-start items-start">
               
                <div className="mt-3 w-full relative">
                 <div className="w-full relative">
                 <Mail className="absolute top-[50%] -translate-y-[50%] left-2 w-4 h-4"/>
                  <input
                    type="text"
                    name="email"
                    className="border border-gray-400 rounded-lg p-2 w-full ps-7"
                    placeholder="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                 </div>
                  <ErrorMessage
                    name="email"
                    component={"p"}
                    className="text-[0.7rem] text-red-500"
                  />
                </div>
               
                <div className="mt-3 w-full relative">
                <div className="w-full relative">
                  
                <LockKeyhole className="absolute top-[50%] -translate-y-[50%] left-2 w-4 h-4" />
                  <input
                    type={!showPassword ? "password" :"text"}
                    name="password"
                    className="border border-gray-400 rounded-lg p-2 w-full px-7 "
                    placeholder="Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {
                    !showPassword ?  <Eye className="absolute top-[50%] -translate-y-[50%] right-2 w-4 h-4 cursor-pointer" onClick={handlePassworModeChange} /> :  <EyeOff className="absolute top-[50%] -translate-y-[50%] right-2 w-4 h-4 cursor-pointer" onClick={handlePassworModeChange} />
                  }

                </div>
                  <ErrorMessage
                    name="password"
                    component={"p"}
                    className="text-[0.7rem] text-red-500"
                  />
                </div>
               
                  
                  <div className="w-full flex justify-center items-center mt-4">
                     <button 
                     className={`w-[80%] p-2 rounded-xl bg-[#feb80a] mx-auto flex justify-center items-center ${signInMutation.isPending ? "cursor-not-allowed" : ""} `}>
                        Sign In {signInMutation.isPending ? <Loader/> : <></>}
                      </button>
                  </div>

                  <div className="mt-2 flex justify-start items-center w-full">
                    <hr className="flex flex-1"/><span className="text-[0.5rem]">OR</span> <hr className="flex flex-1" />
                  </div>
                   
                  <p className="mt-2 text-center w-full text-[0.75rem]">
                    Don't have an account ? <span className="cursor-pointer" onClick={handleSignUpClick}>Sign Up</span>
                   </p>  
                   
                               </Form>
            );
          }}
        </Formik>
      </article>
    </section>
  );
};

export default RSignIn;

