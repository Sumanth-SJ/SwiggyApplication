import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { serverUrlAPI } from "../../utils/Infos";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import PageLoder from "../../components/PageLoder";
import { IndianRupee } from "lucide-react";

const DOrders = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { partnerId } = queryClient.getQueryData(["profile"]);
  const ORDER_PAGE_LIMIT = 10;

  const [searchParam] = useSearchParams();

  const activeStatus = searchParam.get("status") || "out of delivery";

  const ORDER_STATUS = [
    {
      key: "out of delivery",
      label: "Pending",
    },
    {
      key: "delivered",
      label: "Delivered",
    },
  ];

  const handleStatusChange = (status) => {
    navigate(`?status=${status}`);
  };

  const fetchDeliveries = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(`${serverUrlAPI}deliveries/`, {
      params: {
        page: pageParam,
        limit: ORDER_PAGE_LIMIT,
        status: activeStatus,
        deliveryPartnerId: partnerId,
      },
    });

    return {
      ...response.data,
      prevParam: pageParam,
    };
  };

  const {
    data: deliveriesData,
    isLoading: loadingDeliveries,
    isFetchingNextPage: fetchingDeliveriresNextpage,
    fetchNextPage: fetchNextDeliveries,
  } = useInfiniteQuery({
    queryKey: ["deliveries", searchParam.get("status")],
    queryFn: fetchDeliveries,
    getNextPageParam: (lastPage) => {
      const { pagination, prevParam } = lastPage;
      const { hasNext } = pagination;
      const nextPageParam = hasNext ? prevParam + 1 : undefined;
      return nextPageParam;
    },
  });

  if (loadingDeliveries) {
    return <PageLoder />;
  }

  const deliveriesList = deliveriesData?.pages?.reduce((result, page) => {
    return [...result, ...page?.deliveries];
  }, []);

  return (
    <section className="p-2 md:p-5 w-full min-h-screen">
      <h1 className="text-[1.rem] md:text-[1.4rem]">Your Order</h1>

      <article className="mt-4 flex justify-end items-center">
        <div className="flex justify-start items-center overflow-x-auto gap-2 p-3">
          {ORDER_STATUS?.map((status, idx) => (
            <span
              key={status.key}
              className={`px-2 py-1 cursor-pointer rounded-full text-[0.7rem] shadow-md ${
                activeStatus === status.key && "bg-orange-600 text-white"
              }`}
              onClick={() => handleStatusChange(status.key)}
            >
              {status.label}
            </span>
          ))}
        </div>
      </article>

      <article className="w-full mt-4">
        {deliveriesList?.length === 0 ? (
          <div className="w-full h-[60vh] flex justify-center items-center">
            <span className="text-[0.8rem] text-gray-700">No Orders found</span>
          </div>
        ) : (
          deliveriesList?.map((delivery, idx) => (
            <DeliveryCard key={idx} data={delivery} />
          ))
        )}
      </article>
    </section>
  );
};

export default DOrders;

const DeliveryCard = ({ data }) => {
  console.log(data);

  const navigate = useNavigate();

  const { deliveryId, order } = data;

  const { orderItem, payMode, totalAmount ,Restauarnt ,deliveryAddress } = order;

  const { MenuItem ,orderDetails } = orderItem[0];

  const { img, name } = MenuItem;

  const {quantity} = orderDetails



  const handleOrderItemClick = ()=>{
    navigate("/delivery/orders/item",{
      state : {
        orderDetails : data
      }
    })
  }

  return (
    <article 
    className="p-2 rounded-lg shadow-md duration-500 hover:shadow-lg cursor-pointer"
    onClick={handleOrderItemClick}>
      <div className="flex justify-start items-start gap-2">
        <img
          src={img}
          alt=""
          className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] rounded-lg"
        />
        <div className="text-[0.8rem]">
          <h1>{name}</h1>
          <h1>
            {payMode === "COD" ? (
              <span className="text-[0.7rem] px-2 py-[1px] rounded-full bg-green-700 text-white">
                Amount to collect
              </span>
            ) : (
              <span className="text-[0.7rem] px-2 py-[1px] rounded-full bg-green-700 text-white">
                Paid
              </span>
            )}
            <span className="flex justify-start items-center font-semibold">
              <IndianRupee size={11} /> {totalAmount}
            </span>
          </h1>
          <h1 className="text-[0.7rem] text-gray-800">Qunatity: <span>{quantity}</span></h1>
          <h1 className="text-[0.7rem] text-gray-800">Delivery Address : <span>{deliveryAddress}</span></h1>
        </div>
      </div>
    </article>
  );
};
