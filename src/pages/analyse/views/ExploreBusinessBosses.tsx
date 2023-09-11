import React, { ReactNode, useEffect, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import Popup from "reactjs-popup";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { useAppSelector } from "../../../redux/store/store";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import Analyserows from "./components/analyserows";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetails";
import axios from "axios";
import Loader from "../../../common/components/loader/Loader";

const ExploreBusinessBosses = () => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFeaturesDescription = async () => {
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
            const features = data.data.rows.find(
              (item: { title: string; }) => item.title === 'features'
            );

            if (features && features.description) {
              setDescription(features.description);
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

    fetchFeaturesDescription();
  }, []);
  return (
    <div>
      <div>
        <div>
          <div className="mobile-only">
            <div className=" top-0 w-full z-50 " style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>
              <CommonPageHeader title="Explore Business Bosses" />
            </div>

            <div className="p-5 mx-5 bg-white rounded-xl" style={{ minHeight: 'calc(100vh - 5rem)' }}>
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

            <div className="">
              <div className=" top-0 w-full z-50 " style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '15px solid rgba(244, 244, 244, 1)' }}>

                <CommonPageHeader title="Explore Business Bosses" />
              </div>


              <div className="p-5 mx-5 bg-white rounded-xl" style={{ minHeight: 'calc(100vh - 5rem)' }}>
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
  );
};

export default ExploreBusinessBosses;


