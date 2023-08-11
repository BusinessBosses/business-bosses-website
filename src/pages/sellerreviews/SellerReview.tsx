import { useState } from "react";
import CommonPageHeader from "../../common/components/headers/CommonPageHeader";
import FilledButton from "../../common/components/buttons/FilledButton";
import PublicProfileDetails from "../profile/views/components/PublicProfileDetails";
import PublicProfileDetailsonly from "../profile/views/components/PublicProfileDetailsonly";
import Rating from "@mui/material/Rating/Rating";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import PostItem from "../home/views/components/PostItem";
import SellerreviewItem from "./components/SellerreviewItem";



const SellerReview = () => {
    return (
        <div className="" >
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
                {[1, 2, 3, 4, 5, 6, 7, 8].map((post) => (
                    <SellerreviewItem data={undefined} />
                ))}

            </div>




        </div>
    );
};

export default SellerReview;
