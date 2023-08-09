import { CiSearch } from "react-icons/ci";
import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Challenge from "./Challenge";
import Tabs from "./components/Tabs";
import RoutesPath from "../../../constants/Routes";
import Learning from "./Learning";
import Opportunities from "./Opportunities";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { saveIndustriesToState } from "../../../redux/slices/IndustrySlice";
import {
  addForumsToState,
  incrementPage,
  saveCount,
} from "../../../redux/slices/ForumSlice";
import CommunitiesController from "../controller/CommunitiesController";
import { Forum } from "../../../common/interfaces/forum";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import { Socket } from "socket.io-client";
import ForumCard from "../../../common/components/forum/ForumCard";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import { BsInfoCircle } from "react-icons/bs";
import { Industry } from "../../../common/interfaces/industry";
import serviceApi from "../../../services/serviceApi";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetails";
import ChooseTile from "./choosetile";
import Bossoftheweekpopup from "../../popups/Bossoftheweekpopup";

interface Props {
  socket: Socket;
}
const CommunitiesPage = ({ socket }: Props) => {
  const tabs: string[] = ["", RoutesPath.learning, RoutesPath.opportunities];
  const location = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [industryErr, setIndustryErr] = useState<boolean>(false);
  const [forumErr, setForumErr] = useState<boolean>(false);
  const [forumLoading, setForumLoading] = useState<boolean>(false);
  const [industryLoading, setIndustryLoading] = useState<boolean>(false);
  const industries = useAppSelector((state) => state.forum.forums);
  const forums = useAppSelector((state) => state.forum.forums);
  const dispatch = useAppDispatch();

  const [industry, setIndustry] = useState<Industry | null>(null);
  const profile = useAppSelector((state) => state.user.profile);
  const popupRef = useRef<HTMLDivElement | null>(null); 
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const changeRoute = (index: number) => {
    setCurrentIndex(index);
    const tab: string = tabs[index].split("/").pop() ?? "";
    navigate(tab);
  };

  const initRoute = () => {
    const findCurrentRouteIndex = tabs.findIndex(
      (fd) =>
        fd === location.pathname.split("/communities").pop()?.toLowerCase()
    );
    if (findCurrentRouteIndex !== -1) {
      setCurrentIndex(findCurrentRouteIndex);
    } else {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleOutsideInteraction);
      document.addEventListener('touchstart', handleOutsideInteraction);
    } else {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, [isPopupOpen]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    initRoute();
  }, []);

  const joinIndustry = async () => {
    if (!!industry?.joinedUsers?.includes(profile!.uid)) {
      const newJoinedUsers = industry.joinedUsers.filter(
        (ft) => ft !== profile?.uid
      );
      setIndustry({ ...industry, joinedUsers: newJoinedUsers });
    } else {
      setIndustry({
        ...industry,
        joinedUsers: [...industry?.joinedUsers!, profile!.uid],
      });
    }
    await serviceApi.update(
      `/industry/join-leave-industry/${industry?.industryId}`
    );
  };

  const renderLastSectionContent = () => {
    if (currentIndex === 1) {
      return (
        <div>
          <div className="flex items-center mt-5 pb-2">
            <div className="flex items-center">
              <p className="text-lg font-semibold text-[#333333]">Learning</p>
            </div>
            <div className="flex items-center ml-auto gap-1">
              <p>Info</p>
              <BsInfoCircle />
            </div>
          </div>

          <div className="pb-2"></div>
          <Learning />
        </div>
      );
    } else if (currentIndex === 2) {
      return (
        <div>
          <div className="flex items-center mt-5 pb-2">
            <div className="flex items-center">
              <p className="text-lg font-semibold text-[#333333]">
                Opportunities
              </p>
            </div>
            <div className="flex items-center ml-auto gap-1">
              <p>Info</p>
              <BsInfoCircle />
            </div>
          </div>

          <div className="pb-2"></div>
          <Opportunities />
        </div>
      );
    } else {
      // Default content for other tabs (assuming Challenge tab is displayed by default)
      return (
        <div className=" ">
          <div className="flex items-center mt-5 pb-2">
            <div className="flex items-center">
              <p className="text-lg font-semibold text-[#333333]">
                Boss Up Challenge
              </p>
            </div>
            <div onClick={openPopup} className="flex items-center ml-auto gap-1">
              <p>About</p>
              <BsInfoCircle />
            </div>
          </div>
            <ForumCard
            onCreate={() => {
              navigate(RoutesPath.CreateBossup, {
                state: { industryId: industry?.industryId },
              });
            } }
            createLabel="Enter Challenge"
            banner={industry?.photo!}
            didJoin={!!industry?.joinedUsers?.includes(profile!.uid)}
            label={industry?.description ?? "Industry Description"}
            members={industry?.joinedUsers?.length ?? 0}
            onJoin={joinIndustry}
            topics={20} aboutontap={openPopup}          />
        </div>
      );
    }
  };

  const fetchCall = async () => {
    setForumErr(false);
    setIndustryErr(false);
    setForumLoading(true);
    setIndustryLoading(true);
    const data = await CommunitiesController.fetchData();
    if (data.forums.success) {
      dispatch(saveCount(data.forums.data.count));
      dispatch(incrementPage());
      dispatch(
        addForumsToState(
          data.forums.data.rows.map((mp: Forum) => ({
            ...mp,
            coins: mp.coins!.map((cn: any) => cn.userId),
            likes: mp.likes!.map((lk: any) => lk.userId),
          }))
        )
      );
    } else {
      setForumErr(true);
    }

    if (data.industries.success) {
      dispatch(saveIndustriesToState(data.industries.data.rows));
    } else {
      setIndustryErr(true);
    }

    setForumLoading(false);
    setIndustryLoading(false);
  };

  useEffect(() => {
    if (!!!forums.length) {
      fetchCall();
    }
  }, []);

  return (
    <div>
      <div className="mobile-only">
        <div
          className="bg-white top-0 w-full z-50"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            borderBottom: "1.2px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.02)",
          }}
        >
          <div
            className=" bg-white"
            style={{ position: "sticky", top: 0, zIndex: 100 }}
          >
            <div
              className="flex items-center px-4 justify-between bg-white"
              style={{ position: "sticky", top: 0, zIndex: 100 }}
            >
              <p className="text-lg font-semibold text-[#333333]">Boss Up</p>
              <CiSearch size={40} style={{ padding: 7 }} strokeWidth={0.5} />
            </div>

            <div className="">
              <Tabs
                onChangeRoute={(index: number) => changeRoute(index)}
                currentIndex={currentIndex}
              />
            </div>
          </div>
        </div>

        {forumLoading || industryLoading || !!!industries.length ? (
          <FetchStatus
            error={false}
            errorMessage="Something went wrong!!"
            loading={true}
            onReload={fetchCall}
          />
        ) : forumErr || industryErr ? (
          <FetchStatus
            error={true}
            errorMessage="Something went wrong!!"
            loading={false}
            onReload={fetchCall}
          />
        ) : (
          <div className="">
            <Routes>
              <Route
                index
                element={<Challenge socket={socket} forums={forums} />}
              />
              <Route path={RoutesPath.learning} element={<Learning />} />
              <Route
                path={RoutesPath.opportunities}
                element={<Opportunities />}
              />
            </Routes>
          </div>
        )}
        <div className="my-20"></div>
        <MobileBottomNav currentIndex={1} />
      </div>

      <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5 pl-0"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profile!} />
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "40%", flexGrow: 0 }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: "#fff",
                borderBottom: "1.2px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <Tabs
                onChangeRoute={(index: number) => changeRoute(index)}
                currentIndex={currentIndex}
              />
            </div>
            {currentIndex === 0 ? (
              <Challenge socket={socket} forums={forums} />
            ) : currentIndex === 1 ? (
              <ChooseTile />
            ) : (
              <ChooseTile />
            )}

            {currentIndex === 0 ? (
              <div className="">
                {forumLoading || industryLoading || !!!industries.length ? (
                  <FetchStatus
                    error={false}
                    errorMessage="Something went wrong!!"
                    loading={true}
                    onReload={fetchCall}
                  />
                ) : forumErr || industryErr ? (
                  <FetchStatus
                    error={true}
                    errorMessage="Something went wrong!!"
                    loading={false}
                    onReload={fetchCall}
                  />
                ) : (
                  <Challenge socket={socket} forums={forums} />
                )}
              </div>
            ) : currentIndex === 1 ? (
              <ChooseTile />
            ) : (
              <ChooseTile />
            )}
          </div>

          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection ml-5 mr-5 mb-40 lg:mr-20 pr-0"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "auto",
              position: "sticky",
              top: 0,
              zIndex: 1,
              height: "100vh",
              scrollbarWidth: "none",
            }}
          >
            {renderLastSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitiesPage;
