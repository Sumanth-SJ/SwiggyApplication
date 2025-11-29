import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getErrorMessage, ordersFilters, serverUrlAPI } from "../../utils/Infos";
import { axiosInstance } from "../../utils/axiosInstance";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageLoder from "../../components/PageLoder";
import ContentLoader from "../../components/ContentLoader";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const ROrders = () => {
  const [searchParam] = useSearchParams();
  const ORDER_PAGE_LIMIT = 10;
  const [activeStatus, setActiveStatus] = useState("");
  const naviagte = useNavigate();

  const queryClient = useQueryClient();

  const ORDER_FILTERS = [
    "Pending",
    "Preparing",
    "Prepared",
    "Out For Delivery",
    "Delivered",
  ];

  useEffect(() => {
    if (searchParam.get("status")) {
      setActiveStatus(searchParam.get("status"));
    } else {
      setActiveStatus("pending");
    }
  }, [searchParam]);

  const fetchOrder = async ({ pageParam = 1 }) => {
    const restaurantId = queryClient.getQueryData(["profile"]).restaurantId || 0;
    const data = {
      page: pageParam,
      limit: ORDER_PAGE_LIMIT,
      statusFilter: activeStatus,
      restaurantId
    };
    const response = await axiosInstance.get(
      `${serverUrlAPI}order/restaurant`,
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
    data: ordersData,
    isLoading: orderLoading,
    isFetching: orderFetching,
    isFetchingNextPage: orderFetchingNextPage,
    hasNextPage: hasOrdersNext,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["orders", activeStatus],
    queryFn: fetchOrder,
    getNextPageParam: (lastPage) => {
      const prevPage = lastPage.prevParam;
      const { totalPages } = lastPage;
      if (prevPage === totalPages) {
        return undefined;
      }
      return prevPage + 1;
    },
  });

  if (orderLoading) {
    return <PageLoder />;
  }

  const orderItemList = ordersData?.pages?.reduce((result, page) => {
    return [...result, ...page?.orders];
  }, []);

  console.log(orderItemList);

  return (
    <section className="w-full mx-auto  max-w-[1200px] min-h-screen p-1 my-2">
      <h1 className="text-[1.2rem] font-normal md:text-[1.8rem]">
        Your Orders
      </h1>

      <article className="flex w-full justify-start md:justify-end items-center mt-2 gap-3 overflow-auto px-3">
        {ORDER_FILTERS.map((filter, idx) => (
          <span
            key={idx}
            className={`cursor-pointer text-[0.8rem] px-2 py- rounded-full border whitespace-nowrap border-[#ededed]  ${
              filter.toLowerCase() === activeStatus &&
              "bg-[#feb80a] border-none"
            }`}
            onClick={() => naviagte(`?status=${filter.toLowerCase()}`)}
          >
            {filter}
          </span>
        ))}
      </article>

      {!orderLoading && orderItemList?.length === 0 ? (
        <article className="w-full h-[80vh] flex justify-center items-center">
          <span className="text-[1rem] md:text-[1.5rem] text-gray-600">
            No Order Found
          </span>
        </article>
      ) : (
        <article className="p-2">
          {orderItemList?.map((order, idx) => (
            <OrderCard data={order} key={idx} />
          ))}

          {orderFetchingNextPage && (
            <div className="w-full flex justify-center items-center py-3">
              <ContentLoader />
            </div>
          )}

          {hasOrdersNext && (
            <div className="w-full flex justify-center items-center py-3">
              <span
                className="text-[0.8rem] text-gray-600 cursor-pointer"
                onClick={fetchNextPage}
              >
                Load More
              </span>
            </div>
          )}
        </article>
      )}
    </section>
  );
};

export default ROrders;

const OrderCard = ({ data }) => {
  const {
    OrderedBy,
    orderItem,
    deliveryAddress,
    orderDate,
    orderId,
    payMode,
    status,
  } = data;

  const { MenuItem, orderDetails } = orderItem[0];

  const { name, img } = MenuItem;

  const { quantity } = orderDetails;

  const { phoneNumber, name: orderedPerson } = OrderedBy;

   const queryClient = useQueryClient();

  const updateOrderStatus = async (status) => {
    const data = { orderId, status };
    const response = await axiosInstance.put(
      `${serverUrlAPI}order/status`,
      data
    );
    return response.data;
  };

  const statusUpdateMutation = useMutation({
    mutationKey: ["order-status", orderId],
    mutationFn: updateOrderStatus,
    onSuccess: (result) => {
      toast.success("Order Status updated successfully");
      setTimeout(()=>{
          queryClient.invalidateQueries(["orders"])
      },700)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  });

  return (
    <article className="w-full p-2 rounded-lg my-2 shadow-md duration-700 hover:shadow-lg hover:scale-[0.98]">
      <div className="flex justify-start items-start gap-2">
        <img
          src={img}
          className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-md"
          alt=""
        />
        <div className="text-[0.7rem]">
          <span className="font-semibold">{name}</span>
          <h1 className="text-gray-700">
            <span>Quantity : </span>
            <span>{quantity}</span>
          </h1>
          <h1 className="text-gray-800">
            Delivery Address : {deliveryAddress}
          </h1>
          <div>
            <h1>Ordered By</h1>
            <h1 className="text-gray-500">{orderedPerson}</h1>
            <h1 className="text-gray-500">{payMode}</h1>
            
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-end items-center text-[0.7rem]">
            {status.toLowerCase() === "pending" && (
              <button 
              className="border px-2 py-1 rounded-full flex justify-center items-center gap-1"
              onClick={()=>statusUpdateMutation.mutate("preparing")}>
                Get For Preparation {statusUpdateMutation.isPending && <Loader/>}
              </button>
            )}
            {status.toLowerCase() === "preparing" && (
              <button className="border px-2 py-1 rounded-full flex justify-center items-center gap-1" onClick={()=>statusUpdateMutation.mutate("prepared")}>
                Mark as Prepared {statusUpdateMutation.isPending && <Loader/>}
              </button>
            )}
            </div>
    </article>
  );
};
