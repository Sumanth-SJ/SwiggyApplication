export const serverUrlAPI = "http://localhost:8085/api/";
export const serverUrl = "http://localhost:8085/";




export const getErrorMessage = (error) => {

  const {status} = error?.response;
  if(status === 401)
  {
    return "Unauthorized";
  }

  return error?.response?.data
    ? error?.response?.data?.message
    : "Something Went Wrong!";
};

export const ordersFilters = [
  {
    title: "Delivered",
    value: "delivered",
  },
  {
    title : "Out For Delivery",
    value :"out for delivery"
  },
  {
    title : "Prepared",
    value : "prepared"
  },
  {
    title : "Preparing",
    value : "preparing"
  },
  {
    title : "Pending",
    value : "pending"
  }
];
