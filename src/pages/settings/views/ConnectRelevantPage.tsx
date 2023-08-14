import React, { ReactNode } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import FilledButton from "../../../common/components/buttons/FilledButton";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { useAppSelector } from "../../../redux/store/store";
import { toast } from "react-toastify";
import RoutesPath from "../../../constants/Routes";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";
import { useNavigate } from "react-router-dom";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import { MdContentCopy, MdShare } from "react-icons/md";
import SubscribeButton from "../../settings/components/Subscribebutton";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetails";
import ConnectRelevant from "./ConnectRelevant";



const ConnectRelevantPage = () => {
    const profile = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    return (
        <div>

            <div className="computer-only">
                <ComputerHeader />
                <div className="computer-content">
                    <div
                        className="firstsection ml-5 mr-5 lg:ml-20"
                        style={{
                            width: "30%",

                            flexGrow: 0,
                            overflow: "none",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            height: "100%",
                        }}
                    >
                        <div className="">
                            <div className=" flex items-center gap-3">
                                <ComputerProfileDetails data={profile.profile!} />
                            </div>
                        </div>

                    </div>
                    <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
                    <div
                        className="computer-main-content"
                        style={{ width: "40%", flexGrow: 0 }}
                    >
                        <CommonPageHeader title={"Connect"} />
                        <ConnectRelevant />


                    </div>
                    <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
                    <div
                        className="lastsection ml-5 mr-5 mt-5 mb-0 lg:mr-20"
                        style={{
                            width: "30%",
                            flexGrow: 0,
                            overflow: "none",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                        }}
                    >

                        <div className="rounded-xl overflow-hidden" style={{}}>
                            {profile.bossup ? (
                                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} />
                            ) : null}
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default ConnectRelevantPage;
