import { ErrorMessage, Form, Formik } from "formik";
import { ArrowLeft, Info, Star } from "lucide-react";
import React, { useState } from "react";
import { foodItemUpdateValidationSchema, foodItemValidationSchema } from "../../formik/FormValication";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage, serverUrl, serverUrlAPI } from "../../utils/Infos";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { Oval } from "react-loader-spinner";
import PageLoder from "../../components/PageLoder";
import ContentLoader from "../../components/ContentLoader";
import { ReviewCard } from "../customer/MenuItem";

const RFoodupdate = () => {
  const navigate = useNavigate();
  const { menuId } = useParams();

  const REVIEWS_LIMIT = 15;

  const fetchData = async () => {
    const response = await axiosInstance.get(
      serverUrlAPI + `menu/restaurant/menu/${menuId}`
    );
    return response.data;
  };

  const fetchReview = async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(`${serverUrlAPI}review/menuItem`, {
        params: {
          id: menuId,
          page: pageParam,
          limit: REVIEWS_LIMIT,
        },
      });
      const data = { ...response.data, prevParam: pageParam };
      return data;
    };

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["foodItem", menuId],
    queryFn: fetchData,
  });


  const updateItem = async (data) => {
    const response = await axiosInstance.put(
      serverUrl + "api/menu/update",
      data
    );
    return response.data;
  };

  const updateItemMutation = useMutation({
    mutationKey: "menu-add",
    mutationFn: updateItem,
  });

  const {
    data: reviewData,
    isLoading: reviewDataLoding,
    isFetchingNextPage: reviewFetchingNextPage,
    hasNextPage: hasNextReviewPage,
    fetchNextPage: fetchReviewNextPage,
  } = useInfiniteQuery({
    queryKey: ["item-reviews", menuId],
    queryFn: fetchReview,
    getNextPageParam: (lastPage) => {
      const { totalPages } = lastPage?.data;
      if (lastPage.prevParam === totalPages) {
        return undefined;
      }
      return lastPage.prevParam + 1;
    },
    enabled: data ? true : false,
  });


//   Shows while loading

  if (isLoading || isFetching) {
    return (
      <PageLoder/>
    );
  }



  if (isError) {
    return (
      <section className="w-full h-[80vh] flex justify-center items-center flex-col">
        <img
          src="https://thumbs.dreamstime.com/b/cute-dog-peeking-out-cracked-wall-beautiful-illustration-picture-generative-ai-301374583.jpg"
          alt=""
          className="w-[280px] md:w-[500px] h-[280px] md:h-[400px]"
        />
        <h1 className="text-2xl md:text-4xl font-extrabold text-center">Yenu Siklilla </h1>
      </section>
    );
  }

  const itemReviews = reviewData?.pages?.reduce((result, page) => {
    return (result = [...result, ...page?.data?.content]);
  }, []);

  const  {reviewsCount  , rating} = data;

  return (
     <>
      <section className="w-full max-w-[1800px] min-h-screen flex justify-center items-start p-2">
      <article className="p-2 rounded-lg shadow w-full max-w-[400px] mt-5">
        <div className="w-full flex justify-start items-center my-3">
          <span
            className="cursor-pointer p-1 px-2 rounded-xl bg-black text-white flex justify-center items-center gap-1 text-[0.8rem]"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-3 h-3" /> Back
          </span>
        </div>

        <h1 className="text-3xl font-normal text-center">Update Your Food </h1>
          
          <div className="w-[250px] h-[180px]  mx-auto mb-2 rounded-lg mt-4">
             <img
              src={data?.img} 
              className="w-full h-full  object-contain rounded-xl" 
              alt=""
              onError={(e) => (e.target.src = "https://static.thenounproject.com/png/504708-200.png")}/>
          </div>
          <div className="mt-2 flex justify-end items-center">
             <Star/> {rating}
          </div>
        <Formik
          initialValues={{
            name: data?.name,
            description: data?.description,
            category: data?.category?.replaceAll("#",""),
            price: data?.price,
            discount: data?.discount,
            image: data?.img,
            itemId :data?.itemId,
            available : data?.available+""
          }}
          enableReinitialize
          validationSchema={foodItemUpdateValidationSchema}
          onSubmit={(val, { resetForm }) => {

            const data = { ...val , available : parseInt(val.available)}

            updateItemMutation.mutate(val,{
                onSuccess:(data)=>{
                    toast.success("Food Item Updated Successfully")
                },
                onError:(error)=>{
                    toast.error(getErrorMessage(error));
                }
            })
          }}
        >
          {({ handleChange, handleBlur, values  }) => {
            return (
              <Form className="flex flex-col justify-start items-start p-3">
                <div className="mt-3 w-full relative">
                  <input
                    type="text"
                    name="itemId"
                    className="border border-gray-400 rounded-lg p-2 w-full "
                    placeholder="Menu Id"
                    value={values.itemId}
                    readOnly
                  />
                </div>

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
                  <p className="text-[0.5rem] flex justify-end items-center">
                    <Info className="w-2 h-2" />
                    use comma to separate categories
                  </p>
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
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (/^\d*$/.test(newValue)) {
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
                  <div className="w-full flex justify-start items-center gap-2">
                      <div  className="flex items-center justify-center gap-1">
                        <label htmlFor="">Available</label>
                        <input type="radio" name="available" value={"1"} onChange={handleChange} onBlur={handleBlur} checked={values.available === "1" ? true : false} />
                      </div>

                      <div  className="flex items-center justify-center gap-1">
                        <label htmlFor="">Un Available</label>
                        <input type="radio" name="available" value={"0"} onChange={handleChange} onBlur={handleBlur} checked={values.available === "0" ? true : false} />
                      </div>

                   </div> 
                  <ErrorMessage
                    name="available"
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
                  <button type="submit" className={`w-[80%] p-2 rounded-xl bg-[#feb80a] mx-auto flex justify-center items-center gap-2 ${updateItemMutation?.isPending ? " cursor-not-allowed " : " "}`}>
                    Update Item {updateItemMutation.isPending ? <Loader /> : <></>}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </article>
    </section>


    <section className="p-3 md:p-5 w-full mx-auto max-w-[1200px]">
    <h1 className="text-2xl font-normal"><span>Reviews</span>  <span>{reviewsCount}</span> </h1>
    <article className="p-2 w-full max-h-[30vh] overflow-auto py-3">
      {reviewDataLoding && (
        <div className="w-full p-2 flex justify-center items-center">
        <ContentLoader/>
     </div>
      )}

      {itemReviews?.length == 0 ? (
        <div className="flex w-full justify-center items-center">
          <span className="text-[0.8rem]">No reviews found</span>
        </div>
      ) : (
        itemReviews?.map((review, idx) => (
          <ReviewCard key={idx} data={review} />
        ))
      )}
      {reviewFetchingNextPage && (
        <div className="flex justify-center items-center">
          <ContentLoader />
        </div>
      )}

      {hasNextReviewPage && itemReviews?.length !== 0 && (
        <div className="w-full flex justify-center items-center">
          <span
            onClick={fetchReviewNextPage}
            className={`cursor-pointer text-[0.7rem] ${
              reviewFetchingNextPage && "cursor-not-allowed"
            }  `}
          >
            Load More
          </span>
        </div>
      )}
    </article>
  </section>
    </>
  );
};

export default RFoodupdate;
