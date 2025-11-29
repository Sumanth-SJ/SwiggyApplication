import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { getErrorMessage, serverUrlAPI } from "../../utils/Infos";
import PageLoder from "../../components/PageLoder";
import toast from "react-hot-toast";
import { MoveLeft, MoveRight } from "lucide-react";
import Loader from "../../components/Loader";

const Review = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { orderId, menuId, menu } = location.state;
  const { img, name } = menu;

  const [rating, setRating] = useState(-1);
  const [comment, setComment] = useState("");

  const handleRatingChange = (val) => {
    setRating(val);
  };


  const submitReview = async()=>{

    const userId = queryClient.getQueryData(["profile"])?.userId || 0 ;

    const data = {
        rating,
        comment,
        orderId,
        itemId:menuId,
        userId
    }
    const response = await axiosInstance.post(`${serverUrlAPI}review/`,data);
    return response.data;
  }


  const  reviewSubmitMutataion = useMutation({
    mutationKey : ["review" , orderId],
    mutationFn:submitReview,
    onSuccess:(result)=>{
         toast.success("Review Submitted Successfully!");
         setTimeout(()=>{
             navigate(-1);
         },400)
    },
    onError:(error)=>{
      console.log(error);
      toast.error(getErrorMessage(error));
    }
  })


  const handleSubmitCLick = () => {
    if (rating <=0) {
      toast.error("Rating Required!");
      return;
    }
    if (comment === "") {
      toast.error("Comment Required !");
      return;
    }

    reviewSubmitMutataion.mutate();
  };

  return (
    <>
      <section className="p-2 md:p-5 w-full h-screen flex flex-col items-start">
        <article className="flex justify-start items-center my-3">
          <span onClick={()=>navigate(-1)} className="flex justify-center cursor-pointer items-center border border-[#ededed] gap-1 text-[0.8rem] px-2 py-1 rounded-full ">
            <MoveLeft size={10} />
            Back
          </span>
        </article>
        <h1 className="text-[1rem] md:text-[1.5rem] font-normal">
          Leave Your Review
        </h1>

        <article className="w-[300px] md:w-[400px]  p-5 rounded-lg shadow-md  mx-auto">
          <img
            src={img}
            className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-md"
            alt=""
          />
          <h1 className="text-[1rem] md:text-[1.3rem] font-light">{name}</h1>

          <Rating onChange={handleRatingChange} />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            name=""
            placeholder="Comment"
            className="w-full border border-[#ededed] p-1 rounded-md mt-2 text-[0.9rem] outline-none"
            id=""
          ></textarea>

          <div className="w-full flex justify-center items-center mt-4">
            <button
              disabled ={reviewSubmitMutataion.isPending ? true :false}
              onClick={handleSubmitCLick}
              className="w-[80%] mx-auto rounded-full py-2 text-[0.8rem] bg-[#feb80a] flex justify-center items-center gap-1"
            >
              Submit {reviewSubmitMutataion.isPending && <Loader/>}
            </button>
          </div>
        </article>
      </section>
    </>
  );
};

export default Review;

const Rating = ({ onChange = () => {} }) => {
  const ratingEmojis = ["😡", "😟", "😐", "🙂", "😃"]; // Use Unicode emojis directly

  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    onChange(selected+1);
  }, [selected]);

  return (
    <section className="w-full flex justify-start items-center mt-3 gap-1">
      {ratingEmojis.map((emoji, idx) => (
        <span
          key={idx}
          className={`text-[1.2rem] cursor-pointer duration-300 hover:scale-125 ${
            selected === idx && "scale-150"
          }`}
          onClick={() => setSelected(idx)}
        >
          {emoji}
        </span>
      ))}
    </section>
  );
};
