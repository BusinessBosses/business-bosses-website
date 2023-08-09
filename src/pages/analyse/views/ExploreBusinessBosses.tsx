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

const ExploreBusinessBosses = () => {
    const navigate = useNavigate();
    const profile = useAppSelector((state) => state.user);
    return (
        <div>
            <div className=" top-0 w-full z-50 " style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>

                <CommonPageHeader title="Explore Business Bosses" />
            </div>


            <div className=" p-5 mx-5 bg-white rounded-xl" style={{ height: "100vh" }}>
                <div>Text comes here</div>

               

            </div>


        </div>
    );
};

export default ExploreBusinessBosses;


