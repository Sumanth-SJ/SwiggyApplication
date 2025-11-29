import { ErrorMessage, Form, Formik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getErrorMessage, serverUrl } from "../../utils/Infos";
import toast from "react-hot-toast";
import { customerLoginValidation } from "../../formik/FormValication";

const DSignin = () => {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const deliverySignIn = async (val) => {
    const response = await axios.post(serverUrl+"auth/delivery/signin",val);
    return response.data;
  };

  const signInMutation = useMutation({
    mutationKey: "delivery-signIn",
    mutationFn: deliverySignIn,
    onSuccess: (data) => {
      const {token ,userDetails} = data;
     localStorage.setItem("token",token);
     
     toast.success("SignIn Successfully");
      setTimeout(() => {
        navigate("/delivery");
      }, 500);
    },
    onError: (error) => {
      console.error(error);
      toast.error(getErrorMessage(error));
    },
  });


    const handleSignUpClick = () => {
        navigate("/delivery/signup");
      };


  return (
    <section className="w-full h-screen p-2 md:p-5 relative">
      <article 
      className="p-3 rounded-lg shadow-md absolute top-[50%] translate-y-[-50%] right-[50%] translate-x-[50%] md:right-8 md:translate-x-[0%] w-full max-w-[300px] md:max-w-[350px]">
        <Formik
         initialValues={{ email: "", password: "" }}
         validationSchema={customerLoginValidation}
         onSubmit={(val) => {
                signInMutation.mutate(val)
              }}
            >
              {({
                handleChange,
                handleBlur,
                values,
                touched,
                errors,
                isValid,
              }) => (
                <Form>
                  <h2 className="text-2xl text-center ">Delivery Signin</h2>

                  <div className="w-full flex flex-col justify-start items-start mt-3">
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      className="border border-gray-300 rounded-xl p-2 w-full"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <ErrorMessage
                      name="email"
                      className="text-[0.7rem] text-red-500"
                      component={"p"}
                    />
                  </div>

                  <div className="w-full flex flex-col justify-start items-start mt-4">
                    <div className="w-full relative">
                      <input
                        type={!showPassword ? "password" : "text"}
                        name="password"
                        placeholder="Password"
                        className="border border-gray-300 rounded-xl p-2 w-full pe-4"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                      <span className="absolute right-1 top-[50%] translate-y-[-50%]  my-auto">
                        {!showPassword ? (
                          <Eye
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => setShowPassword(true)}
                          />
                        ) : (
                          <EyeOff
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => setShowPassword(false)}
                          />
                        )}
                      </span>
                    </div>
                    <ErrorMessage
                      name="password"
                      className="text-[0.7rem] text-red-500"
                      component={"p"}
                    />
                  </div>

                  <div className="w-full flex justify-center items-center mt-4">
                    <button
                      type="submit"
                      className={`w-[80%] mx-auto bg-orange-600 text-white py-2 rounded-2xl flex justify-center items-center gap-2 ${
                        !isValid && "cursor-not-allowed"
                      } `}
                    >
                      Login { signInMutation.isPending && <Loader /> }
                    </button>
                  </div>

                   <div className="flex justify-center items-center my-5 gap-2">
                    <hr  className="flex-1"/>
                    <span className="text-[0.6rem] text-gray-600 uppercase">or</span>
                    <hr  className="flex-1"/>
                   </div>
                    

                  <div className="w-full flex justify-center items-center mt-4">
                    <p className="flex justify-start items-center text-[0.75rem]">
                      Don't have an account?
                      <span
                        className="ms-1 cursor-pointer"
                        onClick={handleSignUpClick}
                      >
                        Sign up
                      </span>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
      </article>
    </section>
  );
};

export default DSignin;
