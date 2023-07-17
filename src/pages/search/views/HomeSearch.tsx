import { useState } from "react";
import { BiArrowBack, BiCross, BiExit, BiWindowClose, BiX } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import HomeSearchTabs from "./components/HomeSearchTabs";
import People from "./components/People";
import PostItem from "../../home/views/components/PostItem";

const HomeSearch = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const navigate = useNavigate();
  return (
    <div >
    <div className="mobile-only">
      <div className="fixed top-0 w-full z-50">
        <div className="bg-white p-5 flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <BiArrowBack size={20} />
          </button>
          <div className="bg-[#F4F4F4] flex items-center gap-3  py-2 px-6 rounded-lg">
            <CiSearch className="text-[#A9A9A9]" size={20} />

            <input
              type="search"
              placeholder="search"
              className="placeholder:text-[#A9A9A9] bg-transparent outline-none border-none"
            />
          </div>
          <div />
        </div>
      </div>
      <div className="my-12"></div>
      <div className="p-5">
        <HomeSearchTabs
          currentIndex={currentIndex}
          onChangeRoute={(index: number) => setCurrentIndex(index)}
        />

        {currentIndex === 0 ? <People /> : null}
        {currentIndex === 1 ? <PostItem /> : null}
      </div>
    </div>

    <div className="computer-only">
     
   
        <HomeSearchTabs
          currentIndex={currentIndex}
          onChangeRoute={(index: number) => setCurrentIndex(index)}
        />

        {currentIndex === 0 ? <People /> : null}
        {currentIndex === 1 ? <PostItem /> : null}
      </div>
    </div>
    

  );
};

export default HomeSearch;
