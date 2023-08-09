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

const RankingPage = () => {
    const navigate = useNavigate();
    const profile = useAppSelector((state) => state.user);
    return (
        <div>
            <div className=" top-0 w-full z-50 " style={{ position: 'sticky', top: 0, zIndex: 999, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>

                <CommonPageHeader title="Ranking" />
            </div>


            <div className=" pt-10 bg-white" style={{  }}>
                <div className="flex">

                </div>
                <div className="ml-5 font-bold">Your ranking is based on:</div>
                <div className="ml-5 mt-10">Inviting friends to join Business Bosses</div>
                <img src={Assets.One} />
                <div className="ml-5">Networking and making new connections</div>
                <img src={Assets.Two} />
                <div className="ml-5">Commenting and liking users post/content</div>
                <img src={Assets.Three} />
                <div className="ml-5">Creating post/content in your profile and community</div>
                <img src={Assets.Four} />
                <div className="ml-5">Refer users to your connection</div>
                <img src={Assets.Five} />
                <div className="ml-5 mt-10 pb-10">Tips: The higher your ranking, the easier to be discovered by the other users</div>





            </div>


        </div>
    );
};

export default RankingPage;


