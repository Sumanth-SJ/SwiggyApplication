import { ErrorMessage, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { emailValidation, otpValidation } from "../formik/FormValication";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getErrorMessage,  serverUrl } from "../utils/Infos";
import { Loader } from "lucide-react";

const AuthEmailVerify = () => {

  const [searchParam] = useSearchParams();
  const email  = searchParam.get("email");
  const redirectUrl = searchParam.get("redirectUrl");
  const userType = searchParam.get("userType");
  const navigate = useNavigate();

  const [startTimer ,setStartTimer] = useState(email!==""?true:false);




  const requestOtp = async(val)=>{
    const data = { ...val ,userType}
    const response = await axios.post(serverUrl+"auth/otp",data);
    return response.data;
    
}

const requestOtpMutation = useMutation({
   mutationKey:"otp-request",
   mutationFn:requestOtp,
   onSuccess:(data)=>{
         const {success ,email} = data;
         toast.success("Otp send successfully to "+email);
         setStartTimer(true);
   },
   onError:(error)=>{
       console.error(error)
       toast.error(getErrorMessage(error))
   }
 })


 const verifyOtp = async(val)=>{
  const data = {email,...val}
  const response = await axios.post(serverUrl+"auth/otp/verify",data);
  return response.data;
 }

 const verifyOtpMutation = useMutation({
  mutationKey:"verify-otp",
  mutationFn:verifyOtp,
  onSuccess:(data)=>{
     const {success} = data;
     if(success)
     {
        toast.success("Email verified");
        setTimeout(()=>{
          navigate(redirectUrl)
        } ,800)
     }
  },
  onError:(error)=>{
    console.error(error);
    toast.error(getErrorMessage(error));
  }
 })


  const handleTimeFinish =()=>{
    setStartTimer(false)
  }

  const handleResendClick =()=>{
    alert("Hai")
     requestOtpMutation.mutate({
      email,userType
     })
  }

  return (
    <section className="w-full h-screen flex justify-center items-center relative">
      <article className="p-5 shadow-md rounded-lg absolute right-11 top-[50%] -translate-y-[50%] w-[350px]">
        <h1 className="text-center text-3xl">Email Verification</h1>

        <div className="mt-3 w-full">
          <input
            type="text"
            name="email"
            className="border border-gray-400 rounded-lg p-2 w-full"
            placeholder="Email"
            readOnly
            value={email}
            disabled
          />
        </div>

        <Formik
          initialValues={{ otp: "" }}
          validationSchema={otpValidation}
          onSubmit={(val) => {
            verifyOtpMutation.mutate(val)
          }}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form className="flex flex-col justify-start items-start">
              <div className="mt-3 w-full">
                <input
                  type="text"
                  name="otp"
                  className="border border-gray-400 rounded-lg p-2 w-full"
                  placeholder="Otp"
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (/^\d*$/.test(newValue)) {
                      handleChange(e);
                    }
                  }}
                  onBlur={handleBlur}
                  value={values.otp}
                />
                <ErrorMessage
                  name="otp"
                  component={"p"}
                  className="text-[0.7rem] text-red-500"
                />
              </div>
               <div className="flex justify-end items-center w-full">
                  {
                    startTimer ? <Timer key={"timer"} className="text-[0.7rem]" onComplete={handleTimeFinish} secondsValue={12} /> : <span className="text-[0.7rem] cursor-pointer" onClick={handleResendClick}>Resend</span>
                  }
                </div> 

              <div className="mt-3 w-full flex justify-center items-center">
                <button
                  type="submit"
                  className={`w-[80%] p-1 bg-[#feb80a] flex justify-center items-start gap-1 rounded-xl ${(requestOtpMutation.isPending || verifyOtpMutation.isPending) ? "cursor-not-allowed" :""}`}
                >
                  Verify OTP { verifyOtpMutation.isPending ? <Loader/> : <></>}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </article>
    </section>
  );
};

export default AuthEmailVerify;


const Timer = ({
  title = "Resend in ",
  secondsValue = 20,
  onComplete = () => {},
  className = ""
}) => {
  const [seconds, setSeconds] = useState(secondsValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <span className={className}>
      {
        seconds > 0 && (title +formatTime()) 
      }
    </span>
  );
};
