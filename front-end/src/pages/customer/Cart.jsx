import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage, serverUrlAPI } from "../../utils/Infos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageLoder from "../../components/PageLoder";
import Error from "../../components/Error";
import { IndianRupee, Minus, Plus, Trash } from "lucide-react";
import { calculateDiscount } from "./Menu";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartDetails, setcartDetails] = useState([]);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openConfirmModal, setConfirmModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const getCartItems = async () => {
    const { userId } = queryClient.getQueryData(["profile"]) || 0;

    const response = await axiosInstance.get(`${serverUrlAPI}cart/`, {
      params: {
        userId,
      },
    });
    return response.data;
  };

  useEffect(() => {
    if (openConfirmModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openConfirmModal]);

  const {
    data: cartData,
    isLoading: cartDataLoading,
    isFetching: cartDataFetching,
    isError: isCartError,
    error: cartError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  useEffect(() => {
    if (cartData) {
      const filtereData = cartData?.map((data, idx) => {
        const { price, discount } = data?.menuItem;

        return {
          itemId: data?.cartId,
          quantity: 1,
          price: calculateDiscount(price, discount),
          menuItem: data?.menuItem,
        };
      });

      setcartDetails(filtereData);
    }
  }, [cartData]);

  const handleCheckoutConfirm = () => {
    navigate("/checkout", {
      state: {
        source: "cart",
        checkoutDetails: cartDetails,
      },
    });
  };

  if (cartDataLoading || cartDataFetching) {
    return <PageLoder />;
  }

  if (isCartError) {
    return <Error message={getErrorMessage(cartError)} />;
  }

  if (cartData?.length === 0) {
    return (
      <section className="w-full h-[80vh] flex justify-center items-center">
        <span className="text-[2rem]">Your Cart Is Empty</span>
      </section>
    );
  }

  const handleQuantityChange = (data) => {
    const filteredDetails = cartDetails?.map((cdata, idx) => {
      if (cdata?.itemId === data?.itemId) {
        return { ...cdata, quantity: data?.quantity };
      } else {
        return cdata;
      }
    });
    setcartDetails(filteredDetails);
  };

  const checkForCartItemAvailable = () => {
    if (cartData?.find((cartItem) => cartItem?.menuItem?.available === 0)) {
      return false;
    }
    return true;
  };

  return (
    <>
      <section className="w-full p-2 md:p-3">
        <h1 className="text-[1.9rem] font-normal">Your Cart</h1>

        <section className="flex justify-between items-start w-full">
          <section className="w-full flex justify-between items-start flex-col flex-1">
            {cartData?.map((data, idx) => (
              <CartCard
                data={data}
                key={idx}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </section>

          <section className="w-[300px] hidden md:block ms-1 shadow-md rounded-lg p-2">
            <h1 className="text-[1.3rem]">Checkout Deatils</h1>

            <h1 className="text-[0.98rem] mt-5">
              Total Quantity :{" "}
              {cartDetails?.reduce((result, data) => {
                return result + data?.quantity;
              }, 0)}{" "}
            </h1>

            <h1 className="text-[0.98rem]">
              Total Amount :{" "}
              {cartDetails?.reduce((total, cdata) => {
                return total + cdata?.quantity * cdata?.price;
              }, 0)}{" "}
            </h1>

            <div className="w-full flex justify-center items-center mt-10">
              <button
                className="w-[80%] text-[0.98rem] bg-[#feb80a] rounded-full py-1"
                onClick={() => {
                  if(checkForCartItemAvailable())
                    {
                      setConfirmModalOpen(true)
                    }else{
                      toast.error("Failed to checkout,please remove unavailable items from cart",{
                        className:"text-[0.8rem]"
                      })
                    }
                }}
              >
                CheckOut
              </button>
            </div>
          </section>
        </section>
      </section>

      <section
        className={`fixed bg-white md:hidden bottom-0 w-full p-2 border border-[#ededed] duration-700  ${
          openCheckout ? "translate-y-0" : "translate-y-[78%]"
        }`}
      >
        <h1
          className="text-[1.4rem]"
          onClick={() => setOpenCheckout((prev) => !prev)}
        >
          Checkout Deatils
        </h1>
        <h1 className="text-[0.98rem] mt-5">
          Total Quantity :
          {cartDetails?.reduce((result, data) => {
            return result + data?.quantity;
          }, 0)}
        </h1>

        <h1 className="text-[0.98rem]">
          Total Amount :
          {cartDetails?.reduce((total, cdata) => {
            return total + cdata?.quantity * cdata?.price;
          }, 0)}
        </h1>

        <div className="w-full flex justify-center items-center mt-10">
          <button
            className="w-[80%] text-[0.98rem] bg-[#feb80a] rounded-full py-1"
            onClick={() => { 
              if(checkForCartItemAvailable())
              {
                setConfirmModalOpen(true)
              }else{
                toast.error("Failed to checkout,please remove unavailable items from cart",{
                  className:"text-[0.8rem]"
                })
              }
            }}
          >
            CheckOut
          </button>
        </div>
      </section>

      {openConfirmModal && (
        <section
          className="w-full h-full fixed top-0 left-0 bg-black bg-opacity-40 flex justify-center items-center"
          onClick={(e) => {
            setConfirmModalOpen(false);
          }}
        >
          <article
            className=" p-3 rounded-md bg-white w-[90%] max-w-[300px]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h1 className="text-[1.2rem]">Confirm Checkout ?</h1>
            <footer className="mt-3 flex justify-start items-center gap-1">
              <button
                className="text-[0.8rem] p-1 rounded-full px-2 bg-[#feb80a]"
                onClick={handleCheckoutConfirm}
              >
                Confirm
              </button>
              <button
                className="text-[0.8rem] p-1 px-2 rounded-full border border-[#feb80a]"
                onClick={() => setConfirmModalOpen(false)}
              >
                Cancel
              </button>
            </footer>
          </article>
        </section>
      )}
    </>
  );
};

export default Cart;

const CartCard = ({ data, onQuantityChange = () => {} }) => {
  const { cartId, menuItem } = data;
  const [quantity, setQuantity] = useState(1);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { name, img, price, discount, available } = menuItem;

  const deleteCartItem = async () => {
    const response = await axiosInstance.delete(`${serverUrlAPI}cart/`, {
      params: {
        cartId: cartId,
      },
    });
    return response.data;
  };

  const deleteCartMutation = useMutation({
    mutationKey: ["cart-delete", cartId],
    mutationFn: deleteCartItem,
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
    onSuccess: (result) => {
      toast.success("Item Removed from cart successfully!");
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }, 300);
    },
  });

  return (
    <section className=" w-full p-2 duration-500 shadow-sm hover:shadow-md rounded-lg my-2 relative">
      <article className="flex justify-between items-center">
        <span>
          <img src={img} alt="" className="w-[80px] h-[80px] rounded-md" />
          <h1>{name}</h1>
          <h1 className="flex justify-start items-center">
            <IndianRupee size={14} />
            {discount > 0 ? (
              <div className="flex justify-start items-center gap-1">
                <strike>{price}</strike>
                <span>{calculateDiscount(price, discount)}</span>
                <span className="p-1 text-[0.6rem] font-semibold text-white bg-green-500 rounded-full">
                  {discount}%
                </span>
              </div>
            ) : (
              <span>{price}</span>
            )}
            {available === 0 && (
              <span className="text-[0.7rem] ms-3 rounded-full px-2 py-[2px] border border-red-500 text-red-500">Not Available</span>
            )}
          </h1>
        </span>
        <span className="flex justify-center items-center">
          <Minus
            size={13}
            className="cursor-pointer"
            onClick={() => {
              setQuantity((prev) => {
                if (prev == 1) {
                  onQuantityChange({
                    itemId: cartId,
                    quantity: prev,
                  });
                  return 1;
                }
                onQuantityChange({
                  itemId: cartId,
                  quantity: prev - 1,
                });
                return prev - 1;
              });
            }}
          />
          <input
            type="text"
            value={quantity}
            readOnly
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                setQuantity(val);
              }
            }}
            className="w-[30px] border border-[#efefef] rounded-lg text-center text-[0.8rem]"
          />
          <Plus
            size={13}
            className="cursor-pointer"
            onClick={() => {
              setQuantity((prev) => {
                onQuantityChange({
                  itemId: cartId,
                  quantity: prev + 1,
                });
                return prev + 1;
              });
            }}
          />
        </span>
      </article>
      <div className="flex justify-end items-center w-full">
        <button
          disabled={deleteCartMutation?.isPending}
          onClick={() => deleteCartMutation.mutate()}
          className="text-[0.7rem] flex justify-center items-center gap-1"
        >
          Remove <Trash size={10} />
        </button>
      </div>
    </section>
  );
};
