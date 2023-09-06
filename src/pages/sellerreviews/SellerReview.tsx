import { useRef, useState } from "react";
import CommonPageHeader from "../../common/components/headers/CommonPageHeader";
import FilledButton from "../../common/components/buttons/FilledButton";
import PublicProfileDetails from "../profile/views/components/PublicProfileDetails";
import PublicProfileDetailsonly from "../profile/views/components/PublicProfileDetailsonly";
import Rating from "@mui/material/Rating/Rating";
import PostItem from "../home/views/components/PostItem";
import SellerreviewItem from "./components/SellerreviewItem";
import MobileBossOfTheWeek from "../home/views/components/BossOfTheWeek";
import { useAppSelector } from "../../redux/store/store";
import ComputerHeader from "../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../profile/views/components/ComputerProfiledetails";
import { BottomSheet } from "react-spring-bottom-sheet";
import FilledTextarea from "../../common/components/inputs/FilledTextarea";
import FilledButtonsmall from "../../common/components/buttons/FilledButtonsmall";
import { ProgressBar } from "react-toastify/dist/components";
import Ratingbar from "./components/Ratingbar";



const SellerReview = () => {
    const profile = useAppSelector((state) => state.user);
    const [open, setOpen] = useState<boolean>(false);
    const reviewInputRef = useRef<HTMLTextAreaElement>(null);
    return (
        <div>
            <div className="mobile-only" >
                <div className=" top-0 w-full z-50 mobile-only " style={{ position: 'sticky', top: 0, zIndex: 100, }}>

                    <CommonPageHeader title="Seller Reviews" />
                </div>
                <div className="bg-white" style={{ borderTop: "15px solid rgba(244, 244, 244, 1)", height: "100vh" }}>
                    <div className="flex-row justify-center">
                        <div className="pt-5"><PublicProfileDetailsonly data={profile.profile!} /></div>

                        <div className="flex justify-center pt-5">
                            <FilledButtonsmall
                                className="py-3 px-8"
                                onClick={() => { setOpen(true) }}
                                text={"Rate Seller"}
                            />
                        </div>

                        <BottomSheet
                            scrollLocking={true}
                            onDismiss={() => setOpen(false)}
                            maxHeight={1000}
                            open={open}
                            footer={
                                <div className="flex justify-center">
                                    <FilledButton onClick={() => { }} text={"Rate"} />
                                </div>
                            }
                        >
                            <div className="h-[50vh] overflow-y-auto">
                                <div className="font-bold  p-5">Rate Seller</div>
                                <div className="bg-[#f4f4f4] mx-5 p-5 rounded-xl flex justify-center">
                                    <Rating name="half-rating-read" defaultValue={0.0} precision={0.5} readOnly size="large" />
                                </div>
                                <div className="px-5">
                                    <FilledTextarea
                                        placeholder={"Write your Review here"}
                                        inputRef={reviewInputRef}
                                        onchange={() => { }}
                                        label=""
                                    />
                                </div>
                            </div>
                        </BottomSheet>
                    </div>

                    <div className="rounded-xl bg-[#f4f4f4] flex p-5 m-5 gap-8">
                        <div>
                            <div className="text-primary font-bold">Rating</div>
                            <div className="text-sm font-bold"><span style={{ fontWeight: "bold", fontSize: "20px" }}>3.4</span> out of 5</div>
                            <div className="text-sm">Based on <span>12</span> reviews</div>
                            <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly size="large" />




                        </div>

                        <div className="text-sm">
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ flexBasis: '50%' }}>
                                    <div>5 stars</div>
                                    <div>4 stars</div>
                                    <div>3 stars</div>
                                    <div>2 stars</div>
                                    <div>1 star</div>
                                </div>
                                <div className="space-y-1.5 pt-1.5" style={{ flexBasis: '50%', }}>
                                    <Ratingbar progress={30} />
                                    <Ratingbar progress={30} />
                                    <Ratingbar progress={30} />
                                    <Ratingbar progress={30} />
                                    <Ratingbar progress={30} />
                                </div>
                            </div>
                        </div>


                    </div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((post) => (
                    <SellerreviewItem data={undefined} />
                ))}

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
