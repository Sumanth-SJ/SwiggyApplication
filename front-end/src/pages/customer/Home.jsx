import React from "react";
import emoji from "../../assets/img/emoji2.jpg";
import { axiosInstance } from "../../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { MapIcon, MapPin } from "lucide-react";
import ReactStars from "react-rating-stars-component";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const features = [
    {
      id: 1,
      title: "Top Rated Restaurants",
      description:
        "Discover the best-rated restaurants in your area with customer reviews and ratings. Only the top choices for your cravings!",
      image:
        "https://images.pond5.com/restaurant-icon-top-rating-illustration-048215966_iconl.jpeg",
    },
    {
      id: 2,
      title: "Fast Delivery",
      description:
        "Get your food delivered fresh and hot in no time with our super-fast delivery partners available 24/7.",
      image:
        "https://cdn3d.iconscout.com/3d/premium/thumb/fast-delivery-3d-icon-download-in-png-blend-fbx-gltf-file-formats--truck-cargo-courier-service-services-pack-e-commerce-shopping-icons-7314098.png",
    },
    {
      id: 3,
      title: "Hygienic Food",
      description:
        "We ensure that every meal is prepared in a clean and hygienic environment, prioritizing your health and safety.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD62r1c1IfektxHTXmZez2w63L4Al_7uCfhA&s",
    },
    {
      id: 4,
      title: "All-in-One Platform",
      description:
        "Browse, order, and track your favorite meals from multiple cuisines, all in one user-friendly platform.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUS-lv_BZqvo9C91kjKCh-sZ5Ij4hs_LT42A&s",
    },
  ];

  const topRatedRestaurant = async () => {
    const response = await axiosInstance.get("restaurant/top-rated");
    return response.data;
  };

  const { data, isLoading, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: "restaurant-top-rated",
    queryFn: topRatedRestaurant,
    staleTime: Infinity,
  });

  return (
    <>
      <section className="flex flex-col lg:flex-row justify-center items-center  p-2 lg:h-[70vh]">
        <article className="w-full flex justify-center items-start flex-col h-full">
          <span className="text-[3.5rem] lg:text-[4rem] font-extrabold">
            Order Your
          </span>
          <span className="text-[3rem] lg:text-[3.9rem] font-extrabold flex justify-start items-center gap-2">
            Favourite Food
            <img
              src={emoji}
              alt=""
              className="inline-block w-20 h-20 hover:scale-110 duration-500 animate-bounce"
            />
          </span>
          <span className="text-[2.6rem] lg:text-[3.8rem] font-extrabold text-[#feb80a] duration-200 hover:tracking-tighter">
            & Easy Pickup
          </span>
        </article>

        <article>
          <img
            src="https://img.freepik.com/premium-photo/funny-guy-holding-burger-craving-sandwich-studio_116547-18624.jpg"
            alt=""
            className="w-[800px]"
          />
        </article>
      </section>

      <section className="w-full flex flex-col justify-center items-center mt-5">
        <h1 className="text-[3rem] font-semibold">Features</h1>
        <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-5">
          {features?.map((feature, idx) => (
            <FeatureCard data={feature} key={idx} />
          ))}
        </article>
      </section>

      <section className="w-full flex flex-col justify-center items-start mt-4">
        <h1 className="text-[1.4rem]">Top Rated Restaurant</h1>
        <div className="w-full p-5 overflow-auto flex justify-start items-center gap-4">
          {isLoading &&
            Array.from({ length: 5 }).map((_, idx) => (
              <RestaurantCardSkeleton key={idx} />
            ))}
          {data &&
            isSuccess &&
            data?.map((restaurant, idx) => (
              <RestaurantCard data={restaurant} key={idx} />
            ))}
        </div>
      </section>
    </>
  );
};

export default Home;

const FeatureCard = ({ data }) => {
  const { title, description, image } = data;

  return (
    <div className="w-[300px] mx-auto lg:w-full flex flex-col justify-center items-center p-5 rounded-2xl shadow-md duration-200 hover:shadow-xl">
      <img src={image} alt="" className="h-16 w-16 rounded-full" />
      <h1 className="text-center text-[1.4rem] font-semibold">{title}</h1>
      <p className="text-center text-gray-600 text-[0.8rem] mt-5">
        {description}
      </p>
    </div>
  );
};

const RestaurantCard = ({ data }) => {
  const { name, address, rating ,restaurantId } = data;

  const navigate = useNavigate();


  const handleCardClick =()=>{
    navigate(`/menu?rid=${restaurantId}`)
  }

  return (
    <div 
    onClick={handleCardClick}
    className="w-[200px] lg:w-[250px] h-[180px] rounded-lg p-4 flex justify-center items-center flex-col shadow-md flex-shrink-0 flex-grow-0 cursor-pointer hover:shadow-md hover:scale-95 duration-500">
      <img
        src="https://cdn4.iconfinder.com/data/icons/map-pins-2/256/21-512.png"
        className="w-10 h-10 rounded-full"
        alt=""
      />
      <h1 className="text-[1.2rem] font-semibold text-center">{name}</h1>
      <h1 className="flex justify-center items-center text-[0.8rem] gap-1">
        <MapPin className="h-3 w-3" /> {address}
      </h1>
      <h1 className="flex justify-center items-center gap-1">
        <ReactStars
          count={5}
          size={20}
          isHalf={true}
          emptyIcon={<i className="far fa-star"></i>}
          halfIcon={<i className="fa fa-star-half-alt"></i>}
          fullIcon={<i className="fa fa-star"></i>}
          value={rating}
          edit={false}
        />
      </h1>
    </div>
  );
};

const RestaurantCardSkeleton = () => {
  return (
    <div className="w-[300px] flex flex-shrink-0 flex-grow-0">
      <Skeleton width={300} height={200} borderRadius={20} />
    </div>
  );
};
