import { IndianRupee, Loader, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage, serverUrlAPI } from "../../utils/Infos";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDebounce } from "use-debounce";
import Skeleton from "react-loading-skeleton";
import Error from "../../components/Error";
import PageLoder from "../../components/PageLoder";
import { Oval } from "react-loader-spinner";

const RMenuList = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState("");

  const [debouncingSearchText] = useDebounce(searchText, 1000);

  const fetchMenuList = async ({ pageParam = 1 }) => {
    const restaurantId = queryClient.getQueryData(["profile"]).restaurantId || 0;
    const limit = 12;
    const response = await axiosInstance.get(
      serverUrlAPI + "menu/restaurant/menu-list",
      {
        params: {
          page: pageParam,
          limit: limit,
          q: debouncingSearchText,
          restaurantId
        },
      }
    );

    const data = { ...response.data, prevParam: pageParam };

    return data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["restaurant-menu-paginated-data", debouncingSearchText],
    queryFn: fetchMenuList,
    getNextPageParam: (lastPage) => {
      const prevPage = lastPage.prevParam;
      if (prevPage === lastPage.totalPages) {
        return undefined;
      }
      return prevPage + 1;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const handleAllFoodClick = () => {
    navigate("/restaurant/menu/add");
  };

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries("restaurant-menu-paginated-data");
    };
  }, []);

  if (isError) {
    return <Error message={getErrorMessage(error)} />;
  }

  const menuItem = data?.pages?.reduce((acc, page) => {
    return [...acc, ...page.content];
  }, []);

  return (
    <>
      <section className="w-full p-2 sticky top-0 z-20 bg-white">
        <article className="w-full flex flex-col justify-center items-center">
          <div className="p-1 px-3 border border-slate-200 rounded-xl flex justify-start items-center w-full max-w-[400px]">
            <input
              type="text"
              className="flex-1 flex"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Search className="cursor-pointer h-5 w-5 ms-1" />
          </div>

          <div className="w-full flex justify-end items-center pe-3 mt-2 ">
            <button
              className="p-1 rounded-xl bg-[#feb80a] px-3"
              onClick={handleAllFoodClick}
            >
              Add Your Food
            </button>
          </div>
        </article>
      </section>

      <InfiniteScroll
        dataLength={menuItem ? menuItem?.length : 0}
        next={fetchNextPage}
        hasMore={hasNextPage}
      >
        <div className="w-full max-w-[1200px] mx-auto gap-3  grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 xl:grid-cols-4">
          {menuItem &&
            menuItem?.map((item, idx) => <MenuCard data={item} key={idx} />)}
        </div>

        {isLoading && <PageLoder />}
        {(isFetching || isFetchingNextPage) && !isLoading && (
          <div className="flex justify-center items-center mt-5">
            <Oval
              visible={true}
              height="40"
              width="40"
              color="#feb80a"
              secondaryColor="white"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}

        <div className="w-full h-[10vh]"></div>
      </InfiniteScroll>
    </>
  );
};

export default RMenuList;

const MenuCard = ({ data }) => {
  const navigate = useNavigate();

  const handleMenuCardClick = () => {
    navigate(`/restaurant/menu/update/${data?.itemId}`);
  };

  const { discount, img, name, description, available, price } = data;

  return (
    <section
      className="w-[300px] rounded-lg cursor-pointer mx-auto p-1 hover:shadow-md hover:scale-[0.98] duration-300 "
      onClick={handleMenuCardClick}
    >
      <div className="w-full h-[200px] relative">
        {discount > 0 && (
          <span className="absolute bottom-1 w-8 h-8 z-10 right-1 flex justify-center items-center text-[0.9rem] rounded-full bg-green-500 text-white">
            {discount}%
          </span>
        )}
        {available === 0 && (
          <article className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 rounded-md flex justify-center items-center">
            <span className="text-[0.8rem] md:text-[1rem] text-white">Not Available</span>
          </article>
        )}
        <img
          src={img}
          className="w-full h-full object-contain rounded-lg"
          alt=""
        />
        <div className="card-overlay text-2xl text-white font-extrabold flex justify-start items-center ps-2  rounded-br-md rounded-bl-md">
          <IndianRupee className="w-5 h-5" /> <span>{price}</span>
        </div>
      </div>
      <h1 className="w-full py-1 px-1  text-[1.5rem] font-semibold ">{name}</h1>
      <p className=" text-[0.9rem] overflow-hidden text-ellipsis line-clamp-2 px-2 text-gray-700">
        {description}
      </p>
    </section>
  );
};
