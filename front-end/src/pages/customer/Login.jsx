import React, { useState } from "react";
import bg from "../../assets/img/SignInImage.png";
import burger from "../../assets/img/burger.png";
import emoji from "../../assets/img/emoji.png";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { ErrorMessage, Form, Formik } from "formik";
import { customerLoginValidation } from "../../formik/FormValication";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getErrorMessage, serverUrl } from "../../utils/Infos";
import Loader from "../../components/Loader";
import axios from "axios";
const Login = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const userSignIn = async (val) => {
    const response = await axios.post(serverUrl+"auth/user/signin",val);
    return response.data;
  };

  const signInMutation = useMutation({
    mutationKey: "customer-signIn",
    mutationFn: userSignIn,
    onSuccess: (data) => {
      const {token} = data;
      console.log(data)
     localStorage.setItem("token",token);
     toast.success("SignIn Successfully");
      setTimeout(() => {
        navigate("/");
      }, 500);
    },
    onError: (error) => {
      console.error(error);
      toast.error(getErrorMessage(error));
    },
  });

  const handleSignUpClick = () => {
    navigate("/user/register");
  };

  return (
    <section className="w-full h-screen max-w-[1800px] mx-auto">
      {/* For Desktop View */}

      <article className="w-full h-screen flex justify-start items-center">
        <div className="hidden lg:flex flex-1 justify-center items-center w-full  h-full md:">
          <div className="p-5 rounded-lg shadow-md flex flex-col justify-center items-center w-[350px] -translate-y-[100px] relative ">
            <h1 className="text-3xl ">Swiggy</h1>
            <div className="w-full h-[280px] relative">
              <img
                src={burger}
                alt=""
                className="absolute h-[180px] w-[180px] inset-0 m-auto z-10"
              />
              <img
                src={bg}
                alt=""
                className="w-full h-full object-cover  -z-10"
              />
            </div>

            <p className="text-center text-[0.8rem]">
              Login to access personalized recommendations, exclusive offers,
              and seamless food ordering.
            </p>

            <span className="p-1 mt-1 flex justify-start items-center">
              Let's Go{" "}
              <ArrowRight className="ms-2 cursor-pointer p-1 w-5 h-5 text-white bg-black rounded-full" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 justify-center items-center w-full  h-full">
          <div className="p-5 rounded-lg shadow-md  w-[300px] md:w-[350px] relative">
            <article className="absolute inset-0 mx-auto top-[-50px] w-full h-fit flex lg:hidden justify-center items-center">
              <span className="text-3xl">Swiggy</span>
              <img src={emoji} alt="" className="w-12 h-12" />
            </article>
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
                  <h2 className="text-2xl text-center ">LOG IN</h2>

                  <div className="w-full flex flex-col justify-start items-start mt-3">
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      className="border border-gray-300 rounded-xl p-2 w-full text-[0.9rem] placeholder:text-[0.9rem]"
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
                        className="border border-gray-300 rounded-xl p-2 w-full pe-4 text-[0.9rem] placeholder:text-[0.9rem]"
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
                      className={`w-[80%] mx-auto bg-[#feb80a] py-2 rounded-2xl flex justify-center items-center gap-2 ${
                        !isValid && "cursor-not-allowed"
                      } `}
                    >
                      Login { signInMutation.isPending && <Loader /> }
                    </button>
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
          </div>
        </div>
        
      </article>
    </section>
  );
};

export default Login;
