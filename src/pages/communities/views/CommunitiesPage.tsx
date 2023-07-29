import { CiSearch } from "react-icons/ci";
import MobileBottomNav from "../../home/views/components/MobileBottomNav";
import { useEffect, useState } from "react";
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
    initRoute();
  }, []);


  const renderLastSectionContent = () => {
    if (currentIndex === 1) {
      return (
        <div>
          <div className="pb-5">
            {/* <ForumCard
              banner="https://cdn.pixabay.com/photo/2023/05/28/09/24/south-tyrol-8023224__340.jpg"
              didJoin={false}
              label="Ideas on how to create things easily"
              members={20}
              onJoin={() => { } }
              topics={20} createLabel={""} onCreate={undefined}            /> */}
          </div>
          <Learning />
        </div>
      );
    } else if (currentIndex === 2) {
      return (
        <div>
          <div className="pb-5">
            {/* <ForumCard
              banner="https://cdn.pixabay.com/photo/2023/05/28/09/24/south-tyrol-8023224__340.jpg"
              didJoin={false}
              label="Ideas on how to create things easily"
              members={20}
              onJoin={() => { }}
              topics={20}
            /> */}
          </div>
          <Opportunities />
        </div>
      );
    } else {
      // Default content for other tabs (assuming Challenge tab is displayed by default)
      return (
        <div className=" ">

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
        <div className="fixed top-0 left-0 w-screen h-screen z-50">
          <div className="fixed top-0 left-0 w-full bg-white shadow-lg">
            <div className="flex items-center px-5 justify-between bg-white">
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
          <div className="" style={{paddingTop:70}}>
          <Routes>
            <Route
              index
              element={<Challenge socket={socket} forums={forums} />}
            />
            <Route path={RoutesPath.learning} element={<Learning />} />
            <Route path={RoutesPath.opportunities} element={<Opportunities />} />
          </Routes>
          </div>
        )}
        <div className="my-20"></div>
        <MobileBottomNav currentIndex={1} />
      </div>

      <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div className="firstsection ml-5 lg:ml-20 mr-5 pl-0" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,

          }}>
            <div className="" >
              <div className=" flex items-center gap-3">
                {/* <ComputerProfileDetails data={profile.profile!} /> */}
              </div>

            </div>
          </div>
          <div style={{ borderLeft: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="computer-main-content" style={{ paddingTop: 80, width: '40%', flexGrow: 0 }} >
            <div>
              <div className="sticky top-100 mt-5">
                <Tabs
                  onChangeRoute={(index: number) => changeRoute(index)}
                  currentIndex={currentIndex}
                />
              </div>
            </div>
            <Challenge socket={socket} forums={forums} />


          </div>
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection ml-5 mr-5 mb-40 lg:mr-20 pr-0" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            paddingTop: 65,
          }}>
            {renderLastSectionContent()}

          </div>




        </div>
      </div>

    </div>




  );
};

export default CommunitiesPage;
