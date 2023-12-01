import React from 'react';

import CommonPageHeader from '../../../common/components/headers/CommonPageHeader';
import Assets from '../../../assets';
import FilledButtonsmall from '../../../common/components/buttons/FilledButtonsmall';
import RoutesPath from '../../../constants/Routes';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const SubscriptionConfirmationPage: React.FC = () => {
    const navigate = useNavigate();



    return (
        <>
        <Helmet>
        <title>Payment Confirmation - Business Bosses</title>
      </Helmet>
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
                            Congratulations on becoming a valued subscriber! Welcome to our premium membership program. 🎉
                        </div>
                        <h2 className="text-sm font-bold lg:text-base my-5">Payment Confirmed</h2>
                        <div
                            className="px-8 py-10"
                            style={{
                                borderRadius: "16px",
                                background: "#f4f4f4",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "start",
                            }}
                        >
                            <div className="font-bold text-sm">What's included:</div>
                            <div className="mt-5 items-center" style={{ display: "flex" }}>
                                <Assets.Checkmark height={22} />
                                <span className="text-xs lg:text-base" style={{ marginLeft: "8px" }}>Premium Badge</span>
                            </div>
                            <div className="items-center mt-4" style={{ display: "flex" }}>
                                <img src={Assets.Coin} alt="" />
                                <span className="text-xs lg:text-base" style={{ marginLeft: "8px" }}>Get 500 coins per month</span>
                            </div>
                            <div className="items-center mt-3" style={{ display: "flex" }}>
                                <img src={Assets.Rocket} alt="" />
                                <span className="text-xs lg:text-base" style={{ marginLeft: "8px" }}>
                                    Boost post FREE with coins
                                </span>
                            </div>
                            <div className="text-xs lg:text-base items-center mt-3" style={{ display: "flex" }}>
                                <Assets.Moreconnections height={20} />
                                <span className='text-xs lg:text-base' style={{ marginLeft: "8px" }}>
                                    More connections & referrals
                                </span>
                            </div>
                            <div className="text-sm items-center mt-4" style={{ display: "flex" }}>
                                <Assets.Rankingicon height={20} />
                                <span className="text-xs lg:text-base" style={{ marginLeft: "8px" }}>
                                    Rank higher on posts & listing
                                </span>
                            </div>
                        </div>



                    </div>
                </main>

            </div>
            <div className='px-5 pt-5'>
                <FilledButtonsmall className='py-4 w-full' onClick={() => navigate(RoutesPath.home)} text={'Ok'} />
            </div>

        </div>
        </>
    );
};

export default SubscriptionConfirmationPage;
