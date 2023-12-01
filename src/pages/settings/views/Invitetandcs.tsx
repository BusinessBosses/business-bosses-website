import React, { useEffect, useState } from 'react';
import CommonPageHeader from '../../../common/components/headers/CommonPageHeader';
import ComputerHeader from '../../home/views/components/ComputerHeader';
import MobileBossOfTheWeek from '../../home/views/components/BossOfTheWeek';
import ComputerProfileDetails from '../../profile/views/components/ComputerProfiledetailswcr';
import { useAppSelector } from '../../../redux/store/store';
import axios from 'axios';
import Loader from '../../../common/components/loader/Loader';
import { PartnerData } from '../../../common/interfaces/partnerdata';
import { PartnerDatatile } from '../../../common/interfaces/partnerdatatile';
import { Helmet } from 'react-helmet';

interface Props {
    partnerData: PartnerData | null;
partnerDatatile: PartnerDatatile | null;
  }
  const Invitetandcs: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
    const profile = useAppSelector((state) => state.user);
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTermsDescription = async () => {
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
                        const terms = data.data.rows.find(
                            (item: { title: string; }) => item.title === 'terms'
                        );

                        if (terms && terms.description) {
                            setDescription(terms.description);
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

        fetchTermsDescription();
    }, []);

    return (
        <div>
               <Helmet>
        <title>Invite a Friend Terms & Conditions - Business Bosses</title>
      </Helmet>
            <div>
                <div className='mobile-only'>
                    <div className=" top-0 w-full z-50 " style={{
                        position: 'sticky', top: 0,
                        zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)'
                    }}>
                        <CommonPageHeader title="Invite a Friend Terms and Conditions" />
                    </div>

                    <div className=" p-5 mx-5 bg-white rounded-xl" style={{ height: "100vh" }}>
                        {isLoading ? (
                            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 5rem)' }}>
                                <Loader size="w-10 h-10" />
                            </div>
                        ) : (
                            description ? (
                                <div>{description}</div>
                            ) : (
                                <div>No description available</div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <div className='computer-only'>
                <ComputerHeader partnerData={partnerData}   partnerDatatile={partnerDatatile}  />

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
                                <ComputerProfileDetails data={profile.profile!} />
                            </div>
                        </div>
                    </div>
                    <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
                    <div
                        className="computer-main-content"
                        style={{ width: "50%", flexGrow: 0 }}
                    >  <div className=''>
                    <div className=" top-0 w-full z-0 " style={{
                        position: 'sticky', top: 0,
                        zIndex: 100,
                    }}>
                       
                    </div>
                    <CommonPageHeader title="Invite a Friend Terms and Conditions" />
                    <div style={{borderBottom: '15px solid rgba(244, 244, 244, 1)'}}></div>

                    <div className=" p-5  bg-white rounded-xl" style={{ height: "100vh" }}>
                        {isLoading ? (
                            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 5rem)' }}>
                                <Loader size="w-10 h-10" />
                            </div>
                        ) : (
                            description ? (
                                <div>{description}</div>
                            ) : (
                                <div>No description available</div>
                            )
                        )}
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
                                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} partnerData={partnerData}   partnerDatatile={partnerDatatile} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>






        </div>
    );
};

export default Invitetandcs;
