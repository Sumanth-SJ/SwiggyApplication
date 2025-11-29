import React from "react";
import { Oval } from "react-loader-spinner";
import loader from '../assets/loader-2_food.gif'

const PageLoder = () => {
  return (
    <section className="w-full max-w-[1800px] h-[80vh] flex flex-col justify-center items-center">
      {/* <Oval
        visible={true}
        height="80"
        width="80"
        color="#feb80a"
        secondaryColor="white"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      <h1 className="text-center">Eru Solpa</h1> */}
      <img src={loader} alt=""  className="w-[250px] h-[200px]" />
    </section>
  );
};

export default PageLoder;
