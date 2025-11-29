import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateDiscount } from "./Menu";
import { IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import { useRazorpay } from "react-razorpay";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage, serverUrlAPI } from "../../utils/Infos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/Loader";

const Checkout = () => {
  const [checkoutDetails, setCheckOutDetails] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [payment, setPaymentOption] = useState("");
  const [deliveryAddress, setDeiveryAddress] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [orderCaptcha, setOrderCaptcha] = useState("");

  const { error, isLoading, Razorpay } = useRazorpay();

  const captchInputRef = useRef();

  const location = useLocation();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const createItemOrder = async (razorPayId = null ) => {

    const userId = queryClient.getQueryData(["profile"])?.userId || 0;

    const data = {
      mode: payment === "cod" ? "COD" : "Bank",
      deliveryAddress,
      totalAmount,
      checkoutAmount,
      razorPayId,
      userId,
      source : (location.state?.source || "null"),
      items: checkoutDetails.map((item, idx) => {
        const { quantity, menuItem } = item;
        const { itemId } = menuItem;

        return {
          itemId,
          quantity,
        };
      }),
    };
    const response = await axiosInstance.post(`${serverUrlAPI}order/`, data);
    return response.data;
  };

  const createRazorpayOrder = async () => {
    const amount =
      totalAmount === checkoutAmount ? totalAmount : checkoutAmount;
    const response = await axiosInstance.post(
      `${serverUrlAPI}payment/create/order`,
      {
        amount,
      }
    );
    return response.data;
  };

  const createRazorpayOrderMutate = useMutation({
    mutationKey: ["razorpay", "order"],
    mutationFn: createRazorpayOrder,
    onSuccess: (result) => {
      console.log(result);
      const { orderId } = result;
      const options = {
        key: "rzp_test_LlqzAuvt2E191U", // Razorpay API Key
        amount:
          (totalAmount === checkoutAmount ? totalAmount : checkoutAmount) * 100, // Convert INR to paise
        currency: "INR",
        name: "Swiggy Company",
        description: "Test Payment",
        order_id: orderId, // Order ID from backend
        handler: async (response) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          let verifyResponse = null;

          try {
            verifyResponse = await axiosInstance.post(
              `${serverUrlAPI}payment/verify`,
              {
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
              }
            );
          } catch (error) {
            console.log(error);
          }

          const { status } = verifyResponse.data;

          if (status === "success") {
            createItemOrderMutation.mutate(razorpay_payment_id);
          } else {
            toast.error("Payment Failed");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "6362379895",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            console.log("User closed the payment modal.");
            toast.error("Payment Cancelled");
          },
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  });

  const createItemOrderMutation = useMutation({
    mutationFn: createItemOrder,
    mutationKey: ["make-order"],
    onSuccess: (result) => {
      navigate("/payment/success");
    },
    onError: (err) => {
     toast.error("Failed to palce order");
    },
  });

  const paymentOption = [
    {
      key: "cod",
      label: "Cash On Delivery",
      icon: "https://cdn-icons-png.flaticon.com/512/6491/6491490.png",
    },
  ];


  useEffect(() => {
    if (location.state) {

        const {checkoutDetails} = location.state
      setCheckOutDetails(checkoutDetails);
    }
  }, [location.state]);

  useEffect(() => {
    const quantity = checkoutDetails.reduce((total, item) => {
      return (total = total + item.quantity);
    }, 0);
    setTotalQuantity(quantity);

    // By including discount
    const amount = checkoutDetails.reduce((total, item) => {
      const { quantity, menuItem } = item;
      const { price } = menuItem;
      return (total = total + quantity * price);
    }, 0);
    // By excluding discount
    const camount = checkoutDetails.reduce((total, item) => {
      const { quantity, menuItem } = item;
      const { price, discount } = menuItem;
      return (total = total + quantity * calculateDiscount(price, discount));
    }, 0);

    setTotalAmount(amount);
    setCheckoutAmount(camount);
  }, [checkoutDetails]);

  const handlePlaceOrderClick = () => {

    if (deliveryAddress === "") {
      toast.error("Delivery address required");
      return;
    }
    if (payment === "") {
      toast.error("Choose Payment Option");
      return;
    }
    setOrderCaptcha(generateCaptcha(6));

    setOpenModal(true);
  };

  const handleCODConfirmClick = () => {
    if (captchInputRef.current.value === "") {
      toast.error("Captch required!");
      return;
    }

    if (captchInputRef.current.value !== orderCaptcha) {
      toast.error("Invalid Captch!");
      return;
    }

    setTimeout(() => {
      setOpenModal(false);
    }, 800);

    createItemOrderMutation.mutate();
  };

  return (
    <>
      <section className="w-full h-screen flex justify-start flex-col items-center p-2 md:p-4">
        <article className="w-full max-w-[600px] p-2 mt-5 shadow-md rounded-lg">
          <h1 className="text-[1.6rem]">Checkout Details</h1>

          <article className=" mt-3">
            <div className="w-full my-2 rounded-sm border-b last:border-none grid grid-cols-3 items-center">
              <span className="mx-auto">Food</span>
              <span className="mx-auto">Quantity</span>
              <span className="mx-auto">Price</span>
            </div>
            {checkoutDetails?.map((data, idx) => (
              <CheckoutItem data={data} key={idx} />
            ))}
            <div className="w-full my-2 rounded-sm border-b last:border-none grid grid-cols-3 items-center">
              <span className="mx-auto"></span>
              <span className="mx-auto">{totalQuantity}</span>
              <span className="mx-auto flex justify-center items-center gap-1">
                <IndianRupee size={12} />
                {totalAmount !== checkoutAmount ? (
                  <>
                    <strike>{totalAmount}</strike>
                    <span>{checkoutAmount}</span>
                  </>
                ) : (
                  totalAmount
                )}
              </span>
            </div>
          </article>
        </article>
        <article className=" w-full max-w-[600px] shadow-md rounded-lg p-3">
          <h1 className="text-[1.1rem]">Delivery Address</h1>
          <input
            type="text"
            placeholder="Address"
            className="w-full mt-3 shadow-md rounded-md p-2 "
            value={deliveryAddress}
            onChange={(e) => setDeiveryAddress(e.target.value)}
          />
        </article>
        <article className=" w-full max-w-[600px] shadow-md rounded-lg p-3">
          <h1 className="text-[1.1rem]">Payment Option</h1>

          <div className="mt-4 p-4">
            {paymentOption?.map((option, idx) => (
              <div
                className="w-full p-2 border-b flex justify-between items-center cursor-pointer"
                key={option.key}
                onClick={() => setPaymentOption(option.key)}
              >
                <span className="flex justify-start items-center gap-1">
                  {option.label}
                  <img src={option.icon} alt="" className="h-6 w-6" />
                </span>

                <div
                  className={`w-4 h-4 rounded-full flex justify-center items-center ${
                    payment === option.key ? "bg-[#feb80a]" : "bg-[#efefef]"
                  } cursor-pointer`}
                >
                  <span className="bg-white w-2 h-2 rounded-full"></span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 w-full flex justify-center items-center">
            <button
              className="w-[70%] rounded-full p-2 bg-[#feb80a] text-[0.9rem] flex justify-center items-center gap-1"
              disabled={createRazorpayOrderMutate.isPending || createItemOrderMutation.isPending }
              onClick={() => {
                if (payment === "cod") {
                  handlePlaceOrderClick();
                } else {
                  createRazorpayOrderMutate.mutate();
                }
              }}
            >
              <span>Place Order</span> {(createRazorpayOrderMutate.isPending || createItemOrderMutation.isPending ) && <Loader/>}
            </button>
          </div>
        </article>
      </section>

      {openModal && (
        <section
          className="top-0 left-0 w-full h-full fixed flex justify-center items-center bg-black bg-opacity-35"
          onClick={() => setOpenModal(false)}
        >
          {/* For COD */}

          <article
            className="w-[300px] md:w-[400px] bg-white p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-[1.4rem] font-semibold">Confirm Order</h1>
            <h1 className="mt-4">Enter the captcha</h1>

            <h1 className="p-3 bg-black text-white rounded-lg mt-2 font-semibold">
              {orderCaptcha}
            </h1>

            <input
              type="text"
              className="mt-3 border border-[#efefef] rounded-md p-2 w-full"
              ref={captchInputRef}
            />

            <div className="flex mt-3 justify-start items-center gap-3">
              <button
                className="text-[0.9rem] bg-[#feb80a] p-2 rounded-lg"
                onClick={handleCODConfirmClick}
              >
                Confirm
              </button>
              <button
                className="text-[0.9rem] border border-[#feb80a] p-2 rounded-lg"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
            </div>
          </article>
        </section>
      )}
    </>
  );
};

export default Checkout;

const CheckoutItem = ({ data }) => {
  const { quantity, menuItem } = data;

  const { img, name, price, discount } = menuItem;

  return (
    <div className="w-full my-2 rounded-sm border-b last:border-none grid grid-cols-3 items-center">
      <img src={img} alt="" className="w-[60px] h-[60px] rounded-md mx-auto" />
      <span className="mx-auto">{quantity}</span>
      <span className="mx-auto">
        {discount > 0 ? (
          <div className="flex justify-start items-center gap-1">
            <strike>{price}</strike>
            <span>{calculateDiscount(price, discount)}</span>
            <span className="p-1 text-[0.7rem] font-semibold text-white bg-green-500 rounded-full">
              {discount}%
            </span>
          </div>
        ) : (
          <span>{price}</span>
        )}
      </span>
    </div>
  );
};

const generateCaptcha = (length = 5) => {
  const data = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";

  for (let i = 0; i < length; i++) {
    captcha += data.charAt(Math.floor(Math.random() * data.length));
  }
  return captcha;
};
