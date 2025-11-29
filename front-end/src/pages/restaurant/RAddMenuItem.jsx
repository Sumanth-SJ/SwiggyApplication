import { ErrorMessage, Form, Formik } from "formik";
import { ArrowLeft, Info } from "lucide-react";
import React, { useState } from "react";
import { foodItemValidationSchema } from "../../formik/FormValication";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage, serverUrl } from "../../utils/Infos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const RAddMenuItem = () => {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

    const addItem  = async(data)=>{
      const restaurantId = queryClient.getQueryData(["profile"]).restaurantId || 0;
       data = { ...data , restaurantId}
        const response = await axiosInstance.post(serverUrl+"api/menu/create",data)
        return response.data;
    }

    const addItemMutation  = useMutation({
        mutationKey:"menu-add",
        mutationFn:addItem,
        onSuccess:(result)=>{
          toast.success("Food Added to your Menu")
        },
        onError:(error)=>{
          toast.error(getErrorMessage(error))
        }
    })


  return (
    <section className="w-full min-h-screen flex justify-center items-start p-2">
      <article className="p-2 rounded-lg shadow w-full max-w-[400px] mt-5">
         
         <div className="w-full flex justify-start items-center my-3">
              <span
              className="cursor-pointer p-1 px-2 rounded-xl bg-black text-white flex justify-center items-center gap-1 text-[0.8rem]"
              onClick={()=>navigate(-1)}>
                <ArrowLeft  className="w-3 h-3"/> Back 
                </span>
         </div>

        <h1 className="text-3xl font-normal text-center">Add Your Food </h1>
        <Formik
          initialValues={{ name: "", description: "" , category:"",price:"",discount:"",image:""}}
          validationSchema={foodItemValidationSchema}
          onSubmit={(val ,{ resetForm }) => {
            addItemMutation.mutate(val , {
                onSuccess:(data)=>{
                    toast.success("Your Food Added");
                    setTimeout(()=>{
                        resetForm();
                    },500)
                    console.log(data)
                },
                onError:(error)=>{
                    console.error(error);
                    toast.error(getErrorMessage(error));
                }  
            })
          }}
        >
          {({ handleChange, handleBlur, values }) => {
            return (
              <Form className="flex flex-col justify-start items-start p-3">
                <div className="mt-3 w-full relative">
                  <input
                      type="text"
                      name="name"
                      className="border border-gray-400 rounded-lg p-2 w-full "
                      placeholder="Food Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                  <ErrorMessage
                    name="name"
                    component={"p"}
                    className="text-[0.7rem] text-red-500"
                  />
                </div>


                <div className="mt-3 w-full relative">
                  <input
                      type="text"
                      name="description"
                      className="border border-gray-400 rounded-lg p-2 w-full "
                      placeholder="Description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                    />
                  <ErrorMessage
                    name="description"
                    component={"p"}
                    className="text-[0.7rem] text-red-500"
                  />
                </div>

                <div className="mt-3 w-full relative">
                  <input
                      type="text"
                      name="category"
                      className="border border-gray-400 rounded-lg p-2 w-full "
                      placeholder="Category"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.category}
                    />
                  <ErrorMessage
                    name="category"
                    component={"p"}
                    className="text-[0.7rem] text-red-500"
                  />
                  <p className="text-[0.5rem] flex justify-end items-center"><Info className="w-2 h-2" />use comma to separate categories</p>
                </div>

                <div className="mt-3 w-full relative">
                  <input
                      type="text"
                      name="price"
                      className="border border-gray-400 rounded-lg p-2 w-full "
                      placeholder="Price"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.price}
                    />
                  <ErrorMessage
                    name="price"
                    component={"p"}
                    className="text-[0.7rem] text-red-500"
                  />
                </div>

                <div className="mt-3 w-full relative">
                  <input
                      type="text"
                      name="discount"
                      className="border border-gray-400 rounded-lg p-2 w-full "
                      placeholder="Discount"
                      onChange={(e)=>{
                        const newValue = e.target.value;
                        if(/^\d*$/.test(newValue))
                        {
                            handleChange(e);
                        }
                      }}
                      onBlur={handleBlur}
                      value={values.discount}
                    />
                  <ErrorMessage
                    name="discount"
                    component={"p"}
                    className="text-[0.7rem] text-red-500"
                  />
                </div>
                <div className="mt-3 w-full relative">
                  <input
                      type="text"
                      name="image"
                      className="border border-gray-400 rounded-lg p-2 w-full "
                      placeholder="Image Url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.image}
                    />
                  <ErrorMessage
                    name="image"
                    component={"p"}
                    className="text-[0.7rem] text-red-500"
                  />
                </div>

                <div className="w-full flex justify-center items-center mt-4">
                  <button className="w-[80%] p-2 rounded-xl bg-[#feb80a] mx-auto flex justify-center items-center gap-2">
                    Add Item {addItemMutation.isPending ? <Loader /> : <></>}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </article>
    </section>
  );
};

export default RAddMenuItem;
