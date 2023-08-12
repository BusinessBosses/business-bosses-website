import React from 'react';
import CommonPageHeader from '../../../common/components/headers/CommonPageHeader';
import ComputerHeader from '../../home/views/components/ComputerHeader';
import MobileBossOfTheWeek from '../../home/views/components/BossOfTheWeek';
import ComputerProfileDetails from '../../profile/views/components/ComputerProfiledetails';
import { useAppSelector } from '../../../redux/store/store';

const Invitetandcs = () => {
    const profile = useAppSelector((state) => state.user);
    return (
        <div>
            <div className='mobile-only'>
                <div className=" top-0 w-full z-50 " style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>

                    <CommonPageHeader title="Invite a Friend Terms and Conditions" />
                </div>


                <div className=" p-5 mx-5 bg-white rounded-xl" style={{ height: "100vh" }}>
                    <div>Text comes here</div>



                </div>

            </div>

            <div className='computer-only'>
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
                    ><div className=" top-0 w-full z-50 " style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>

                            <CommonPageHeader title="Invite a Friend Terms and Conditions" />
                        </div>


                        <div className=" p-5 mx-5 bg-white rounded-xl" style={{ height: "100vh" }}>
                            <div>Text comes here</div>



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

export default Invitetandcs;
