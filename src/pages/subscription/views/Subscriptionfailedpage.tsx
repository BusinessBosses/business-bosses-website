import React from 'react';

import CommonPageHeader from '../../../common/components/headers/CommonPageHeader';
import Assets from '../../../assets';
import FilledButtonsmall from '../../../common/components/buttons/FilledButtonsmall';
import RoutesPath from '../../../constants/Routes';
import { useNavigate } from 'react-router-dom';
import OutlinedButtonsmall from '../../../common/components/buttons/OutlinedButtonsmall';

const SubscriptionFailedPage: React.FC = () => {
    const navigate = useNavigate();



    return (
        <div className="mobile-only bg-white " style={{ height: "100vh" }} >
            <div
                className="bg-white top-0 w-full z-50"
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.02)",
                }}
            >
                <CommonPageHeader title="Payment Confirmation" />
            </div>
            <div className='flex px-5'>
                <div style={{ position: "relative" }}>
                    <div
                        className=''
                        style={{
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "4px",
                            height: "100%",
                            background: "transparent",
                            borderLeft: "4px dashed #f4f4f4",
                        }}
                    >
                    </div>
                    <div className='' style={{ position: "relative" }}>
                        <div
                            className="w-7 h-7 mt-5 rounded-full text-center border border-primary"
                            style={{
                                borderWidth: "7px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: "bold"
                            }}
                        ></div>
                        <div
                            className="w-7 h-7 mt-20 rounded-full text-center border border-primary"
                            style={{
                                borderWidth: "7px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: "bold",
                                marginTop: "120px"
                            }}
                        ></div>
                    </div>



                </div>


                <main>
                    <div className=" payment-confirmed ml-5 mt-5">
                        <div
                            className="px-8 py-10 text-xs lg:text-base font-[500]"
                            style={{
                                borderRadius: "16px",
                                background: "#f4f4f4",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "start",
                                textAlign: "center", 
                            }}
                        >
                           Oops! Payment Failed. Please try again!
                        </div>
                        



                    </div>
                </main>

            </div>
            <div className='px-5 pt-5'>
                <FilledButtonsmall className='py-4 w-full' onClick={() => navigate(RoutesPath.home)} text={'Retry Payment'} />
                <OutlinedButtonsmall className='py-4 mt-5 w-full' onClick={() => navigate(RoutesPath.home)} text={'Cancel'} />
            </div>

        </div>
    );
};

export default SubscriptionFailedPage;
