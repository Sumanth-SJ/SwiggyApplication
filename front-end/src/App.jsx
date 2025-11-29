import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/customer/Login";
import Home from "./pages/customer/Home";
import SignUp from "./pages/customer/SignUp";
import { Toaster } from "react-hot-toast";
import AuthEmailOtp from "./components/AuthEmailOtp";
import AuthEmailVerify from "./components/AuthEmailVerify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RSignUp from "./pages/restaurant/RSignUp";
import RSignIn from "./pages/restaurant/RSignIn";
import RWrapper from "./pages/restaurant/RWrapper";
import RHome from "./pages/restaurant/RHome";
import RMenuList from "./pages/restaurant/RMenuList";
import RAddMenuItem from "./pages/restaurant/RAddMenuItem";
import "react-loading-skeleton/dist/skeleton.css";
import RFoodupdate from "./pages/restaurant/RFoodUpdate";
import ROrders from "./pages/restaurant/ROrders";
import Wrapper from "./pages/customer/Wrapper";
import Menu from "./pages/customer/Menu";
import MenuItem from "./pages/customer/MenuItem";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import OrderSuccess from "./pages/customer/OrderSuccess";
import Orders from "./pages/customer/Orders";
import OrderItem from "./pages/customer/OrderItem";
import Review from "./pages/customer/Review";
import RReviews from "./pages/restaurant/RReviews";
import DSignup from "./pages/delivery/DSignup";
import DSignin from "./pages/delivery/DSignin";
import DWrapper from "./pages/delivery/DWrapper";
import DHome from "./pages/delivery/DHome";
import DDeliveries from "./pages/delivery/DDeliveries";
import DOrders from "./pages/delivery/DOrders";
import DOrderItem from "./pages/delivery/DOrderItem";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/register" element={<SignUp />} />
            <Route path="/restaurant/signup" element={<RSignUp />} />
            <Route path="/restaurant/signin" element={<RSignIn />} />
            <Route path="/delivery/signup" element={<DSignup/>} />
            <Route path="/delivery/signin" element={<DSignin/>} />


            <Route path="/" element={<Wrapper/>}>
              <Route index element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/item" element={<MenuItem />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/success" element={<OrderSuccess />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order/item" element={<OrderItem />} />
              <Route path="/order/review" element={<Review />} />
            </Route>
            

            <Route path="/restaurant" element={<RWrapper />}>
              <Route index element={<RHome />} />
              <Route path="/restaurant/menu" element={<RMenuList />} />
              <Route path="/restaurant/menu/add" element={<RAddMenuItem />} />
              <Route
                path="/restaurant/menu/update/:menuId"
                element={<RFoodupdate />}
              />
              <Route path="/restaurant/orders" element={<ROrders />} />
              <Route path="/restaurant/reviews" element={<RReviews />} />
            </Route>

            <Route path="/delivery" element={<DWrapper/>}>
               <Route index element={<DHome/>} />
               <Route path="/delivery/deliveries" element={<DDeliveries/>} />
               <Route path="/delivery/orders" element={<DOrders/>} />
               <Route path="/delivery/orders/item" element={<DOrderItem/>} />
            </Route>

            
          </Routes>
        </BrowserRouter>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
