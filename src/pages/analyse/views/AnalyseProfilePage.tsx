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
import { User } from "../../../common/interfaces/user";

interface Props {
    data: User;
  }

const AnalyseProfilePage = () => {
    const navigate = useNavigate();
    const profile = useAppSelector((state) => state.user);
    return (
        <div>
            <div className=" top-0 w-full z-50 " style={{ position: 'sticky', top: 0, zIndex: 999, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>

                <CommonPageHeader title="Analyse Profile" />
            </div>


            <div className=" pt-10 bg-white px-5" style={{ height: "100vh" }}>

                <div className="text-center font-bold text-lg">Network</div>

                <div className="font-bold pt-5">Weekly</div>

                <div className="flex items-center justify-between my-5 mx-10">
                    <button
                        onClick={() =>
                           {}
                        }
                        className="text-center"
                    >
                        <p>{0}</p>
                        <p className="text-xs font-semibold text-[#A9A9A9]">Connection</p>
                    </button>
                    <button
                        onClick={() =>{}
                           
                        }
                        className="text-center"
                    >
                        <p>{0}</p>
                        <p className="text-xs font-semibold text-[#A9A9A9]">Connected</p>
                    </button>
                    <button
                        onClick={() =>{}
                           
                        }
                        className="text-center"
                    >
                        <p>{0}</p>
                        <p className="text-xs font-semibold text-[#A9A9A9]">Disconnected</p>
                    </button>
                </div>



                <div className="font-bold pt-5">Monthly</div>

                <div className="flex items-center justify-between my-5 mx-10">
                    <button
                        onClick={() =>
                           {}
                        }
                        className="text-center"
                    >
                        <p>{0}</p>
                        <p className="text-xs font-semibold text-[#A9A9A9]">Connection</p>
                    </button>
                    <button
                        onClick={() =>{}
                           
                        }
                        className="text-center"
                    >
                        <p>{0}</p>
                        <p className="text-xs font-semibold text-[#A9A9A9]">Connected</p>
                    </button>
                    <button
                        onClick={() =>{}
                           
                        }
                        className="text-center"
                    >
                        <p>{0}</p>
                        <p className="text-xs font-semibold text-[#A9A9A9]">Disconnected</p>
                    </button>
                </div>

                <div className="text-center pt-5 text-xl">Monthly Profile Analysis</div>






            </div>

        


        </div>
    );
};

export default AnalyseProfilePage;


