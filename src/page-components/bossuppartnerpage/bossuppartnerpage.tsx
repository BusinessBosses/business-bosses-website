import CommonPageHeader from "../../common/components/headers/CommonPageHeader";
import PartnerCard from "./components/partnercard";
import OutlinedButton from "../../common/components/buttons/OutlinedButton";
import { useAppSelector } from "../../redux/store/store";
import ComputerHeader from "../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../profile/views/components/ComputerProfiledetailswcr";
import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

interface PartnerData {
  partnerlogo: string | null;
  adtitle: string;
  addescription: string;
  partnerurl: string;
}

const Bossuppartnerpage = () => {
  const profile = useAppSelector((state) => state.user);
  const [partnerData, setPartnerData] = useState<PartnerData | null>({
    partnerlogo: null,
    adtitle: '',
    addescription: '',
    partnerurl: '',
  });

  const handlemessageusButtonClick = () => {
    const confirmMessage = 'Are you sure you want to leave this page?';
    if (window.confirm(confirmMessage)) {
      window.open('https://businessbosses.news/our-partners/', '_blank');
    } else {
      // Handle the cancel action
    }
  };


  const fetchPartnerData = async () => {
    try {
      const response = await axios.get('https://orca-app-5dg8w.ondigitalocean.app/api/v1/partner/all');
      console.log(response);
      
      
  
      if (response.status === 200) {
        const partnerData = response.data.data; // Access the "data" property
  
        if (partnerData && partnerData.rows) {
          // Check if "rows" exists and is an array
          const partners = partnerData.rows;
  
          // Find the partner with id 5
          const getTitle = partners.find((item: { id: number; }) => item.id === 12);
  
          if (getTitle) {
            setPartnerData({
              partnerlogo: getTitle.companyPhoto,
              adtitle: getTitle.companyName,
              addescription: getTitle.companyDescription,
              partnerurl: getTitle.companyUrl,
            });
          }
        }
      } else {
        console.error('Failed to fetch partner data.');
      }
    } catch (error) {
      console.error('Error fetching partner data:', error);
    }
  };

  useEffect(() => {
    fetchPartnerData();
  }, []);
  
  return (
    <div>
        <Helmet>
                <title>Our Partners - Business Bosses</title>
            </Helmet>
      <div className="bg-white mobile-only">
        <div
          className=" top-0 w-full z-50 mobile-only "
          style={{ position: "sticky", top: 0, zIndex: 100 }}
        >
          <CommonPageHeader title="Our Partners" />
        </div>

        <div style={{ borderTop: "15px solid #f4f4f4" }}></div>

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
       
        <div
          className="flex items-center px-5 py-3"
          style={{
            borderTop: "0.5px solid rgba(0, 0, 0, 0.1)",
            borderBottom: "0.5px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="font-bold flex-grow">Want to be a Partner?</div>
          <div>
            <OutlinedButton onClick={() => { handlemessageusButtonClick();}} text={"Message Us"} />
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Bossuppartnerpage;
