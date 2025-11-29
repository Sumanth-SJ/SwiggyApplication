import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getErrorMessage, serverUrlAPI } from "../../utils/Infos";
import { AutoComplete, ConfigProvider } from "antd";
import { useDebounce } from "use-debounce";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import Error from "../../components/Error";
import PageLoder from "../../components/PageLoder";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Filter,
  IndianRupee,
  Key,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
const Menu = () => {
  const PAGE_LIMIT = 12;

  const [openMobileFilter, setMobileFilterOpen] = useState(false);

  const CATEGORY_FILTER = [
    { label: "VEG", key: "veg" },
    { label: "NON-VEG", key: "nonveg" },
    { label: "VEGAN", key: "vegan" },
    { label: "JAIN", key: "jain" },
    { label: "FAST FOOD", key: "fast-food" },
    { label: "DESSERTS", key: "desserts" },
    { label: "BEVERAGES", key: "beverages" },
    { label: "SEAFOOD", key: "seafood" },
    { label: "STREET FOOD", key: "street-food" },
    { label: "HEALTHY FOOD", key: "healthy-food" },
  ];

  const RATING_FILTER = [
    { label: "5 Star", key: 5 },
    { label: "4 Star & Above", key: 4 },
    { label: "3 Star & Above", key: 3 },
  ];

  const PRICE_FILTER = [
    { label: "₹100 - ₹200", key: "100-200" },
    { label: "₹200 - ₹500", key: "200-500" },
    { label: "₹500 - ₹1000", key: "500-1000" },
    { label: "₹1000 & Above", key: "1000-" + Infinity },
  ];

  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const searchRef = useRef();

  const [searchParam] = useSearchParams();

  const [debouncedSearchText] = useDebounce(searchText, 500);

  const [allowSuggestion, setAllowSuggestion] = useState(true);

  const fetchSuggestion = async () => {
    const response = await axiosInstance.get(
      serverUrlAPI + "menu/suggestions?filter=" + debouncedSearchText
    );
    return response.data;
  };

  const fetchMenuData = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(serverUrlAPI + "menu/food", {
      params: {
        q: searchParam.get("q"),
        page: pageParam,
        limit: PAGE_LIMIT,
        rid: searchParam.get("rid") ? searchParam.get("rid") : 0,
        rating: searchParam.get("rating") ? searchParam.get("rating") : 0,
        price: searchParam.get("price")
          ? searchParam.get("price")
          : "0-Infinity",
      },
    });
    const data = { ...response.data, prevParam: pageParam };
    return data;
  };

  const { data, isLoading, isPending, isSuccess, isFetching } = useQuery({
    queryKey: ["suggestion", debouncedSearchText],
    queryFn: fetchSuggestion,
    staleTime: Infinity,
    enabled: allowSuggestion,
  });

  const {
    data: menuData,
    isLoading: menuDataLoading,
    isError: menuDataIsError,
    error: menuDataError,
    fetchNextPage: fetchNextMenuData,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isPending: menuDataPending,
    isFetching: menuDataFetching,
  } = useInfiniteQuery({
    queryKey: [
      "food-item-list",
      searchParam.get("q"),
      searchParam.get("rid"),
      searchParam.get("rating"),
      searchParam.get("price"),
    ],
    queryFn: fetchMenuData,
    staleTime: Infinity,
    getNextPageParam: (lastPage) => {
      const prevPage = lastPage.prevParam;
      if (prevPage === lastPage.totalPages) {
        return undefined;
      }
      return prevPage + 1;
    },
    refetchOnWindowFocus: false,
  });

  const suggestionData =
    data && data?.length > 0
      ? data?.map((item, idx) => {
          return {
            ...item,
            value: item.title,
            key: item.title,
          };
        })
      : [];

  const handleSearchTextSelect = (val) => {
    navigate("?q=" + val);
  };

  const menuListContent = menuData?.pages?.reduce((result, page) => {
    return (result = [...result, ...page?.content]);
  }, []);

  const handleFilterChange = (data) => {
    let redirectUrl = "";

    if (data?.type === "category") {
      redirectUrl =
        "?q=" +
        data.value +
        (searchParam.get("price") ? "&price=" + searchParam.get("price") : "") +
        (searchParam.get("rating")
          ? "&rating=" + searchParam.get("rating")
          : "");
    }
    if (data.type === "price") {
      redirectUrl =
        "?price=" +
        data.value +
        (searchParam.get("q") ? "&q=" + searchParam.get("q") : "") +
        (searchParam.get("rating")
          ? "&rating=" + searchParam.get("rating")
          : "");
    }
    if (data.type === "rating") {
      redirectUrl =
        "?rating=" +
        data.value +
        (searchParam.get("price") ? "&price=" + searchParam.get("price") : "") +
        (searchParam.get("q") ? "&q=" + searchParam.get("q") : "");
    }

    navigate(redirectUrl);
  };

  return (
    <>
      <section className="w-full max-w-[1500px]   p-2 py-8">
        <article className="w-[300px] md:w-[400px] lg:w-[500px] border border-gray-200  rounded-full mx-auto flex justify-start items-center">
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  activeBorderColor: "transparent",
                  activeOutlineColor: "transparent",
                  hoverBorderColor: "transparent",
                  colorBorder: "transparent",
                  borderRadius: "20px",
                },
              },
            }}
          >
            <AutoComplete
              className="custom-autocomplete w-full"
              options={suggestionData}
              placeholder="Type here"
              allowClear
              value={searchText}
              ref={searchRef}
              onChange={(val) => setSearchText(val)}
              onSelect={handleSearchTextSelect}
              notFoundContent={
                isLoading || isFetching
                  ? "Loading..."
                  : suggestionData?.length == 0 && debouncedSearchText != ""
                  ? "No Result"
                  : ""
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchTextSelect(searchText);
                  searchRef.current.blur();
                }
              }}
            />
          </ConfigProvider>
        </article>

        {menuDataIsError && <Error message={getErrorMessage(menuDataError)} />}
        {
          <section className="w-full flex justify-start items-start">
            {/* Filtering Section */}
            <article className="w-[200px] hidden lg:block p-4">
              <h1 className="flex justify-start items-center gap-2">
                Filters <Filter size={13} />
              </h1>

              <div className="mt-4">
                <article className="p-1 border-b border-gray-200 py-3">
                  <h1>Category</h1>
                  <div className="flex p-2 flex-wrap justify-start items-start gap-1 gap-y-2">
                    {CATEGORY_FILTER?.map((filter, idx) => (
                      <span
                        key={idx}
                        className={`text-[0.7rem] px-2 py-[2px] rounded-full shadow-md lowercase cursor-pointer ${
                          searchParam.get("q") === filter.key && "bg-yellow-400"
                        }`}
                        onClick={() => {
                          const data = {
                            type: "category",
                            value: filter.key,
                          };
                          handleFilterChange(data);
                        }}
                      >
                        {filter.label}
                      </span>
                    ))}
                  </div>
                </article>

                <article className="p-1 border-b border-gray-200 py-3">
                  <h1>Rating</h1>
                  <div className="flex p-2 flex-wrap justify-start items-start gap-1 gap-y-2">
                    {RATING_FILTER?.map((filter, idx) => (
                      <span
                        key={idx}
                        className={`text-[0.7rem] px-2 py-[2px] rounded-full shadow-md lowercase cursor-pointer ${
                          searchParam.get("rating") == filter.key &&
                          "bg-yellow-400"
                        }`}
                        onClick={() => {
                          const data = {
                            type: "rating",
                            value: filter.key,
                          };
                          handleFilterChange(data);
                        }}
                      >
                        {filter.label}
                      </span>
                    ))}
                  </div>
                </article>

                <article className="p-1 border-b border-gray-300 py-3">
                  <h1>Price</h1>
                  <div className="flex  flex-wrap justify-start items-start gap-1 gap-y-2">
                    {PRICE_FILTER?.map((filter, idx) => (
                      <span
                        key={idx}
                        className={`text-[0.7rem] px-2 py-[2px] rounded-full shadow-md lowercase cursor-pointer ${
                          searchParam.get("price") == filter.key &&
                          "bg-yellow-400"
                        }`}
                        onClick={() => {
                          const data = {
                            type: "price",
                            value: filter.key,
                          };
                          handleFilterChange(data);
                        }}
                      >
                        {filter.label}
                      </span>
                    ))}
                  </div>
                </article>
              </div>
            </article>

            <article className="flex-1">
              {menuDataLoading && <PageLoder />}
              {menuListContent?.length === 0 ? (
                <Error message={"Found Nothing"} />
              ) : (
                <InfiniteScroll
                  dataLength={
                    menuListContent?.length ? menuListContent?.length : 0
                  }
                  next={fetchNextMenuData}
                  hasMore={hasNextPage}
                >
                  <article className="w-full p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {menuListContent?.map((foodData, idx) => (
                      <FoodCard data={foodData} key={idx} />
                    ))}
                  </article>
                  {isFetchingNextPage && (
                    <article className="w-full flex justify-center items-center p-y flex-col ">
                      <Oval
                        visible={true}
                        height="50"
                        width="50"
                        color="#feb80a"
                        secondaryColor="white"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                      <p className="text-[0.8rem] text-gray-500">Loading</p>
                    </article>
                  )}
                  {!hasNextPage && menuListContent?.length > 0 && (
                    <article className="w-full flex  justify-center items-center p-5 text-[0.8rem] text-gray-500">
                      No more Data
                    </article>
                  )}
                </InfiniteScroll>
              )}
            </article>
          </section>
        }
      </section>

      <section
        className={`fixed block lg:hidden bg-white bottom-0 left-0 w-full duration-700 h-[60vh] p-5 ${
          openMobileFilter ? "translate-y-[0%]" : "translate-y-[85%]"
        }`}
      >
        <h1
          className="flex justify-between items-center gap-2"
          onClick={() => setMobileFilterOpen((prev) => !prev)}
        >
          <span className="flex justify-start items-center gap-2">Filter
          <Filter size={18} /></span>

          <span>
            {
              openMobileFilter ? <ChevronDown /> : <ChevronUp />
            }
          </span>
        </h1>
        <article className="p-2 overflow-auto w-full">
          <article className="p-1 border-b border-gray-200 py-3">
            <h1>Category</h1>
            <div className="flex p-2 flex-wrap justify-start items-start gap-1 gap-y-2">
              {CATEGORY_FILTER?.map((filter, idx) => (
                <span
                  key={idx}
                  className={`text-[0.7rem] px-2 py-[2px] rounded-full shadow-md lowercase cursor-pointer ${
                    searchParam.get("q") === filter.key && "bg-yellow-400"
                  }`}
                  onClick={() => {
                    const data = {
                      type: "category",
                      value: filter.key,
                    };
                    handleFilterChange(data);
                  }}
                >
                  {filter.label}
                </span>
              ))}
            </div>
          </article>

          <article className="p-1 border-b border-gray-200 py-3">
            <h1>Rating</h1>
            <div className="flex p-2 flex-wrap justify-start items-start gap-1 gap-y-2">
              {RATING_FILTER?.map((filter, idx) => (
                <span
                  key={idx}
                  className={`text-[0.7rem] px-2 py-[2px] rounded-full shadow-md lowercase cursor-pointer ${
                    searchParam.get("rating") == filter.key && "bg-yellow-400"
                  }`}
                  onClick={() => {
                    const data = {
                      type: "rating",
                      value: filter.key,
                    };
                    handleFilterChange(data);
                  }}
                >
                  {filter.label}
                </span>
              ))}
            </div>
          </article>

          <article className="p-1 border-b border-gray-300 py-3 h-full overflow-auto">
            <h1>Price</h1>
            <div className="flex  flex-wrap justify-start items-start gap-1 gap-y-2">
              {PRICE_FILTER?.map((filter, idx) => (
                <span
                  key={idx}
                  className={`text-[0.7rem] px-2 py-[2px] rounded-full shadow-md lowercase cursor-pointer ${
                    searchParam.get("price") == filter.key && "bg-yellow-400"
                  }`}
                  onClick={() => {
                    const data = {
                      type: "price",
                      value: filter.key,
                    };
                    handleFilterChange(data);
                  }}
                >
                  {filter.label}
                </span>
              ))}
            </div>
          </article>
          
          
        </article>
      </section>
    </>
  );
};

