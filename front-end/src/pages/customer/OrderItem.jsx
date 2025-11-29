import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { serverUrlAPI } from "../../utils/Infos";
import { useQuery } from "@tanstack/react-query";
import PageLoder from "../../components/PageLoder";
import { CheckCircle, Package, ShoppingCart, Star, Truck } from "lucide-react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { SimilarFoodCard } from "./MenuItem";
import ContentLoader from "../../components/ContentLoader";

const OrderItem = () => {
  const [orderItem, setOrderItem] = useState(null);

  const [categories,setCategories] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      setOrderItem(location.state?.data);
    }
  }, [location.state]);

  const fetchOrderItem = async () => {
    const { orderId } = orderItem;

    const response = await axiosInstance.get(`${serverUrlAPI}order/`, {
      params: {
        orderId: orderId,
      },
    });

    return response.data;
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
    data: orderData,
    isFetching: orderDataFetching,
    isLoading: orderdataLoading,
  } = useQuery({
    queryKey: ["order", orderItem?.orderId],
    queryFn: fetchOrderItem,
    staleTime: Infinity,
  });

   useEffect(()=>{
      if(orderData){
        const { orderItems, restaurant, orderDetails } = orderData;

        const { menuItem, orderItemDetails } = orderItems[0];

        const  {category } = menuItem;

        setCategories(category)

      }   

   },[orderData])



  const { data: similarItemData, isLoading: loadingSimilarData } = useQuery({
      queryKey: ["similarToOrderedData"],
      queryFn: () =>
        fetchSimilarItems(categories.replaceAll("#", "")),
      enabled: !!categories,
    });


  if (orderDataFetching || orderdataLoading) {
    return <PageLoder />;
  }

  console.log(orderData);

  const { orderItems, restaurant, orderDetails } = orderData;

  const { menuItem, orderItemDetails } = orderItems[0];

  const { img, name } = menuItem;

  const { quantity, price } = orderItemDetails;

  const { name: restaurantName, address, rating } = restaurant;

  const { status, reviewed } = orderDetails;

  const handleOrderItemClick = () => {
    const { itemId } = menuItem;
    navigate("/menu/item?id=" + itemId);
  };

  const handleReviewClick =()=>{

    navigate(`/order/review?orderId=${orderItem?.orderId}&menuId=${menuItem?.itemId}`,{
        state:{
            orderId:orderItem?.orderId,
            menuId :menuItem?.itemId,
            menu :menuItem
        }
    })

  }

    const similarItemDataContent = similarItemData?.content?.filter((item)=>item?.itemId!== orderItem?.orderId);

  return (
    <section className="p-2 md:p-4 w-full">
      <article className="flex flex-col md:flex-row w-full justify-start items-start gap-2 relative">
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[0.8rem] border border-[#ededed]">
          {status}
        </span>
        <img
          src={img}
          alt=""
          className="w-[80px] md:w-[150px] h-[80px] md:h-[150px] rounded-md cursor-pointer"
          onClick={handleOrderItemClick}
        />
        <div>
          <h1
            className="text-[1rem] font-normal md:text-[1.4rem] cursor-pointer"
            onClick={handleOrderItemClick}
          >
            {name}
          </h1>
          <h1 className="text-[0.8rem] text-gray-600">
            <span>Quantity : </span> <span>{quantity}</span>
          </h1>
          <h1 className="text-[0.8rem] text-gray-600">
            <span>
              Price : <span>{price}</span>
            </span>
          </h1>
          <div className="mt-3 flex flex-col justify-start">
            <h1>Restauarnt</h1>
            <span className="text-[0.8rem] text-gray-600 flex justify-start items-center gap-2">
              {restaurantName}{" "}
              <span className="flex justify-start items-center">
                <Star size={10} /> {rating}
              </span>{" "}
            </span>
            <span className="text-[0.8rem] text-gray-600">{address}</span>
          </div>
        </div>
      </article>
      <article className="w-full flex justify-start items-center mt-3 gap-2">
        {"pending" === status.toLowerCase() && (
          <button className="text-[0.8rem] rounded-full px-3 py-1 bg-red-500 text-white">
            Cancel
          </button>
        )}
        {(reviewed === 0 && (status.toLowerCase() === "delivered")) && (
          <button onClick={handleReviewClick} className="text-[0.8rem] rounded-full border border-[#efefef] px-3 py-1">
            Leave Review
          </button>
        )}
      </article>

      <section className="p-3 md:p-5 w-full mt-8">
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
    </section>
  );
};

export default OrderItem;

// const OrderTimeline = () => {
//     const steps = [
//       { title: "Order Placed", date: "Feb 21, 2025", icon: <ShoppingCart />, color: "bg-blue-500" },
//       { title: "Dispatched", date: "Feb 22, 2025", icon: <Truck />, color: "bg-yellow-500" },
//       { title: "Out for Delivery", date: "Feb 23, 2025", icon: <Package />, color: "bg-orange-500" },
//       { title: "Delivered", date: "Feb 24, 2025", icon: <CheckCircle />, color: "bg-green-500" },
//     ];

//     return (
//       <VerticalTimeline>
//         {steps.map((step, index) => (
//           <VerticalTimelineElement
//             key={index}
//             date={step.date}
//             iconStyle={{ background: step.color, color: "#000",fontSize:"8px" }}
//             contentStyle={{ borderTop: `4px solid ${step.color}` }}
//             dateClassName="text-[0.5rem]"
//           >
//             <h3 className="text-[0.7rem] font-semibold">{step.title}</h3>
//             <p className="text-[0.6rem] text-gray-600">Status updated successfully</p>
//           </VerticalTimelineElement>
//         ))}
//       </VerticalTimeline>
//     );
//   };
