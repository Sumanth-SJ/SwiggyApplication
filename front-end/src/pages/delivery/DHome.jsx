import { Search } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DHome = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    navigate(`/delivery/deliveries?q=${searchQuery}`);
  };

  return (
    <>
      <section className="w-full h-[50vh] flex flex-col md:flex-row justify-center items-center p-2 md:p-5">
        <article className="flex justify-center items-center text-[2rem] md:text-[3rem] gap-2 font-extrabold">
          <span className="text-orange-600">FAST</span>
          <div className="flex flex-col justify-center items-start">
            <span>FOOD</span>
            <span className="-translate-y-5">DELIVERY</span>
          </div>
        </article>

        <img
          src="https://t4.ftcdn.net/jpg/07/39/32/99/360_F_739329921_05Swu26SxilYCQOPqlWQ8WcPiw4gcm9S.jpg"
          className="w-[500px] h-[250px] md:h-[300px] duration-500 hover:translate-x-10"
          alt=""
        />
      </section>

      <section className="w-full p-2 md:p-5">
        <h1 className="text-[2rem] md:text-[2.5rem] font-extrabold text-orange-500">
          Pick And Deliver order
        </h1>

        <article className="w-full max-w-[400px] mx-auto border shadow-sm rounded-full p-2 mt-5 flex justify-start items-center">
          <input
            type="text"
            placeholder="Search By Location"
            className="flex-1 placeholder:text-[0.9rem] text-[0.9rem] pe-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
          />
          <button className="p-2 rounded-full bg-black" onClick={handleSearchClick}>
            <Search size={14} className="text-white" />
          </button>
        </article>
      </section>
    </>
  );
};

export default DHome;