export default Menu;

const FoodCard = ({ data }) => {
  const { name, description, rating, price, img, discount, itemId, available } =
    data;

  const navigate = useNavigate();

  const handleMenuItemCLick = (id) => {
    navigate(`/menu/item?id=${id}`);
  };

  return (
    <article
      className="rounded-lg cursor-pointer border border-gray-50 duration-500 hover:scale-95 hover:shadow-md p-2 w-[220px] lg:w-[200px]  mx-auto relative"
      onClick={() => handleMenuItemCLick(itemId)}
    >
      {discount > 0 && (
        <span className="absolute top-2 right-2">
          <DiscountBadge discount={discount} />
        </span>
      )}
      <div className="w-full h-[150px] lg:h-[120px] object-fit relative">
        <img src={img} className="w-full h-full" alt="" />
      </div>

      <div className="flex w-full justify-start items-center gap-1">
        <h1 className="text-[1.4rem] font-semibold w-full flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </h1>
        <span className="flex justify-center items-center">
          <img
            src="https://static-00.iconduck.com/assets.00/rating-icon-512x488-f3wudmx0.png"
            className="w-4 h-4 me-1"
            alt=""
          />
          {rating}
        </span>
      </div>
      <p className="text-[0.8rem] text-gray-400 line-clamp-2 text-ellipsis">
        {description}
      </p>
      <span className="flex justify-start items-center py-2 text-[1.1rem] font-extrabold">
        <IndianRupee className="h-3 w-3" />{" "}
        {discount > 0 ? (
          <>
            <strike>{price}</strike>{" "}
            <span className="ms-2">{calculateDiscount(price, discount)}</span>{" "}
          </>
        ) : (
          <span>{price}</span>
        )}
        {available === 0 && (
          <span className=" ms-2 text-red-500 px-2 py-[2px] rounded-full border border-red-600 text-[0.7rem] font-normal">
            Not Available
          </span>
        )}
      </span>
    </article>
  );
};

const DiscountBadge = ({ discount = 0 }) => {
  return (
    <span className="w-8 h-8 rounded-full bg-green-600 text-white text-[0.85rem] flex justify-center items-center">
      {discount}%
    </span>
  );
};

export const calculateDiscount = (originalPrice, discount) => {
  const discountedPrice = originalPrice - originalPrice * (discount / 100);
  return parseFloat(discountedPrice.toFixed(2));
};
