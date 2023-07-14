import { CiSearch } from "react-icons/ci";
import RoutesPath from "../../../../constants/Routes";
import Assets from "../../../../assets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ComputerTopNav from "./ComputerTopNav";

const ComputerHeader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleTabClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="fixed bg-white top-0 w-full z-50">
      <div
        className="flex items-center justify-between mx-5"
        style={{ marginLeft: "150px", marginRight: "150px" }}
      >
        <div className="flex items-center flex-grow">
          <img src={Assets.Logo} className="w-12 h-12 my-3" alt="" />
          <div className="flex items-center gap-2 ml-10">
            <button
              onClick={() => navigate(RoutesPath.homeSearch)}
              className="flex items-center gap-2 bg-[#F4F4F4] py-4 px-12 rounded-lg"
            >
              <CiSearch className="text-[#A9A9A9]" />
              <p className="text-[#A9A9A9] text-sm">Search people & posts</p>
            </button>
          </div>
        </div>
        <div className="flex items-end gap-2"> {/* Modified flex items-center to flex items-end */}
          <ComputerTopNav currentIndex={currentIndex} onTabClick={handleTabClick} />
        </div>
      </div>
      <div style={{ height: "1.2px", width: "100%", background: "rgba(0, 0, 0, 0.1)" }}></div>
    </div>
  );
};

export default ComputerHeader;
