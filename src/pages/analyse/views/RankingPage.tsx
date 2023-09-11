import React, { ReactNode } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import Popup from "reactjs-popup";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { useAppSelector } from "../../../redux/store/store";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import Analyserows from "./components/analyserows";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";

const RankingPage = () => {
    const navigate = useNavigate();
    const profile = useAppSelector((state) => state.user);
    return (
        <div>
            <div className="mobile-only">
                <div className=" top-0 w-full z-50 " style={{ position: 'sticky', top: 0, zIndex: 100, }}>

                    <CommonPageHeader title="Ranking" />
                </div>


                <div className=" bg-white" style={{ borderTop: '15px solid rgba(244, 244, 244, 1)' }}>
                    <div className="flex p-5 gap-4">
                        <div className="flex-grow rounded-xl bg-[#f1f1f1] p-5">
                            <div className="text-center text-sm">Monthly Ranking</div>
                            <div className="flex items-center gap-3 pt-5 justify-center">
                                <div className="text-sm font-bold">Top</div>
                                <div className="w-20 h-20 rounded-full text-center border border-[#ffffff]" style={{ borderWidth: "10px", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
                                    50%
                                </div>

                            </div>
                        </div>
                        <div className="flex-grow rounded-xl bg-white border border-[#f1f1f1] p-5">
                            <div className="text-center text-sm">Monthly Ranking</div>
                            <div className="flex items-center gap-3 pt-5 justify-center">
                                <div className="text-sm font-bold">Top</div>
                                <div className="w-20 h-20 rounded-full text-center border border-[#f1f1f1]" style={{ borderWidth: "10px", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
                                    50%
                                </div>



                            </div>
                        </div>
                    </div>

                    <div className="ml-5 font-bold text-sm">Your ranking is based on:</div>
                    <div className="ml-5 mt-2 text-sm">Inviting friends to join Business Bosses</div>
                    <img src={Assets.One} />
                    <div className="ml-5 text-sm" >Networking and making new connections</div>
                    <img src={Assets.Two} />
                    <div className="ml-5 text-sm">Creating post/content in your profile and community</div>
                    <img src={Assets.Four} />
                    <div className="ml-5 text-sm">Commenting and liking users post/content</div>
                    <img src={Assets.Three} />
                    <div className="ml-5 text-sm">Refer users to your connection </div>
                    <img src={Assets.Five} />
                    <div className="ml-5 text-sm mt-10 pb-10">
                        <span style={{ fontWeight: "bold" }}>Tips:</span> The higher your ranking, the easier to be discovered by the other users
                    </div>
                </div>





            </div>

            <div className="computer-only bg-[#fff]">
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
                    ><div className="">
              
                            <CommonPageHeader title="Ranking" />


                            <div className=" bg-white" style={{  }}>
                                <div className="flex p-5 gap-4">
                                    <div className="flex-grow rounded-xl bg-[#f1f1f1] p-5">
                                        <div className="text-center text-sm lg:text-base">Monthly Ranking</div>
                                        <div className="flex items-center gap-3 pt-5 justify-center">
                                            <div className="text-sm font-bold lg:text-base">Top</div>
                                            <div className="w-20 h-20 rounded-full text-center border border-[#ffffff]" style={{ borderWidth: "10px", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
                                                50%
                                            </div>

                                        </div>
                                    </div>
                                    <div className="flex-grow rounded-xl bg-white border border-[#f1f1f1] p-5">
                                        <div className="text-center text-sm lg:text-base">Monthly Ranking</div>
                                        <div className="flex items-center gap-3 pt-5 justify-center">
                                            <div className="text-sm font-bold lg:text-base">Top</div>
                                            <div className="w-20 h-20 rounded-full text-center border border-[#f1f1f1]" style={{ borderWidth: "10px", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
                                                50%
                                            </div>



                                        </div>
                                    </div>
                                </div>

                                <div className="ml-5 font-bold text-sm lg:text-base lg:pt-8">Your ranking is based on:</div>
                                <div className="ml-5 mt-2 text-sm lg:text-base">Inviting friends to join Business Bosses</div>
                                <img src={Assets.One} />
                                <div className="ml-5 text-sm lg:text-base" >Networking and making new connections</div>
                                <img src={Assets.Two} />
                                <div className="ml-5 text-sm lg:text-base">Creating post/content in your profile and community</div>
                                <img src={Assets.Four} />
                                <div className="ml-5 text-sm lg:text-base">Commenting and liking users post/content</div>
                                <img src={Assets.Three} />
                                <div className="ml-5 text-sm lg:text-base">Refer users to your connection</div>
                                <img src={Assets.Five} />
                                <div className="ml-5 text-sm mt-10 pb-10">
                                    <span style={{ fontWeight: "bold" }}>Tips:</span> The higher your ranking, the easier to be discovered by the other users
                                </div>
                            </div>
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

export default RankingPage;


