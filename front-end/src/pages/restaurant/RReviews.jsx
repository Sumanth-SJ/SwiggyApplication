import React from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { serverUrlAPI } from "../../utils/Infos";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import PageLoder from "../../components/PageLoder";
import Review from "../customer/Review";
import ContentLoader from "../../components/ContentLoader";
import ReactStar from 'react-rating-stars-component'
import { formatDate } from "../customer/MenuItem";
import { useNavigate } from "react-router-dom";

const RReviews = () => {
  const REVIEW_PAGE_LIMIT = 10;
  const queryClient = useQueryClient();

  const fetchReviews = async ({ pageParam = 1 }) => {
    const restaurantId = queryClient.getQueryData(["profile"]).restaurantId || 0;
    
    const data = {
      page: pageParam,
      limit: REVIEW_PAGE_LIMIT,
      restaurantId
    };

    const response = await axiosInstance.get(
      `${serverUrlAPI}review/restaurant`,
      {
        params: data,
      }
    );
    return {
      ...response.data,
      prevParam: pageParam,
    };
  };

  const {
    data: reviewData,
    isLoading: reviewLoading,
    hasNextPage: reviewHasNextPage,
    fetchNextPage: fetchReviewNextPage,
    isFetchingNextPage: reviewFetchingnextPage,
  } = useInfiniteQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
    getNextPageParam: (lastPage) => {
      const prevPage = lastPage.prevParam;
      const { totalPages } = lastPage;
      if (prevPage === totalPages) {
        return undefined;
      }
      return prevPage + 1;
    },
  });

  if (reviewLoading) {
    return <PageLoder />;
  }

  const reviewsList = reviewData?.pages?.reduce((result, page) => {
    return [...result, ...page?.reviews];
  }, []);

  return (
    <section className="w-full min-h-screen max-w-[1200px] mx-auto p-2 md:p-5">
      <h1 className="text-[1.2rem] md:text-[1.6rem]">Reviews</h1>

      {!reviewLoading && reviewsList?.length === 0 ? (
        <article className="w-full h-[80vh] flex justify-center items-center">
          <span className="text-[0.9rem] md:text-[1.1rem]">
            No Reviews Found
          </span>
        </article>
      ) : (
        reviewsList?.map((review, idx) => (
          <ReviewCard data={review} key={idx} />
        ))
      )}
      {reviewFetchingnextPage && (
        <div className="w-full flex justify-center items-center my-2">
          <ContentLoader />
        </div>
      )}
      {reviewHasNextPage && (
        <div className="w-full flex justify-center items-center my-2">
          <span
            className="text-[0.8rem] text-gray-700 cursor-pointer"
            onClick={fetchReviewNextPage}
          >
            Load More
          </span>
        </div>
      )}
    </section>
  );
};

export default RReviews;

const ReviewCard = ({ data }) => {
  console.log(data);

  const { review, menuItem, reviewedBy } = data;

  const { img ,name:foodName,itemId} = menuItem;

  const  {name :userName} = reviewedBy;

  const {rating ,comment ,createdAt} = review


  const navigate = useNavigate();

  const handleItemCLick = ()=>{
    navigate(`/restaurant/menu/update/${itemId}`)
  }

  return (
    <article className="w-full p-2 rounded-xl shadow-md my-2 text-[0.8rem] duration-500 hover:shadow-lg">
      <img
        src={img}
        alt=""
        className="w-[80px] h-[80px] rounded-md block cursor-pointer"
        onClick={handleItemCLick}

      />
      <h1>MenuItem : </h1>
      <h1 className="font-semibold cursor-pointer"  onClick={handleItemCLick}>{foodName}</h1>


      <h1 className="mt-3">By :</h1>
      <h1 >Name : {userName}</h1>
      <h1 className="flex justify-start items-center gap-1">Rating : <ReactStar size={"small"} count={5} value={rating} edit={false}/></h1>
      <h1>Comment: {comment}</h1>
      <h1 className="text-end text-[0.7rem] text-gray-500">Reviewed on {formatDate(createdAt)}</h1>
    </article>
  );
};
