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
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetails";

interface Props {
    data: User;
}

const AnalyseProfilePage = () => {
    const navigate = useNavigate();
    const profile = useAppSelector((state) => state.user);
    return (
        <div>

            <div className="mobile-only">
                <div className=" top-0 w-full z-50 " style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>

                    <CommonPageHeader title="Analyse Profile" />
                </div>


                <div className=" pt-5 bg-white px-5" style={{ height: "100vh" }}>

                    <div className="text-center font-bold text-lg">Network</div>

                    <div className="font-bold pt-5 text-sm">Weekly</div>

                    <div className="flex items-center justify-between my-5 mx-10">
                        <button
                            onClick={() => { }
                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Connection</p>
                        </button>
                        <button
                            onClick={() => { }

                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Connected</p>
                        </button>
                        <button
                            onClick={() => { }

                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Disconnected</p>
                        </button>
                    </div>



                    <div className="font-bold pt-5 text-sm">Monthly</div>

                    <div className="flex items-center justify-between my-5 mx-10">
                        <button
                            onClick={() => { }
                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Connection</p>
                        </button>
                        <button
                            onClick={() => { }

                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Connected</p>
                        </button>
                        <button
                            onClick={() => { }

                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Disconnected</p>
                        </button>
                    </div>

                    <div className="text-center pt-5 text-lg">Monthly Profile Analysis</div>


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
                    >
                        <div className="computer-only">
        

                    <CommonPageHeader title="Analyse Profile" />
          


                <div className=" pt-5 bg-white px-5" style={{ height: "100vh" }}>

                    <div className="text-center font-bold text-lg">Network</div>

                    <div className="font-bold pt-5 text-base">Weekly</div>

                    <div className="flex items-center justify-between my-5 mx-10">
                        <button
                            onClick={() => { }
                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Connection</p>
                        </button>
                        <button
                            onClick={() => { }

                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Connected</p>
                        </button>
                        <button
                            onClick={() => { }

                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Disconnected</p>
                        </button>
                    </div>



                    <div className="font-bold pt-5 text-base">Monthly</div>

                    <div className="flex items-center justify-between my-5 mx-10">
                        <button
                            onClick={() => { }
                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Connection</p>
                        </button>
                        <button
                            onClick={() => { }

                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Connected</p>
                        </button>
                        <button
                            onClick={() => { }

                            }
                            className="text-center"
                        >
                            <p>{0}</p>
                            <p className="text-xs font-semibold text-[#A9A9A9]">Disconnected</p>
                        </button>
                    </div>

                    <div className="text-center pt-5 text-lg">Monthly Profile Analysis</div>


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

export default AnalyseProfilePage;


