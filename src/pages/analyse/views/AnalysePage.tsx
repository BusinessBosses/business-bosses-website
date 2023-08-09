import React, { ReactNode } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import Popup from "reactjs-popup";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { useAppSelector } from "../../../redux/store/store";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import Analyserows from "./components/analyserows";
import SubscribeButton from "../../settings/components/Subscribebutton";

const AnalysePage = () => {
    const navigate = useNavigate();
    const profile = useAppSelector((state) => state.user);
    return (
        <div>
            <div className=" top-0 w-full z-50 " style={{ position: 'sticky', top: 0, zIndex: 999, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>

                <CommonPageHeader title="Analyse" />
            </div>


            <div className=" pt-10 bg-white" style={{ height: "100vh" }}>

                <div className="flex justify-between items-center mx-5">
                    <div className="text-lg font-bold">Hi</div>
                    <SubscribeButton />
                </div>

                <div className="ml-5 font-bold text-primary text-lg">@{profile.profile?.username}</div>
                <div className="ml-5 mb-10">how may I help you?</div>

                <Analyserows leadingSvg={<Assets.Analyse />} middleText={"Analyse my Profile"} endingSvg={<Assets.Nexticon />} onClick={() => { navigate(RoutesPath.analyseprofilepage) }} />
                <Analyserows leadingSvg={<Assets.Connectrelevant />} middleText={"Connect me to relevant people"} endingSvg={<Assets.Nexticon />} onClick={() => { navigate(RoutesPath.connectrelevant) }} />
                <Analyserows leadingSvg={<Assets.Ranking />} middleText={"Show my ranking"} endingSvg={<Assets.Nexticon />} onClick={() => { navigate(RoutesPath.rankingpage) }} />
                <Analyserows leadingSvg={<Assets.Explore />} middleText={"Explore Business Bosses"} endingSvg={<Assets.Nexticon />} onClick={() => { navigate(RoutesPath.explorebusinessbosses) }} />

                <Analyserows leadingSvg={undefined} middleText={""} endingSvg={undefined} />



            </div>


        </div>
    );
};

export default AnalysePage;


