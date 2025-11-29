import React from "react";
import { Oval } from "react-loader-spinner";

const ContentLoader = () => {
  return (
    <Oval
      visible={true}
      height="40"
      width="30"
      color="#feb80a"
      secondaryColor="white"
      ariaLabel="oval-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default ContentLoader;
