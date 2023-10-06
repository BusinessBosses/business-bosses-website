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
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import ChooseTile from "./choosetile";
import Bossoftheweekpopup from "../../popups/Bossoftheweekpopup";
import Assets from "../../../assets";
import Learningpopup from "../../popups/Learningpopup";
import Opportunitiespopup from "../../popups/Opportunitiespopup";
import AppConstants from "../../../constants/consts";
import ComputerBossuppartnersection from "../../bossuppartnerpage/computerbossupsection";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import Computerlefttabsignedoutuser from "../../profile/views/components/Computerlefttabsignedoutuser";

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
  const appIndustries = useAppSelector((state) => state.industry.industries);
  const forums = useAppSelector((state) => state.forum.forums);
  const topicsLength: number = useAppSelector((state) => state.forum.count);
  const dispatch = useAppDispatch();
  const currentRoute = location.pathname;
  const profilee = useAppSelector((state) => state.user);

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
      document.addEventListener("mousedown", handleOutsideInteraction);
      document.addEventListener("touchstart", handleOutsideInteraction);
    } else {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
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
    const filteredIndustries = CommunitiesController.getIndustriesByCategory(
      appIndustries,
      AppConstants.BOSS_UP_CHALLENGE_CATEGORY_ID
    );
    if (!!filteredIndustries.length) {
      setIndustry(filteredIndustries[0]);
    }
  }, [location, appIndustries]);

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
              <p className="text-base font-semibold text-[#333333]">Learning</p>
            </div>
            <div
              className="flex items-center ml-auto gap-1"
              onClick={openPopup}
            >
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
              <p className="text-base font-semibold text-[#333333]">
                Opportunities
              </p>
            </div>
            <div
              className="flex items-center ml-auto gap-1"
              onClick={openPopup}
            >
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
              <p className="text-base font-semibold text-[#333333]">
                Boss Up Challenge
              </p>
            </div>
            <div
              onClick={openPopup}
              className="flex items-center ml-auto gap-1"
            >
              <p className=" text-base">About</p>
              <BsInfoCircle />
            </div>
          </div>
          <div className="rounded-3xl bg-[#f4f4f4] p-3">
            <ForumCard
              onCreate={() => {
                navigate(RoutesPath.CreateBossup, {
                  state: { industryId: industry?.industryId },
                });
              }}
              createLabel="Enter Challenge"
              banner={industry?.photo!}
              didJoin={!!industry?.joinedUsers?.includes(profile!.uid)}
              label={industry?.description ?? "Industry Description"}
              members={industry?.joinedUsers?.length ?? 0}
              onJoin={joinIndustry}
              topics={topicsLength}
              aboutontap={openPopup}
              aboutontaptext={"About"}
              topicsicon={<Assets.Entries width={15} />}
              topicstext={"Entries"}
            />
          </div>
          <div className="mt-5"><ComputerBossuppartnersection /></div>
        </div>
      );
    }
  };

  const handleButtonClick = () => {
    const confirmMessage = 'You need to sign in or create an account to be able to use this feature';
    if (window.confirm(confirmMessage)) {
      navigate(RoutesPath.login)
    } else {

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
              <button
                onClick={() => {
                  navigate(RoutesPath.communitiesSearch);
                }}
              >
                <CiSearch size={40} style={{ padding: 7 }} strokeWidth={0.5} />
              </button>
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
        <div className="computer-only">
          {isPopupOpen && (
            <div className="overlay">
              <div
                ref={popupRef}
                className="computerpopup"
              >
                {currentRoute === "/communities" ? (
                  <Bossoftheweekpopup />
                ) : currentRoute === "/communities/learning" ? (
                  <Learningpopup />
                ) : (
                  <Opportunitiespopup />
                )}
              </div>
            </div>
          )}
        </div>
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
                {profilee.profile?.email != `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                  <ComputerProfileDetails data={profilee.profile!} /> : <Computerlefttabsignedoutuser data={profilee.profile!} />}
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
              <div className="px-5">{renderLastSectionContent()}</div>
            ) : (
              <div className="px-5">{renderLastSectionContent()}</div>
            )}
          </div>

          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "auto",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="rounded-xl overflow-hidden" style={{}}>{
              currentIndex === 0 ?

                <div>
                  <div className=" ">
                    <div className="" onClick={profile?.email == `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                      handleButtonClick : () => { }}>
                      <div className="flex items-center pb-2">
                        <div className="flex items-center">
                          <p className="text-base font-semibold text-[#333333]">
                            Boss Up Challenge
                          </p>
                        </div>
                        <div
                          onClick={openPopup}
                          className="flex items-center ml-auto gap-1"
                        >
                          <p className=" text-base">About</p>
                          <BsInfoCircle />
                        </div>
                      </div>
                      <div className="rounded-3xl bg-[#f4f4f4] p-3">
                        <ForumCard
                          onCreate={() => {
                            navigate(RoutesPath.CreateBossup, {
                              state: { industryId: industry?.industryId },
                            });
                          }}
                          createLabel="Enter Challenge"
                          banner={industry?.photo!}
                          didJoin={!!industry?.joinedUsers?.includes(profile!.uid)}
                          label={industry?.description ?? "Industry Description"}
                          members={industry?.joinedUsers?.length ?? 0}
                          onJoin={joinIndustry}
                          topics={topicsLength}
                          aboutontap={openPopup}
                          aboutontaptext={"About"}
                          topicsicon={<Assets.Entries width={15} />}
                          topicstext={"Entries"}
                        />
                      </div>
                    </div>
                    <div className="font-bold mt-8">Our Partners</div>
                    <div className="mt-3"><ComputerBossuppartnersection /></div>

                  </div>
                </div> :


                <MobileBossOfTheWeek bossOfTheWeek={profilee.bossup!} />
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitiesPage;
