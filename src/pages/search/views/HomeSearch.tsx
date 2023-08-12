import { useEffect, useRef, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import HomeSearchTabs from "./components/HomeSearchTabs";
import People from "./components/People";
import serviceApi from "../../../services/serviceApi";
import { User } from "../../../common/interfaces/user";
import { Post } from "../../../common/interfaces/post";
import PostItem from "../../home/views/components/PostItem";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import Assets from "../../../assets";

const HomeSearch = ({ onClosePopup }: { onClosePopup: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendedConnections, setRecommendedConnections] = useState<User[]>(
    []
  );
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  const fetchRecommendedConnections = async () => {
    setLoading(true);
    const response = await serviceApi.fetch("/search/get-recommended-data");
    if (response.success) {
      setRecommendedConnections(response.data.recommendedUsers);
      setRecommendedPosts(response.data.recommendedPosts);
    }
    setLoading(false);
  };

  const onSearch = async () => {
    if (!searchRef.current?.value.trim()) return;
    if (loading) return;
    setLoading(true);
    setIsSearch(true);
    let searchQuery = "";
    if (searchRef.current.value.trim().includes("#")) {
      searchQuery = `%23${searchRef.current.value.trim().split("#")[1]}`;
    } else {
      searchQuery = searchRef.current.value.trim();
    }
    const response = await serviceApi.fetch(`/search/${searchQuery}`);
    if (response.success) {
      setSearchedUsers(response.data.users);
      setSearchedPosts(response.data.posts.rows);
    }
    setLoading(false);
  };

  // const onSearch = async () => {
  //   if (!searchRef.current?.value.trim()) return;
  //   if (loading) return;
  //   setLoading(true);
  //   if (currentIndex === 0) {
  //     setIsSearch(true);
  //     const response = await serviceApi.fetch(
  //       `/users/name/${searchRef.current.value.trim()}`
  //     );
  //     if (response.success) {
  //       setSearchedUsers(response.data);
  //     }
  //   } else {
  //     let searchQuery = "";
  //     if (searchRef.current.value.trim().includes("#")) {
  //       searchQuery = `%23${searchRef.current.value.trim().split("#")[1]}`;
  //     } else {
  //       searchQuery = searchRef.current.value.trim();
  //     }
  //     const response = await serviceApi.fetch(`/post/search/${searchQuery}`);
  //     if (response.success) {
  //       setSearchedPosts(response.data.rows);
  //     }
  //   }
  //   setLoading(false);
  // };

  useEffect(() => {
    fetchRecommendedConnections();

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
    <div>
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
              <div className="mobile-only items-center">
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
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setIsSearch(false);
                      }
                    }}
                    className="placeholder:text-[#A9A9A9] bg-transparent outline-none border-none flex-grow" // Added flex-grow class here
                  />
                </div>
              </form>
            </div>
          </div>
          <HomeSearchTabs
            currentIndex={currentIndex}
            onChangeRoute={(index: number) => setCurrentIndex(index)}
          />
        </div>
      </div>

      <div className="">
        {currentIndex === 0 ? (
          <People
            loading={loading}
            isSearching={isSearch}
            recommendedConnections={
              isSearch ? searchedUsers : recommendedConnections
            }
          />
        ) : null}
        {currentIndex === 1 ? (
          loading ? (
            <FetchStatus
              loading
              error={false}
              errorMessage=""
              onReload={() => {}}
            />
          ) : isSearch ? (
            searchedPosts.map((post: Post, index: number) => {
              return (
                <div className="mx-5 bg-white"> <PostItem
                key={index}
                data={post}
                onCoin={() => {}}
                onComment={() => {}}
                onLike={() => {}}
              /></div>
               
              );
            })
          ) : (
            recommendedPosts.map((post: Post, index: number) => {
              return (
                <div className="mt-0 mx-5 bg-white">
                   <PostItem
                  key={index}
                  data={post}
                  onCoin={() => {}}
                  onComment={() => {}}
                  onLike={() => {}}
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

export default HomeSearch;
