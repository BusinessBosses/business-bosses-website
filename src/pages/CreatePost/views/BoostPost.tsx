import React, { useState } from 'react';
import CommonPageHeader from '../../../common/components/headers/CommonPageHeader';
import Assets from '../../../assets';
import FilledButtonsmall from '../../../common/components/buttons/FilledButtonsmall';
import RoutesPath from '../../../constants/Routes';
import { useNavigate } from 'react-router-dom';
import Chooseplancard from '../components/chooseplancard';

const BoostPost = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCoin, setIsCoin] = useState(false);
    const initPlan = '3'; // Initialize with the first plan
    const [selectedPlan, setSelectedPlan] = useState(initPlan);
    const navigate = useNavigate();

    const plans = [
        {
            amount: '3',
            duration: 'Duration 3 days',
            reach: 'Reach 500 to 850 people',
        },
        {
            amount: '5',
            duration: 'Duration 5 Days',
            reach: 'Reach 900 to 1.2k people',
        },
    ];

    // Function to handle plan selection
    const handlePlanSelect = (amount: React.SetStateAction<string>) => {
        if (selectedPlan !== amount) {
            setSelectedPlan(amount);
        }
    };
    
    return (
        <div>
            <div className="bg-white" style={{ height: '100vh' }}>
                <div
                    className="bg-white top-0 w-full z-50 "
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                    }}
                >
                    <div className="mobile-only bg-white">
                        <CommonPageHeader title="Boost Post" />
                    </div>
                </div>

                <div>
                    {/* Boost Banner */}
                    <div style={{ position: "relative" }}>
                        <img src={Assets.BoostBanner} alt="Boost Banner" />
                        <div style={{ position: "absolute", bottom: 20, left: 0, width: "100%", }}>
                            <div className='pl-5  text-white'>
                                <div className='font-black text-lg'> Reach</div>
                                <div className='font-black text-lg'> a Wider Audience</div>
                                <div className='flex pt-3'>
                                    <input type="checkbox" checked disabled />
                                    <div className='text-xs lg:text-base pl-2'>More likes on posts</div>
                                </div>
                                <div className='flex pt-1'>
                                    <input type="checkbox" checked disabled />
                                    <div className='text-xs lg:text-base pl-2'>More connections</div>
                                </div>
                                <div className='flex pt-1' >
                                    <input type="checkbox" checked disabled />
                                    <div className='text-xs lg:text-base pl-2'>More referrals</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Choose Your Plan */}
                    <div className='px-5 py-3 text-md font-bold'>Choose your Plan</div>
                    <div>
                        {plans.map((plan) => (
                            <div key={plan.amount}>
                                <Chooseplancard
                                    text={"$" + plan.amount + ".00"}
                                    duration={plan.duration}
                                    reach={plan.reach}
                                    isSelected={selectedPlan === plan.amount}
                                    onClick={() => handlePlanSelect(plan.amount)}
                                />
                                <div className='p-1.5'></div>
                            </div>
                        ))}
                    </div>

                    {/* Pay With Coin */}
                    <div>
                        <div className='flex px-5 py-3' style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={isCoin}
                                onChange={(e) => setIsCoin(e.target.checked)}
                            />
                            <div className='pl-3 text-sm'>Pay With Coin (100 Coins = $1)</div>
                        </div>
                        <div></div>
                    </div>

                    {/* Continue Button */}
                    <div className='px-5 py-3'>
                        <FilledButtonsmall className='w-full py-3.5' onClick={() =>
                            navigate(RoutesPath.boostpostconfirmationpage)
                        } text="Continue" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoostPost;
