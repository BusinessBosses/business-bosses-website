import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/store/store";
import { Industry } from "../../../common/interfaces/industry";
import CommunitiesController from "../controller/CommunitiesController";
import AppConstants from "../../../constants/consts";
import IndustryCard from "./components/IndustryCard";
import { Helmet } from "react-helmet";

const Opportunities = () => {
  const industries = useAppSelector((state) => state.industry.industries);
  const [opportunitiesIndustries, setOpportunitiesIndustries] = useState<
    Industry[]
  >([]);
  useEffect(() => {
    const filteredIndustries = CommunitiesController.getIndustriesByCategory(
      industries,
      AppConstants.OPPORTUNITIESID
    );
    setOpportunitiesIndustries(filteredIndustries);
  }, [industries]);
  return (
    <div>
     
      <Helmet>

        <title>Boss Up Opportunities - Business Bosses</title>
        <meta name="description"  content="Join a collaborative haven for entrepreneurs to explore and capitalize on diverse business opportunities. 
        Learn and thrive with like-minded leaders in this dynamic space. 
        Unleash your potential and seize the opportunities that shape success" />

        <meta itemProp="name" content="Business Bosses" />
        <meta itemProp="description"  content="Join a collaborative haven for entrepreneurs to explore and capitalize on diverse business opportunities. 
        Learn and thrive with like-minded leaders in this dynamic space. 
        Unleash your potential and seize the opportunities that shape success" />      <meta itemProp="image" content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png" />


        <meta property="og:url" content="https://businessbosses.co.uk" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Business Bosses" />
        <meta property="og:description" content="Join a collaborative haven for entrepreneurs to explore and capitalize on diverse business opportunities. 
        Learn and thrive with like-minded leaders in this dynamic space. 
        Unleash your potential and seize the opportunities that shape success" />
        <meta property="og:image" content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png" />


        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Bosses" />
        <meta name="twitter:description"  content="Join a collaborative haven for entrepreneurs to explore and capitalize on diverse business opportunities. 
        Learn and thrive with like-minded leaders in this dynamic space. 
        Unleash your potential and seize the opportunities that shape success" />
        <meta name="twitter:image" content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png" />

      </Helmet>
    <div className="mobile-only bg-[#F4F4F4] px-4 py-3">
      <div className="grid grid-cols-2 gap-3">
        {opportunitiesIndustries.map((industry) => {
          return <IndustryCard industry={industry} key={industry.industryId} />;
        })}
      </div>
    </div>

    <div className="computer-only rounded-2xl" style={{backgroundColor:"#F4F4F4",paddingLeft:10,paddingRight:10, paddingTop:10, paddingBottom:10}}>
      <div className="grid grid-cols-2 gap-3">
        {opportunitiesIndustries.map((industry) => {
          return <IndustryCard industry={industry} key={industry.industryId} />;
        })}
      </div>
    </div>

    </div>
  );
};

export default Opportunities;
