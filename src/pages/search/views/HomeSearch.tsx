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

const HomeSearch = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendedConnections, setRecommendedConnections] = useState<User[]>(
    []
  );
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
  const fetchRecommendedConnections = async () => {
    setLoading(true);
    const response = await serviceApi.fetch(
      "/connection/getRecommendedConnections?page=0&size=100"
    );
    if (response.success) {
      setRecommendedConnections(response.data.rows);
    }
    setLoading(false);
  };

  const onSearch = async () => {
    if (!searchRef.current?.value.trim()) return;
    if (loading) return;
    setLoading(true);
    if (currentIndex === 0) {
      setIsSearch(true);
      const response = await serviceApi.fetch(
        `/users/name/${searchRef.current.value.trim()}`
      );
      if (response.success) {
        setSearchedUsers(response.data);
      }
    } else {
      let searchQuery = "";
      if (searchRef.current.value.trim().includes("#")) {
        searchQuery = `%23${searchRef.current.value.trim().split("#")[1]}`;
      } else {
        searchQuery = searchRef.current.value.trim();
      }
      const response = await serviceApi.fetch(`/post/search/${searchQuery}`);
      if (response.success) {
        setSearchedPosts(response.data.rows);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecommendedConnections();
  }, []);
  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <div className="bg-white p-5 flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <BiArrowBack size={20} />
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch();
            }}
          >
            <div className="bg-[#F4F4F4] flex items-center gap-3  py-2 px-6 rounded-lg">
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
                className="placeholder:text-[#A9A9A9] bg-transparent outline-none border-none"
              />
            </div>
          </form>
          <div />
        </div>
      </div>
      <div className="my-12"></div>
      <div className="p-5">
        <HomeSearchTabs
          currentIndex={currentIndex}
          onChangeRoute={(index: number) => setCurrentIndex(index)}
        />

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
          ) : (
            searchedPosts.map((post: Post, index: number) => {
              return (
                <PostItem
                  data={post}
                  onCoin={() => {}}
                  onComment={() => {}}
                  onLike={() => {}}
                />
              );
            })
          )
        ) : null}
      </div>
    </div>
  );
};

export default HomeSearch;
