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

const CommunitiesPage = () => {
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
      <div className="fixed top-0 w-full z-50">
        <div className="flex items-center p-5 justify-between bg-white">
          <p className="text-lg">Boss Up</p>
          <CiSearch size={20} />
        </div>
      </div>
      <Tabs
        onChangeRoute={(index: number) => changeRoute(index)}
        currentIndex={currentIndex}
      />

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
        <Routes>
          <Route index element={<Challenge forums={forums} />} />
          <Route path={RoutesPath.learning} element={<Learning />} />
          <Route path={RoutesPath.opportunities} element={<Opportunities />} />
        </Routes>
      )}
      <div className="my-20"></div>
      <MobileBottomNav currentIndex={1} />
    </div>
  );
};

export default CommunitiesPage;
