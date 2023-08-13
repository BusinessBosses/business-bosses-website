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
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetails";

const AnalysePage = () => {
    const navigate = useNavigate();
    const profile = useAppSelector((state) => state.user);
    return (
        <div>
            <div className=" top-0 w-full z-50 mobile-only" style={{ position: 'sticky', top: 0, zIndex: 100, }}>

                <CommonPageHeader title="Analyse" />
            </div>


            <div className=" pt-10 bg-white mobile-only" style={{ height: "100vh", borderTop: '15px solid rgba(244, 244, 244, 1)' }}>

                <div className="flex justify-between items-center mx-5">
                    <div className="text-lg font-bold">Hi</div>
                    <SubscribeButton />
                </div>

                <div className="ml-5 font-bold text-primary text-md">@{profile.profile?.username}</div>
                <div className="ml-5 mb-10 text-xs">how may I help you?</div>

                <Analyserows leadingSvg={<Assets.Analyse />} middleText={"Analyse my Profile"} endingSvg={<Assets.Nexticon stroke="#F21C29" />} onClick={() => { navigate(RoutesPath.analyseprofilepage) }} />
                <Analyserows leadingSvg={<Assets.Connectrelevant />} middleText={"Connect me to relevant people"} endingSvg={<Assets.Nexticon stroke="#F21C29" />} onClick={() => { navigate(RoutesPath.connectrelevant) }} />
                <Analyserows leadingSvg={<Assets.Ranking />} middleText={"Show my ranking"} endingSvg={<Assets.Nexticon stroke="#F21C29" />} onClick={() => { navigate(RoutesPath.rankingpage) }} />
                <Analyserows leadingSvg={<Assets.Explore />} middleText={"Explore Business Bosses"} endingSvg={<Assets.Nexticon stroke="#F21C29" />} onClick={() => { navigate(RoutesPath.explorebusinessbosses) }} />

                <Analyserows leadingSvg={undefined} middleText={""} endingSvg={undefined} />



            </div>



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
                                <ComputerProfileDetails data={profile.profile!} />
                            </div>
                        </div>
                    </div>
                    <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
                    <div
                        className="computer-main-content"
                        style={{ width: "40%", flexGrow: 0 }}
                    >

                        <div className=" top-0 w-full z-50" style={{ position: 'sticky', top: 0, zIndex: 100, }}>

                            <CommonPageHeader title="Analyse" />
                        </div>


                        <div className=" pt-10 bg-white" style={{ height: "100vh",  }}>

                            <div className="flex justify-between items-center mx-5">
                                <div className="text-lg font-bold">Hi</div>
                                <SubscribeButton />
                            </div>

                            <div className="ml-5 font-bold text-primary text-lg">@{profile.profile?.username}</div>
                            <div className="ml-5 mb-10 text-base">how may I help you?</div>

                            <Analyserows leadingSvg={<Assets.Analyse />} middleText={"Analyse my Profile"} endingSvg={<Assets.Nexticon stroke="#F21C29" />} onClick={() => { navigate(RoutesPath.analyseprofilepage) }} />
                            <Analyserows leadingSvg={<Assets.Connectrelevant />} middleText={"Connect me to relevant people"} endingSvg={<Assets.Nexticon stroke="#F21C29" />} onClick={() => { navigate(RoutesPath.connectrelevantpage) }} />
                            <Analyserows leadingSvg={<Assets.Ranking />} middleText={"Show my ranking"} endingSvg={<Assets.Nexticon stroke="#F21C29" />} onClick={() => { navigate(RoutesPath.rankingpage) }} />
                            <Analyserows leadingSvg={<Assets.Explore />} middleText={"Explore Business Bosses"} endingSvg={<Assets.Nexticon stroke="#F21C29" />} onClick={() => { navigate(RoutesPath.explorebusinessbosses) }} />

                            <Analyserows leadingSvg={undefined} middleText={""} endingSvg={undefined} />



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

export default AnalysePage;


