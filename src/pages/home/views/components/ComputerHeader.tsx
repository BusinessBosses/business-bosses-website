import React from "react";
import { CiSearch } from "react-icons/ci";
import Assets from "../../../../assets";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import ComputerTopNav from "./ComputerTopNav";

const ComputerHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bg-white top-0 w-full z-50">
      <div className="flex items-center justify-between p-3 mx-5" style={{ marginLeft: "150px", marginRight: "150px" }}>
        <div className="flex items-center">
          <img src={Assets.Logo} className="w-12 h-12" alt="" />
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
        <div className="flex items-center gap-2">
          <ComputerTopNav currentIndex={0} />
        </div>

      </div>

      <div style={{ height: "1.2px", width: "100%", background: "rgba(0, 0, 0, 0.1)" }}></div>
    </div>
  );
};

export default ComputerHeader;
