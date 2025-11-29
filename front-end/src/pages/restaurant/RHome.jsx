import React from "react";
import bg from "../../assets/img/cheif.png";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RHome = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="w-full max-w-[1800px] h-[50vh] lg:h-[60vh] bg-white relative flex justify-start items-center p-3">
        <article className="flex flex-1 h-full  flex-col justify-center items-center">
          <span className="text-7xl text-[#feb80a] font-extrabold duration-500 hover:tracking-tighter">
            Hello Chef,
          </span>
          <span className="text-2xl font-extrabold">
            Let’s Serve the World from Our Kitchen!
          </span>
          <button
            className=" p-1 bg-black text-white rounded-2xl flex justify-center items-center gap-2 px-3"
            onClick={() => navigate("/restaurant/menu")}
          >
            Kitchen <ArrowRight className="w-4 h-4" />{" "}
          </button>
        </article>
        <article className="h-full lg:w-[400px] xl:w-[600px] flex justify-start items-center">
          <img src={bg} alt="" />
        </article>
      </section>

      <section className="w-full mx-auto max-w-[1300px] p-2">
        <h1 className="text-2xl font-extralight">Recent Order :</h1>
        <article className="w-full py-2 overflow-auto flex justify-start items-center gap-3 px-3">
          <RecentOrders />
          <RecentOrders />
          <RecentOrders />
          <RecentOrders />
          <RecentOrders />
          <RecentOrders />
          <RecentOrders />
        </article>
      </section>
    </>
  );
};

export default RHome;

const RecentOrders = () => {
  return (
    <div className="w-[250px]  shadow-md rounded-lg flex-shrink-0 flex-grow-0  p-2 duration-500 hover:scale-[0.95] cursor-pointer">
      <img
        src="https://www.cookwithnabeela.com/wp-content/uploads/2025/01/ChickenBiryani.webp"
        alt=""
        className="w-full h-[180px] rounded-lg"
      />
      <h1 className="text-[1.5rem] whitespace-nowrap overflow-hidden text-ellipsis font-semibold">
        Mantipet Biryani jhbkj
      </h1>
    </div>
  );
};
