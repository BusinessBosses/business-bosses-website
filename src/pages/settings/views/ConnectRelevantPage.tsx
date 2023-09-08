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
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import ConnectRelevant from "./ConnectRelevant";
import ComputerProfileDetailsonly from "../../profile/views/components/ComputerProfiledetailsonly";



const ConnectRelevantPage = () => {
    const profile = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    return (
        <div>
            <div className="computer-only">
                <ComputerHeader />

                <div className="computer-content">
                    <div
                        className="firstsection ml-5 lg:ml-20 pr-5"
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
                                <ComputerProfileDetailsonly data={profile.profile!} />
                            </div>
                        </div>
                    </div>
                    <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
                    <div
                        className="computer-main-content"
                        style={{ width: "40%", flexGrow: 0 }}
                    >

                        <div className=" top-0 w-full z-50" style={{ position: 'sticky', top: 0, zIndex: 100, }}>

                            <CommonPageHeader title="Connect" />
                        </div>


                        <div className=" pt-0 bg-white" style={{ height: "100vh",  }}>
                            <div className="mx-5"><ConnectRelevant /></div>

                           


                        </div>

                    </div>
                    <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
                    <div
                        className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
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
