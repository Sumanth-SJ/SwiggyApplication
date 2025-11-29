import { ErrorMessage, Form, Formik } from "formik";
import { Eye, EyeOff, LockKeyhole, Mail, MapPin, Phone, User } from "lucide-react";
import React, { useState } from "react";
import { deliverySignUpSchema, restaurantSignupSchema } from "../../formik/FormValication";
import axios from "axios";
import { getErrorMessage, serverUrl } from "../../utils/Infos";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";

const DSignup = () => {

  const [showPassword,setShowPassword] = useState(false);
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();

  const verifiedEmail = searchParam.get("email")

  const handlePassworModeChange =()=>{
    setShowPassword((prev)=>!prev)
  } 

  const addSignUpData = async(data)=>{
    const response = await axios.post(serverUrl+"auth/delivery/signup",data);
    return response.data;
  }


  const signUpMutation = useMutation({
    mutationKey:"delivery-signup",
    mutationFn:addSignUpData,
    onSuccess:(data)=>{
        const {token} = data;
        localStorage.setItem("token",token);
         toast.success("Account Created Successfully")
         setTimeout(()=>{
              navigate("/delivery")
         },500)
    },
    onError:(error)=>{
      console.error(error)
      toast.error(getErrorMessage(error));
    }
  })

  const handleSignInClick = ()=>{
    navigate("/delivery/signin")
  }


  return (
    <section className="w-full h-screen bg-white relative">
      <article className="p-2 md:p-5 w-[300px] md:w-[400px] absolute top-[50%] -translate-y-[50%] right-5 rounded-lg shadow-md bg-white">
        <h1 className="text-center text-3xl">User Sign Up</h1>
        <Formik
         initialValues={{name:"",email:"",vehicleNumber:"",password:"",cpassword:"",phoneNumber:""}}
         validationSchema={deliverySignUpSchema}
         onSubmit={(val)=>{
           signUpMutation.mutate(val)
         }}
        >
          {({ handleChange, handleBlur, values }) => {
            return (
              <Form className="flex flex-col justify-start items-start">
                <div className="mt-3 w-full">
                  <div className="w-full relative">
                  <User className="absolute top-[50%] -translate-y-[50%] left-2 w-4 h-4"/>
                  <input
                    type="text"
                    name="name"
                    className="border border-gray-400 rounded-lg p-2 w-full ps-7"
                    placeholder="Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />    
                  </div> 
                  <ErrorMessage
                    name="name"
                    component={"p"}
                    className="text-[0.7rem] text-red-500"
                  />
                </div>
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
                 <Phone className="absolute top-[50%] -translate-y-[50%] left-2 w-4 h-4"/>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="border border-gray-400 rounded-lg p-2 w-full ps-7"
                    placeholder="Mobile"
                    onChange={(e)=>{
                      const newValue = e.target.value;
                      if (/^\d*$/.test(newValue)) {
                        if(newValue.length<=10)
                        {
                          handleChange(e);
                        }
                      }
                    }}
                    onBlur={handleBlur}
                    value={values.phoneNumber}
                  />

                 </div>
                  <ErrorMessage
                    name="phoneNumber"
                    component={"p"}
                    className="text-[0.7rem] text-red-500"
                  />
                </div>
                <div className="mt-3 w-full relative">
                  <div className="w-full relative">
                  <MapPin className="absolute top-[50%] -translate-y-[50%] left-2 w-4 h-4" />
                  <input
                    type="text"
                    name="vehicleNumber"
                    className="border border-gray-400 rounded-lg p-2 w-full ps-7"
                    placeholder="Vehicle Number"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                  />

                  </div>
                  <ErrorMessage
                    name="vehicleNumber"
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
                <div className="mt-3 w-full relative">
                <div className="w-full relative">
                <LockKeyhole className="absolute top-[50%] -translate-y-[50%] left-2 w-4 h-4" />
                  <input
                    type="text"
                    name="cpassword"
                    className="border border-gray-400 rounded-lg p-2 w-full ps-7"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.cpassword}
                  />
                </div>
                {
                  (values.password!=="" && values.password === values.cpassword) && <p className="text-[0.7rem] text-green-500">Password Matched</p>
                }
                  <ErrorMessage
                    name="cpassword"
                    component={"p"}
                    className="text-[0.7rem] text-red-500"
                  />
                </div>
                  
                  <div className="w-full flex justify-center items-center mt-4">
                     <button 
                     className={`w-[80%] p-2 rounded-xl bg-orange-600 text-white flex justify-center items-center mx-auto ${signUpMutation.isPending ? "cursor-not-allowed" : ""} `} type="submit">
                        SignUp { signUpMutation.isPending ? <Loader/> : <></>}
                      </button>
                  </div>

                  <div className="mt-2 flex justify-start items-center w-full">
                    <hr className="flex flex-1"/><span className="text-[0.5rem]">OR</span> <hr className="flex flex-1" />
                  </div>
                   
                   <p className="mt-2 text-center w-full text-[0.75rem]">
                    Already have an account ? <span className="cursor-pointer" onClick={handleSignInClick}>Sign In</span>
                   </p>
              </Form>
            );
          }}
        </Formik>
      </article>
    </section>
  );
};

export default DSignup;
