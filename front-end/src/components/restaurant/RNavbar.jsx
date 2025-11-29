import React, { useEffect, useState } from "react";
import chef from "../../assets/img/cheif.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  House,
  Menu,
  ShoppingBag,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";
const RNavbar = () => {
  const [activeMenu, setActiveMenu] = useState("rhome");
  const [openMenu, setOpenMenu] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();


  useEffect(()=>{
  
      if(logoutModal)
      {
        document.body.style.overflow="hidden"
      }else{
        document.body.style.overflow="auto"
      }
  
    },[logoutModal])

  const menuItems = [
    {
      key: "rhome",
      title: "Home",
      link: "/restaurant",
      icon: <House className="w-4 h-4" />,
    },
    {
      key: "rmenu",
      title: "Your Menu",
      link: "/restaurant/menu",
      icon: <UtensilsCrossed className="w-4 h-4" />,
    },
    {
      key: "rorders",
      title: "Orders",
      link: "/restaurant/orders",
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      key: "rreviews",
      title: "Reviews",
      link: "/restaurant/reviews",
      icon: <Star className="w-4 h-4" />,
    },
  ];

  const handleMenuClick = () => {
    setOpenMenu((prev) => !prev);
  };

  const handleLogoutBtnClick =()=>{
    localStorage.removeItem("token");
    setLogoutModal(false)
    setTimeout(()=>{
      navigate("/restaurant/signin")
    },500)
  }


  return (
    <>
      <nav className="w-full p-2 px-4 flex justify-between items-center">
      <section className="flex justify-start items-center">
        <h1 className="text-3xl">SR</h1>
        <img src={chef} alt="" className="w-14 h-14" />
      </section>

      <Menu className="flex md:hidden" onClick={handleMenuClick} />

      <ul className="hidden md:flex justify-end items-center gap-3">
        {menuItems.map((item, idx) => (
          <li
            key={item.key}
            className={`p-1 px-3 rounded-lg ${
              location.pathname === item.link? " bg-[#feb80a] " : ""
            }`}
          >
            <Link to={item.link} key={item.key} className="cursor-pointer">
              <span className="flex justify-center items-center gap-1">
                {item.icon} {item.title}
              </span>
            </Link>
          </li>
        ))}
        <li><button onClick={()=>setLogoutModal(true)}>Logout</button></li>
      </ul>

      <article
        className={`block md:hidden fixed top-0 right-0 w-[300px] h-screen bg-white z-[999] border border-gray-300 duration-1000 ease-in-out p-3 ${
          !openMenu && "translate-x-[100%]"
        }`}
      >
        <div className="flex justify-end w-full items-center">
          <X className="flex md:hidden" onClick={handleMenuClick} />
        </div>
        <nav className="flex flex-col justify-start items-start gap-[20px] list-none p-3 ps-2">
          {menuItems.map((item, idx) => (
            <li
              key={item.key}
              className={`p-1 px-3 rounded-lg ${
                activeMenu === item.key ? " bg-[#feb80a] " : ""
              }`}
            >
              <Link to={item.link} key={item.key} className="cursor-pointer">
                <span className="flex justify-center items-center gap-1">
                  {item.icon} {item.title}
                </span>
              </Link>
            </li>
          ))}
          <li><button onClick={()=>setLogoutModal(true)}>Logout</button></li>
        </nav>
      </article>
    </nav>
     {logoutModal && (
      <section className="w-full z-[999] top-0 fixed left-0 h-screen bg-black bg-opacity-50 flex justify-center items-center" onClick={()=>{
        setLogoutModal(false)
      }}>
        
        <article className="p-3 rounded-lg bg-white w-full max-w-[300px] " onClick={(e)=>{
           e.stopPropagation();
        }}>
          <p>Are your sure want to logout?</p>
          <footer className="flex justify-start items-center mt-6 gap-2">
             <button 
             className="px-2 py-1 text-[0.8rem] rounded-lg border-[#feb80a] border"
             onClick={()=>setLogoutModal(false)}>Cancel</button>
             <button 
             className="px-2 py-1 text-[0.8rem] rounded-lg bg-[#feb80a]"
             onClick={handleLogoutBtnClick}>Logout</button>
          </footer>
        </article>

      </section>
    )}
    </>
  );
};

export default RNavbar;
