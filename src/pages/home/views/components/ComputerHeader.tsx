import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
 // Use 'all' to import all icons from react-icons package
import ComputerTopNav from "./ComputerTopNav";
import HomeSearch from "../../../search/views/HomeSearch";
import RoutesPath from "../../../../constants/Routes";
import Assets from "../../../../assets";
import { CiSearch } from "react-icons/ci";
import { BiX } from "react-icons/bi";

const ComputerHeader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const location = useLocation();
  const currentRoute = location.pathname;

  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add("popup-open");
    } else {
      document.body.classList.remove("popup-open");
    }
  }, [isPopupOpen]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleTabClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="fixed bg-white top-0 w-full z-50">
      <div className="flex items-end justify-between mr-5 ml-5 lg:ml-20 lg:mr-20">
        <div className="flex items-center flex-grow">
          <img
            src={Assets.Logo}
            className="w-12 h-12 my-3 cursor-pointer"
            alt=""
            onClick={() => navigate(RoutesPath.home)}
          />
          <div className="computer-only">
            {/* Show search bar on large screens */}
            <div className="hidden lg:block">
              <button
                onClick={openPopup}
                className="flex items-center gap-2 bg-[#F4F4F4] py-4 px-12 rounded-lg ml-5"
                style={{ width: "300px" }}
              >
                <CiSearch className="text-[#A9A9A9]" size={20} />
                <p className="text-[#A9A9A9] text-sm">Search people & posts</p>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Show search icon on small screens */}
          <div className="lg:hidden">
            <div className="bg-[#f4f4f4] rounded-full p-2 cursor-pointer" onClick={openPopup}>
              <CiSearch className="text-[#333333]" size={23} style={{ strokeWidth: 1 }} />
            </div>
          </div>
          <ComputerTopNav currentIndex={currentIndex} onTabClick={handleTabClick} currentRoute={currentRoute} />
        </div>
      </div>
      <div style={{ height: "1.2px", width: "100%", background: "rgba(0, 0, 0, 0.1)" }}></div>
      {isPopupOpen && (
        <div className="overlay">
          <div className="popup">
            <button onClick={closePopup} style={{ paddingBottom: 20 }}>
              <BiX size={20} />
            </button>
            <div className="bg-[#F4F4F4] flex items-center gap-3 py-2 px-6 rounded-lg">
              <CiSearch className="text-[#A9A9A9]" size={20} />
              <input
                type="search"
                placeholder="search"
                className="placeholder:text-[#A9A9A9] bg-transparent outline-none border-none"
              />
            </div>
            <HomeSearch />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComputerHeader;
