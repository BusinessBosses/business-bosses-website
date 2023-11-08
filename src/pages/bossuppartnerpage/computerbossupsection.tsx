import { useState, useEffect } from "react";
import CommonPageHeader from "../../common/components/headers/CommonPageHeader";
import PartnerCard from "./components/partnercard";
import OutlinedButton from "../../common/components/buttons/OutlinedButton";
import { useAppSelector } from "../../redux/store/store";
import BossupPartnerstile from "../home/views/components/BopssupPartnerstile";
import { PartnerData } from "../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../common/interfaces/partnerdatatile";


interface ComputerBossuppartnersectionProps {
  partnerData: PartnerData | null;
partnerDatatile: PartnerDatatile | null;


}

const ComputerBossuppartnersection: React.FC<ComputerBossuppartnersectionProps> = ({ partnerData, partnerDatatile }) => {
  const profile = useAppSelector((state) => state.user);



  const handlemessageusButtonClick = () => {
    const confirmMessage = 'Are you sure you want to leave this page?';
    if (window.confirm(confirmMessage)) {
      window.open('https://businessbosses.news/our-partners/', '_blank');
    } else {
      // Handle the cancel action
    }
  };

 
  
  
  
  
  
  

  return (
    <div>
      <div className="bg-[#f4f4f4] rounded-2xl p-3">
        <BossupPartnerstile partnerDatatile={partnerDatatile} />

        {partnerData ? (
          <PartnerCard
            partnerlogo={partnerData.partnerlogo}
            adtitle={partnerData.adtitle}
            addescription={partnerData.addescription}
            partnerurl={partnerData.partnerurl}
          />
        ) : (
          <p>Loading partner data...</p>
        )}

        <div className="flex items-center pt-2">
          <div className="font-bold flex-grow">Want to be a Partner?</div>
          <div>
            <button
              onClick={() => {
                handlemessageusButtonClick();
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
