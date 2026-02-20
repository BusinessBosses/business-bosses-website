import React, { ReactNode, useEffect, useState } from "react";
import { PartnerData } from "../../common/interfaces/partnerdata";
import axios from "axios";
import { useRouter } from "next/navigation";
import CommonPageHeader from "../../common/components/headers/CommonPageHeader";
import Loader from "../../common/components/loader/Loader";
import { PartnerDatatile } from "../../common/interfaces/partnerdatatile";
import { useAppSelector } from "../../redux/store/store";
import MobileBossOfTheWeek from "../home/views/components/BossOfTheWeek";
import ComputerHeader from "../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../profile/views/components/ComputerProfiledetailswcr";
import Assets from "../../assets";
import Computerlefttabsignedoutuser from "../profile/views/components/Computerlefttabsignedoutuser";
import { Helmet } from "react-helmet";


interface Props {
    partnerData: PartnerData | null;
    partnerDatatile: PartnerDatatile | null;
}

const Liveevent: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
    const router = useRouter();
    const profile = useAppSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);


    return (
        <div>
             <Helmet>
        <title>Live Event - Business Bosses</title>
      </Helmet>
            <div>
                <div>
                    <div className="mobile-only">
                        <div className=" top-0 w-full z-50 " style={{ top: 0, zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>
                            <CommonPageHeader title="Live Events" />
                        </div>

                        <div className="p-0 bg-white rounded-2xl" >
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <img src={Assets.Liveeventback} alt="Live Event Background" />
                                    <div className="text-black " style={{
                                        position: 'absolute', top: '0', left: '0', bottom: '0',
                                        right: '0', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)'
                                    }}>
                                        <div className="bg-white rounded-xl p-5 m-10">
                                            <div className="px-5 pb-2 pt-5 text-center font-bold text-lg"> Oops!  </div>
                                            <div className="text-center pb-3 text-sm"> Live Event is only available on Business Bosses App. <br/>Download the App now!</div>
                                            <div className="mt-0" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <div style={{ width: '45%', display: 'flex', justifyContent: 'center' }}>
                                                    <Assets.Appstorelogo
                                                        onClick={() =>
                                                            (window.location.href = "https://apps.apple.com/gh/app/business-bosses-networking/id1569332982")
                                                        }
                                                    />
                                                </div>
                                                <div style={{ width: '45%', display: 'flex', justifyContent: 'center' }}>
                                                    <Assets.Playstorelogo
                                                        onClick={() =>
                                                            (window.location.href = "https://play.google.com/store/search?q=Business%20bosses&c=apps")
                                                        }
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                    </div>
                </div>
            </div>

            <div className='computer-only'>
                <ComputerHeader partnerData={partnerData} partnerDatatile={partnerDatatile} />

                <div className="computer-content">
                    <div
                        className="firstsection ml-5 lg:ml-20 pr-5"
                        style={{
                            width: "25%",
                            flexGrow: 0,
                            overflow: "none",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                        }}
                    >
                        <div className="">
              <div className=" flex items-center gap-3">
                {profile.profile?.email != `${process.env.REACT_APP_DUMMY_EMAIL}` ?
                  <ComputerProfileDetails data={profile.profile!} /> : <Computerlefttabsignedoutuser data={profile.profile!} />}
              </div>
            </div>
                    </div>
                    <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
                    <div
                        className="computer-main-content"
                        style={{ width: "50%", flexGrow: 0 }}
                    >
                        <div className="">
                            <div className=" top-0 w-full z-50 " style={{ top: 0, zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>

                                <CommonPageHeader title="Live Events" />

                            </div>


                            <div className="p-0 bg-white rounded-2xl" >
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <img src={Assets.Liveeventback} alt="Live Event Background" />
                                    <div className="text-black " style={{
                                        position: 'absolute', top: '0', left: '0', bottom: '0',
                                        right: '0', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)'
                                    }}>
                                        <div className="bg-white rounded-xl p-5 m-10">
                                            <div className="px-5 pb-2 pt-5 text-center font-bold text-2xl"> Oops!  </div>
                                            <div className="text-center pb-3"> Live Event is only available on Business Bosses App. <br/>Download the App now!</div>
                                            <div className="mt-0" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <div style={{ width: '35%', display: 'flex', justifyContent: 'center' }}>
                                                    <Assets.Appstorelogo
                                                        onClick={() =>
                                                            (window.location.href = "https://apps.apple.com/gh/app/business-bosses-networking/id1569332982")
                                                        }
                                                    />
                                                </div>
                                                <div style={{ width: '35%', display: 'flex', justifyContent: 'center' }}>
                                                    <Assets.Playstorelogo
                                                        onClick={() =>
                                                            (window.location.href = "https://play.google.com/store/search?q=Business%20bosses&c=apps")
                                                        }
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
                    <div
                        className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
                        style={{
                            width: "25%",
                            flexGrow: 0,
                            overflow: "none",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                        }}
                    >
                        <div className="rounded-xl overflow-hidden" style={{}}>
                            {profile.bossup ? (
                                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} partnerData={partnerData} partnerDatatile={partnerDatatile} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>



        </div>
    );
};

export default Liveevent;


