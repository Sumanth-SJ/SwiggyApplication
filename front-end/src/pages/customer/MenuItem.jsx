import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage, serverUrlAPI } from "../../utils/Infos";
import PageLoder from "../../components/PageLoder";
import { calculateDiscount } from "./Menu";
import { IndianRupee, Star, Tag } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import ContentLoader from "../../components/ContentLoader";
import { Oval } from "react-loader-spinner";
import ReactStar from "react-rating-stars-component";

const MenuItem = () => {
  const [searchParam] = useSearchParams();
  const [isSaved, setSaved] = useState(false);
  const queryClient = useQueryClient();

  const REVIEWS_LIMIT = 5;

  const navigate = useNavigate();

  const menuDataFetch = async () => {
    const menuId = searchParam.get("id");
    if (menuId === null) {
      return;
    }

    const response = await axiosInstance.get(`${serverUrlAPI}menu/${menuId}`);
    return response.data;
  };

  const restaurantDataFetch = async (restaurantId) => {
    const response = await axiosInstance.get(
      `${serverUrlAPI}restaurant/${restaurantId}`
    );
    return response.data;
  };

  const addToCart = async (val) => {

    const userId = queryClient.getQueryData(["profile"])?.userId || 0 ;
    val = {...val,userId}
    const response = await axiosInstance.post(`${serverUrlAPI}cart/add`, val);
    return response.data;
  };

  const fetchReview = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(`${serverUrlAPI}review/menuItem`, {
      params: {
        id: searchParam.get("id"),
        page: pageParam,
        limit: REVIEWS_LIMIT,
      },
    });
    const data = { ...response.data, prevParam: pageParam };
    return data;
  };

  const fetchSimilarItems = async (categories) => {
    const response = await axiosInstance.get(`${serverUrlAPI}menu/similar`, {
      params: {
        q: categories || "",
        page: 1,
        limit: 8,
      },
    });

    return response.data;
  };

  const {
    data: foodData,
    isFetching: foodFetching,
    isLoading: foodLoading,
    isError: isFoodError,
    error: foodError,
  } = useQuery({
    queryKey: ["menu_item", searchParam.get("id")],
    queryFn: menuDataFetch,
  });

  const {
    data: reviewData,
    isLoading: reviewDataLoding,
    isFetchingNextPage: reviewFetchingNextPage,
    hasNextPage: hasNextReviewPage,
    fetchNextPage: fetchReviewNextPage,
  } = useInfiniteQuery({
    queryKey: ["reviews", searchParam.get("id")],
    queryFn: fetchReview,
    getNextPageParam: (lastPage) => {
      const { totalPages } = lastPage?.data;
      if (lastPage.prevParam === totalPages) {
        return undefined;
      }
      return lastPage.prevParam + 1;
    },
    enabled: foodData ? true : false,
  });

  useEffect(() => {
    if (foodData?.isSaved) {
      setSaved(true);
    }
  }, [foodData]);

  const { data: restaurantData  ,isError,error} = useQuery({
    queryKey: ["restauarnt", foodData?.restaurantId],
    queryFn: () => restaurantDataFetch(foodData?.restaurantId),
    enabled: foodData?.restaurantId ? true : false,
  });

  if(isError)
  {
    console.log(error)
  }

  const { data: similarItemData, isLoading: loadingSimilarData } = useQuery({
    queryKey: ["similar", searchParam.get("id")],
    queryFn: () =>
      fetchSimilarItems(foodData?.MenuItem?.category.replaceAll("#", "")),
    enabled: foodData ? true : false,
  });

  const cartAddMutate = useMutation({
    mutationKey: ["cart-add", searchParam.get("id")],
    mutationFn: addToCart,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Item Added To Cart");
      setSaved(true);
    },
    onError: (err) => {
      const {status} =err?.response;
      if(status ===401)
      {
        toast.error("Please Login");
        return;
      }

      toast.error(getErrorMessage(err));
    },
  });

  const handleAddToCartBtnClick = () => {
    const data = { menuId: searchParam.get("id") };
    cartAddMutate.mutate(data);
  };

  const itemReviews = reviewData?.pages?.reduce((result, page) => {
    return (result = [...result, ...page?.data?.content]);
  }, []);


  const handleBuyClick =()=>{

    if(!sessionStorage.getItem("user"))
      {  
          navigate("/user/login");
          return;
      }

    const data = [{
      quantity :1,
      menuItem:MenuItem
    }]


    navigate("/checkout",{
      state :{
          source :"none",
          checkoutDetails:data
      }
   })

  }

  

  if (foodFetching) {
    return <PageLoder />;
  }

  const { MenuItem, restaurantId } = foodData  || {};

  const { img, name, description, discount, price, category ,available } = MenuItem || {};

  const { name: restaurantName } = restaurantData || {};

  const similarItemDataContent = similarItemData?.content?.filter((item)=>item?.itemId!== parseInt(searchParam.get("id")));

  return (
    <>
      <section className="w-full mx-w-[1200px] mx-auto p-3 md:p-5 flex flex-col md:flex-row  justify-start md:justify-start items-center md:items-start">
        <article className="w-[300px]">
          <img src={img} alt="" className="w-[300px] h-[250px] rounded-lg" />
        </article>

        <article className="flex flex-1 flex-col justify-start items-start p-0  md:p-5  h-full">
          <h1 className="text-[1.8rem] font-semibold">{name}</h1>
          <p className="text-[0.9rem] mt-5">
            <span className="text-black">Description : </span>
            <span className="text-gray-500">{description}</span>
          </p>
          <div className="text-[1.5rem] font-semibold mt-1 flex justify-start items-center gap-1">
            <span className="text-black ">Price : </span>
            <IndianRupee className="h-4 w-4" />
            {discount > 0 ? (
              <div className="flex justify-start items-center gap-1">
                <strike>{price}</strike>
                <span>{calculateDiscount(price, discount)}</span>
                <span className="p-1 text-[0.7rem] font-semibold text-white bg-green-500 rounded-full">
                  {discount}%
                </span>
              </div>
            ) : (
              <span>{price}</span>
            )}
          </div>
          <div className="flex justify-start items-center gap-1 text-[0.9rem]">
            <span className="">Category : </span>
            {category?.split(",")?.map((cat, idx) => (
              <CustomTag key={idx} val={cat} />
            ))}
          </div>
          {
          available === 0 && <span className="mt-3 text-red-500 px-2 py-[2px] rounded-full border border-red-600 text-[0.7rem] font-normal">Not Available</span>
        }
          <div className="flex justify-start items-center text-[0.9rem]">
            <span>Restaurant : </span>
            <span className="text-gray-500">{restaurantName}</span>
          </div>

          <div className="flex justify-start items-center gap-3 mt-4 ps-3">
            <button
            disabled={available ===0 ? true :false}
            className={`text-[0.8rem] p-1 rounded-3xl bg-[#feb80a] px-3 duration-300 ${available ===0 && "cursor-not-allowed"}`} onClick={handleBuyClick}>
              Buy
            </button>
            {isSaved ? (
              <button className="text-[0.8rem] p-1 rounded-3xl border border-gray-950 bg-white px-2 flex justify-center ite gap-1">
                Saved To Cart
              </button>
            ) : (
              <button
                disabled={cartAddMutate?.isPending ? true : false}
                className="text-[0.8rem] p-1 rounded-3xl border border-gray-950 bg-white px-2 flex justify-center ite gap-1"
                onClick={handleAddToCartBtnClick}
              >
                Add to Cart {cartAddMutate.isPending && <Loader />}
              </button>
            )}
          </div>
        </article>
      </section>

      {/* Top Review Section */}

      <section className="p-3 md:p-5 w-full">
        <h1 className="text-2xl font-normal">Reviews</h1>
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

      {/* Similar Suggestion   */}

      <section className="p-3 md:p-5 w-full ">
        <h1 className="text-2xl font-normal">You May Also Like</h1>
        {
          loadingSimilarData && <div className="w-full p-2 flex justify-center items-center">
             <ContentLoader/>
          </div>
        }
        {similarItemDataContent?.length === 0 && !loadingSimilarData && (
          <div className="w-full flex justify-center items-center p-2 text-[0.8rem]">
            No Simliar Data Found
          </div>
        )}

        {!loadingSimilarData && similarItemDataContent?.length > 0 && (
          <div className="w-full p-3 flex justify-start items-center gap-2 overflow-auto">
            {similarItemDataContent?.map((item, idx) => (
              <SimilarFoodCard data={item} key={idx} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default MenuItem;

const CustomTag = ({ val }) => {
  const cat = val;
  return (
    <span className="flex justify-start items-center gap-1 px-2 text-[0.8rem] bg-yellow-400 rounded-full">
      <Tag className="h-3 w-3" />
      <span>{cat?.replaceAll("#", "")}</span>
    </span>
  );
};

export const ReviewCard = ({ data }) => {
  const { comment, user, rating, createdAt } = data;

  return (
    <article className="w-full p-1 my-2 rounded-lg shadow-sm shadow-[#ededed] border ">
      <div className="flex justify-between items-start gap-2 text-[0.65rem]">
        <span className="flex justify-start items-center gap-1">
          Rating <ReactStar count={5} value={rating} isHalf={true} edit={false} />
        </span>
        <span>
          {user?.name} ,{formatDate(createdAt)}
        </span>
      </div>
      <h1 className="text-[0.8rem]">Comment:</h1>
      <p className="p-1 rounded-md text-[0.7rem]">{comment}</p>
    </article>
  );
};

export const SimilarFoodCard = ({ data }) => {

  const navigate = useNavigate();

  const { img, name ,itemId ,rating ,price } = data;

  const handleCardClick = ()=>{
    navigate(`/menu/item?id=${itemId}`)
  }

  return (
    <article 
     onClick={handleCardClick}
     className="w-[180px] md:w-[280px] p-2 shadow-sm hover:shadow-lg rounded-xl flex flex-col justify-start items-start flex-shrink-0 flex-grow-0 duration-500 hover:scale-95 cursor-pointer">
      <img src={img} alt="" className="w-full h-[100px] md:h-[180px] rounded-md" />
      <h1 className=" flex justify-start items-center w-full">
        <span className="text-[0.98rem] md:text-[1.2rem] font-semibold w-full whitespace-nowrap overflow-hidden text-ellipsis">{name}</span>
      </h1>
      <h1 className="flex justify-end items-center font-semibold w-full">
        <span className="p-[1px] px-2 rounded-full bg-yellow-400 flex justify-start items-center "><IndianRupee size={15} /> {price}</span>
      </h1>
    </article>
  );
};


export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
