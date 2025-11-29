import React from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { serverUrlAPI } from "../../utils/Infos";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import PageLoder from "../../components/PageLoder";
import ContentLoader from "../../components/ContentLoader";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const ORDER_PAGE_LIMIT = 5;
  const queryClient = useQueryClient();


  const getOrders = async ({ pageParam = 1 }) => {

    const userId = queryClient.getQueryData(["profile"])?.userId || 0;

   
    const response = await axiosInstance.get(`${serverUrlAPI}order/user`, {
      params: {
        page: pageParam,
        limit: ORDER_PAGE_LIMIT,
        userId
      },
    });
    return {
      ...response?.data,
      prevParam: pageParam,
    };
  };

  const {
    data: ordersData,
    isLoading: orderLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    getNextPageParam: (lastPage) => {
      const prevPage = lastPage.prevParam;
      const { totalPages } = lastPage.pagination;
      if (prevPage === totalPages) {
        return undefined;
      }
      return prevPage + 1;
    },
    refetchOnWindowFocus: false,
  });

  const orderListItem = ordersData?.pages?.reduce((result, page) => {
    return [...result, ...page?.orders];
  }, []);

  console.log(orderListItem);

  return (
    <section className="w-full min-h-[80vh] p-2 md:p-5">
      <h1 className="text-[1.7rem] font-normal">Your Orders</h1>

      {orderLoading ? (
        <PageLoder />
      ) : (
        <>
          {
            orderListItem?.length === 0 ? <section className="w-full h-screen flex justify-center items-center">
               
               <span>No Orders Found</span>

            </section>   : <section className="p-0 md:p-2 w-full">
            {orderListItem?.map((order, idx) => (
              <OrderItemCard key={idx} data={order} />
            ))}
            {isFetchingNextPage && (
              <div className="w-full flex justify-center items-center mt-3">
                <ContentLoader />
              </div>
            )}
            {hasNextPage && (
              <div className="w-full flex justify-center items-center mt-3">
                <span
                  className="text-[0.8rem] text-gray-600 cursor-pointer"
                  onClick={fetchNextPage}
                >
                  Load More
                </span>
              </div>
            )}
          </section>
          }
        </>
      )}
    </section>
  );
};

export default Orders;

const OrderItemCard = ({ data }) => {
  const { orderItem, status, reviewed, orderId } = data;
  const { MenuItem } = orderItem[0];
  const { name, img, description, itemId } = MenuItem;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/order/item", {
      state: {
        data: data,
      },
    });
  };

  const handleReviewClick = (e) => {
    e.stopPropagation();

    navigate(`/order/review?orderId=${orderId}&menuId=${itemId}`,{
      state:{
        orderId:orderId,
        menuId :itemId,
        menu :MenuItem
      }
    });
  };

  return (
    <section
      className="w-full p-2 my-2 rounded-md shadow-md duration-500 hover:shadow-lg hover:scale-[0.98] cursor-pointer"
      onClick={handleCardClick}
    >
      <article className=" w-full  flex justify-between items-start">
        <div className="flex-1 max-w-[calc(100%-80px)]  md:max-w-[calc(100%-120px)]">
          <h1 className="text-[0.9rem] md:text-[1.2rem] font-normal whitespace-nowrap overflow-hidden text-ellipsis">
            {name}
          </h1>
          <p className="text-[0.8rem] md:text-[0.9rem] text-gray-600">
            {description}
          </p>
          <h1>
            <StatusTag key={status} value={status} />
          </h1>
        </div>
        <img
          src={img}
          className="w-[80px] md:w-[120px] h-[80px] md:h-[120px] rounded-md"
          alt={name}
        />
      </article>
      <article className="w-full flex justify-end items-center mt-3 gap-2">
        {"pending" === status.toLowerCase() && (
          <button className="text-[0.8rem] rounded-full px-3 py-1 bg-red-500 text-white">
            Cancel
          </button>
        )}
        {(reviewed === 0   && "delivered" === status.toLowerCase()) && (
          <button
            onClick={handleReviewClick}
            className="text-[0.8rem]  rounded-full border border-[#efefef] px-3 py-1"
          >
            Leave Review
          </button>
        )}
      </article>
    </section>
  );
};

const StatusTag = ({ value }) => {
  return <span className="text-[0.7rem] p-1 px-2  rounded-full ">{value}</span>;
};
