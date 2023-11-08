import { useEffect, useRef, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import HomeSearchTabs from "../../search/views/components/HomeSearchTabs";
import People from "../../search/views/components/People";
import serviceApi from "../../../services/serviceApi";
import { User } from "../../../common/interfaces/user";
import { Post } from "../../../common/interfaces/post";
import PostItem from "../../home/views/components/PostItem";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import Assets from "../../../assets";
import BossupSearchTabs from "./components/BossupSearchTabs";
import { Industry } from "../../../common/interfaces/industry";
import { Forum } from "../../../common/interfaces/forum";
import IndustryCard from "./components/IndustryCard";
import ForumItem from "../../../common/components/forum/ForumItem";
import { useAppSelector } from "../../../redux/store/store";

const Bossupsearch = ({ onClosePopup }: { onClosePopup: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const industries = useAppSelector((state) => state.industry).industries;
  const [loading, setLoading] = useState<boolean>(false);

  const [searchedGroups, setSearchedGroups] = useState<Industry[]>([]);
  const [searchedTopics, setSearchedTopics] = useState<Forum[]>([]);

  const onSearchGroups = (query: string) => {
    if (currentIndex !== 0) return;
    const filteredIndustries = industries?.filter((ft) =>
      ft.industry?.toLowerCase().includes(query.trim().toLowerCase())
    );

    setSearchedGroups(filteredIndustries);
  };

  const onSearch = async () => {
    if (!searchRef.current?.value.trim()) return;
    if (loading) return;
    setLoading(true);
    let searchQuery = "";
    if (searchRef.current.value.trim().includes("#")) {
      searchQuery = `%23${searchRef.current.value.trim().split("#")[1]}`;
    } else {
      searchQuery = searchRef.current.value.trim();
    }
    const response = await serviceApi.fetch(`/forum/search/${searchQuery}`);
    if (response.success) {
      setSearchedTopics(response.data.rows);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClosePopup(); // Close the parent popup when Escape key is pressed
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClosePopup]);

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div
        className="bg-white top-0 w-full z-50"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1.2px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
        }}
      >
        <div className="bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-grow px-4 pt-2.5 lg:pt-5">
              <div className="computer-only">
                <button onClick={() => onClosePopup()}>
                  <Assets.Backbutton />
                </button>
              </div>
              <div className="mobile-only">
                <button onClick={() => navigate(-1)}>
                  <Assets.Backbutton />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSearch();
                }}
                className="flex-grow" // Added flex-grow class here
              >
                <div className="bg-[#F4F4F4] flex items-center gap-3  lg:py-3 py-2 px-6 rounded-lg">
                  <CiSearch className="text-[#A9A9A9]" size={20} />
                  <input
                    ref={searchRef}
                    type="search"
                    placeholder="search"
                    className="placeholder:text-[#A9A9A9] bg-transparent outline-none border-none flex-grow" // Added flex-grow class here
                    onChange={(event) => {
                      onSearchGroups(event.target.value);
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
          <BossupSearchTabs
            currentIndex={currentIndex}
            onChangeRoute={(index: number) => setCurrentIndex(index)}
          />
        </div>
      </div>

      <div className="mt-4" >
        {currentIndex === 0 ? (
          <div className="grid px-4 grid-cols-2 gap-3">
            {searchedGroups.map((group, index) => {
              return <IndustryCard key={index} industry={group} />;
            })}
          </div>
        ) : null}
        {currentIndex === 1 ? (
          loading ? (
            <FetchStatus
              loading
              error={false}
              errorMessage=""
              onReload={() => { }}
            />
          ) : (
            searchedTopics.map((post: Forum, index: number) => {
              return (
                <div className="my-2 bg-white">
                  <ForumItem
                    onEdit={() => { }}
                    key={index}
                    data={post}
                    onCoin={() => { }}
                    onComment={() => { }}
                    onLike={() => { }}
                    onView={() => { }}
                  />
                </div>
              );
            })
          )
        ) : null}
      </div>

    </div>
  );
};

export default Bossupsearch;
