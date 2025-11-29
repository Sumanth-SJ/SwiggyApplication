import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage, serverUrlAPI } from "../../utils/Infos";
import { Search, ShoppingBag } from "lucide-react";
import ContentLoader from "../../components/ContentLoader";
import PageLoder from "../../components/PageLoder";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const DDeliveries = () => {
  const [searchParam] = useSearchParams();
  const ORDERS_PAGE_LIMIT = 10;

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParam.get("q") || "");

  const getUndeliveredOrders = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(
      `${serverUrlAPI}order/not-delivered`,
      {
        params: {
          page: pageParam,
          limit: ORDERS_PAGE_LIMIT,
          q: searchQuery,
        },
      }
    );

    return {
      ...response.data,
      prevParam: pageParam,
    };
  };

  const {
    data: orderData,
    isLoading: orderLoading,
    isFetchingNextPage: fetchingOrderNextPage,
    hasNextPage: hasOrdersNext,
    fetchNextPage: fetchNextOrders,
  } = useInfiniteQuery({
    queryKey: ["orders-not-delivered", searchParam.get("q")],
    queryFn: getUndeliveredOrders,
    getNextPageParam: (lastPage) => {
      const { pagination, prevParam } = lastPage;
      const { hasNext } = pagination;

      let nextPage = hasNext ? prevParam + 1 : undefined;
      return nextPage;
    },
  });

  const orderList = orderData?.pages?.reduce((result, page) => {
    return [...result, ...page?.orders];
  }, []);

  console.log(orderList);

  const handleSearchClick = () => {
    navigate(`?q=${searchQuery}`);
  };

  if (orderLoading) {
    return <PageLoder />;
  }

  return (
    <section className="w-full h-screen p-2 md:p-5">
      <article className="w-full max-w-[400px] p-2 rounded-full shadow-sm flex justify-start items-center mx-auto">
        <input
          type="text"
          placeholder="Search Location"
          className="flex-1 placeholder:text-[0.8rem] text-[0.9rem]"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearchClick();
            }
          }}
        />
        <button className="p-1 rounded-full" onClick={handleSearchClick}>
          <Search size={14} />
        </button>
      </article>

      <article className="w-full md:max-w-[80%] mx-auto mt-5">
        {orderList?.length === 0 ? (
          <div className="w-full flex justify-center items-center h-[60vh]">
            <span className="text-[0.8rem] text-gray-600">No Orders Found</span>
          </div>
        ) : (
          orderList?.map((order, idx) => <OrderCard data={order} key={idx} />)
        )}
        {fetchingOrderNextPage && (
          <div className="w-full flex justify-center items-start">
            {" "}
            <ContentLoader />{" "}
          </div>
        )}
        {hasOrdersNext && (
          <div className="w-full flex justify-center items-center my-3">
            <span
              className="cursor-pointer text-[0.8rem] text-gray-600"
              onClick={fetchNextOrders}
            >
              Load more
            </span>
          </div>
        )}
      </article>
    </section>
  );
};

export default DDeliveries;

const OrderCard = ({ data }) => {
  const { orderItem, deliveryAddress, Restauarnt, orderId } = data;

  const { MenuItem } = orderItem[0];

  const { img, name } = MenuItem;
  const { name: restaurantName } = Restauarnt;

  const queryClient = useQueryClient()



  const pickOrder = async () => {

    const {partnerId} = queryClient.getQueryData(["profile"]);

    const response = await axiosInstance.post(`${serverUrlAPI}order/pick`, {
      orderId: orderId,
      deliveryPartnerId: partnerId
    });

    return response.data;
  };

  const pickOrderMutation = useMutation({
    mutationKey: ["pick-order", orderId],
    mutationFn: pickOrder,
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
    onSuccess: (result) => {
      toast.success("Order added to your bag");
      queryClient.invalidateQueries(["orders-not-delivered"])
    },
  });

  return (
    <>
      <article className="w-full p-2 md:p-4 rounded-lg my-4 shadow-md hover:shadow-lg">
        <div className="flex justify-start items-start gap-2">
          <img
            src={img}
            className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] rounded-lg"
            alt=""
          />
          <div className="text-[0.8rem]">
            <h1>{name}</h1>
            <h1>Delivery Address : {deliveryAddress}</h1>
            <h1>Restaurant : {restaurantName}</h1>
          </div>
        </div>
        <div className="flex justify-end items-center mt-2">
          <button disabled={pickOrderMutation.isPending} onClick={()=>pickOrderMutation.mutate()} className="px-2 py-1 text-[0.8rem] bg-orange-600 text-white rounded-full flex justify-center items-center gap-2">
            Add Your Bag <ShoppingBag size={12} /> {pickOrderMutation.isPending ? <Loader/> : <></>}
          </button>
        </div>
      </article>
    </>
  );
};
