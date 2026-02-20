import React from 'react';

import CommonPageHeader from '../../../common/components/headers/CommonPageHeader';
import Assets from '../../../assets';
import FilledButtonsmall from '../../../common/components/buttons/FilledButtonsmall';
import RoutesPath from '../../../constants/Routes';
import { useRouter } from 'next/navigation';
import { Padding } from '@mui/icons-material';
import { Helmet } from 'react-helmet';

const RenewSubscriptionConfirmationPage: React.FC = () => {
    const router = useRouter();



    return (
        <div>

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
                                className="w-7 h-7  rounded-full text-center border border-primary"
                                style={{
                                    borderWidth: "7px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontWeight: "bold",
                                    marginTop: "185px"


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
                                Congratulations on choosing to renew your Subscription! It's always great to have you as our premium member. 🎉
                            </div>
                            <h2 className="text-lg font-bold lg:text-base my-5" style={{ textAlign: "center" }}>Enjoy Premium Subscription!</h2>

                            <h2 className="text-sm font-bold lg:text-base mt-10 pb-20">Payment Confirmed</h2>



                        </div>
                    </main>

                </div>
                <div className='px-5 pt-10'>
                    <FilledButtonsmall className='py-4 w-full' onClick={() => router.push(RoutesPath.home)} text={'Ok'} />
                </div>

            </div>
        </div>
    );
};

export default RenewSubscriptionConfirmationPage;
