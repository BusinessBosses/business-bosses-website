import React, { useEffect, useState } from 'react';
import CommonPageHeader from '../../../common/components/headers/CommonPageHeader';
import ComputerHeader from '../../home/views/components/ComputerHeader';
import MobileBossOfTheWeek from '../../home/views/components/BossOfTheWeek';
import ComputerProfileDetails from '../../profile/views/components/ComputerProfiledetails';
import { useAppSelector } from '../../../redux/store/store';
import axios from 'axios';
import Loader from '../../../common/components/loader/Loader';

const CommunityRules = () => {
    const profile = useAppSelector((state) => state.user);
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRulesDescription = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get(
                    'https://orca-app-5dg8w.ondigitalocean.app/api/v1/admin'
                );

                if (response.status === 200) {
                    const data = response.data;
                    if (
                        data &&
                        data.data &&
                        data.data.rows &&
                        data.data.rows.length > 0
                    ) {
                        const rules = data.data.rows.find(
                            (item: { title: string; }) => item.title === 'rules'
                        );

                        if (rules && rules.description) {
                            setDescription(rules.description);
                        }
                    }
                }
            } catch (error) {
                // Handle network or parsing errors
                console.error('Error occurred while fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRulesDescription();
    }, []);

    return (
        <div>
            <div>
                {isLoading ? (
                    <div className="flex items-center justify-center">
                    <Loader size="w-10 h-10" />
                  </div>
                ) : (
                    <div>
                        <div className='mobile-only'>
                            <div className=" top-0 w-full z-50 " style={{
                                position: 'sticky', top: 0,
                                zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)'
                            }}>
                                <CommonPageHeader title="Community Rules" />
                            </div>
                            <div className="p-5 mx-5 bg-white rounded-xl" style={{ height: "100vh" }}>
                                {description ? (
                                    <div>{description}</div>
                                ) : (
                                    <div>No description available</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
                    >
                        <div>
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                <Loader size="w-10 h-10" />
                              </div>
                            ) : (
                                <div>

                                    <div className=" top-0 w-full z-50 " style={{
                                        position: 'sticky', top: 0,
                                        zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)'
                                    }}>
                                        <CommonPageHeader title="Community Rules" />
                                    </div>
                                    <div className="p-5 mx-5 bg-white rounded-xl">
                                        {description ? (
                                            <div>{description}</div>
                                        ) : (
                                            <div>No description available</div>
                                        )}
                                    </div>

                                </div>
                            )}
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

export default CommunityRules;
