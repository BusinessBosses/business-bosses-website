import { useState } from "react";
import CommonPageHeader from "../../common/components/headers/CommonPageHeader";
import FilledButton from "../../common/components/buttons/FilledButton";
import PublicProfileDetails from "../profile/views/components/PublicProfileDetails";
import PublicProfileDetailsonly from "../profile/views/components/PublicProfileDetailsonly";
import Rating from "@mui/material/Rating/Rating";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import PostItem from "../home/views/components/PostItem";
import SellerreviewItem from "./components/SellerreviewItem";
import MobileBossOfTheWeek from "../home/views/components/BossOfTheWeek";
import { useAppSelector } from "../../redux/store/store";
import ComputerHeader from "../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../profile/views/components/ComputerProfiledetails";



const SellerReview = () => {
    const profile = useAppSelector((state) => state.user);
    return (
        <div>
            <div className="mobile-only" >
                <CommonPageHeader title={"Seller Reviews"} />
                <div className="bg-white" style={{ borderTop: "15px solid rgba(244, 244, 244, 1)", height: "100vh" }}>
                    <div className="flex justify-center">
                        {/* <PublicProfileDetailsonly data={undefined} /> */}

                        <FilledButton className="justify-center" onClick={() => { }} text={"Rate Seller"} />

                    </div>
                    <div className="rounded-xl bg-[#f4f4f4] flex p-5 m-5 gap-8">
                        <div>
                            <div className="text-primary font-bold">Rating</div>
                            <div className="text-sm font-bold"><span style={{ fontWeight: "bold", fontSize: "20px" }}>3.4</span> out of 5</div>
                            <div className="text-sm">Based on <span>12</span> reviews</div>
                            <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly size="large" />




                        </div>

                        <div className=" text-sm">
                            <div className="flex">
                                <div>5 stars</div>
                                <LinearProgress
                                    className="charProgress"
                                    variant="determinate"
                                    value={3}
                                />

                            </div>
                            <div className="flex">
                                <div>4 stars</div>
                                <LinearProgress
                                    className="charProgress"
                                    variant="determinate"
                                    value={3}
                                />

                            </div>
                            <div className="flex">
                                <div>3 stars</div>
                                <LinearProgress
                                    className="charProgress"
                                    variant="determinate"
                                    value={3}
                                />

                            </div>
                            <div className="flex">
                                <div>2 stars</div>
                                <LinearProgress
                                    className="charProgress"
                                    variant="determinate"
                                    value={3}
                                />

                            </div>
                            <div className="flex">
                                <div>1 star</div>
                                <LinearProgress
                                    className="charProgress"
                                    variant="determinate"
                                    value={3}
                                />

                            </div>
                        </div>

                    </div>
                    {/* {[1, 2, 3, 4, 5, 6, 7, 8].map((post) => (
                    <SellerreviewItem data={undefined} />
                ))} */}

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

export default SellerReview;
