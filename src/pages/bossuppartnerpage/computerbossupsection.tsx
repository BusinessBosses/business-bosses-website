import { useState } from "react";
import CommonPageHeader from "../../common/components/headers/CommonPageHeader";
import PartnerCard from "./components/partnercard";
import OutlinedButton from "../../common/components/buttons/OutlinedButton";
import MobileBossOfTheWeek from "../home/views/components/BossOfTheWeek";
import { useAppSelector } from "../../redux/store/store";
import ComputerHeader from "../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../profile/views/components/ComputerProfiledetailswcr";

const ComputerBossuppartnersection = () => {
  const profile = useAppSelector((state) => state.user);


  const handleButtonClick = () => {
    const confirmMessage = 'Are you sure you want to leave this page?';
    if (window.confirm(confirmMessage)) {
      window.open('https://businessbosses.news/our-partners/', '_blank');
    } else {
     
    }
  };

  return (
    <div>
      <div className="bg-[#f4f4f4] rounded-2xl p-3">

        <PartnerCard
          partnerlogo={undefined}
          adtitle={"Partner ad title"}
          addescription={"description"}
          partnerurl={"http:sjkdjdkmdddd"}
        />
      

        <div
          className="flex items-center pt-2"
          style={{

          }}
        >
          <div className="font-bold flex-grow">Want to be a Partner?</div>
          <div>
            <button
              onClick={() => {
               handleButtonClick()
              }}
              className="bg-white px-6 py-1.5 rounded-xl"
              style={{
                border: '2px solid #F21C29',
                color: '#F21C29',
              }}
            >
              {"Message Us"}
            </button>

          </div>
        </div>
      </div>


    </div>
  );
};

export default ComputerBossuppartnersection;
