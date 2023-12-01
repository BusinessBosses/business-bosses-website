import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/store/store";
import { Industry } from "../../../common/interfaces/industry";
import CommunitiesController from "../controller/CommunitiesController";
import AppConstants from "../../../constants/consts";
import IndustryCard from "./components/IndustryCard";
import { Helmet } from "react-helmet";

const Learning = () => {
  const industries = useAppSelector((state) => state.industry.industries);
  const [learningIndustries, setLearningIndustries] = useState<Industry[]>([]);

  useEffect(() => {
    const filteredIndustries = CommunitiesController.getIndustriesByCategory(
      industries,
      AppConstants.LEARNINGID
    );
    setLearningIndustries(filteredIndustries);
  }, [industries]);

  return (
    <div>
   
      <Helmet>

        <title>Boss Up Learning - Business Bosses</title>
        <meta name="description" content="Join a collaborative environment that encourages learning and development as an entrepreneur.
         Learn from other entrepreneurs about diverse range of perspectives" />

        <meta itemProp="name" content="Business Bosses" />
        <meta itemProp="description" content="Join a collaborative environment that encourages learning and development as an entrepreneur.
         Learn from other entrepreneurs about diverse range of perspectives" />       <meta itemProp="image" content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png" />


        <meta property="og:url" content="https://businessbosses.co.uk" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Business Bosses" />
        <meta property="og:description" content="Join a collaborative environment that encourages learning and development as an entrepreneur.
         Learn from other entrepreneurs about diverse range of perspectives" />
        <meta property="og:image" content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png" />


        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Bosses" />
        <meta name="twitter:description" content="Join a collaborative environment that encourages learning and development as an entrepreneur.
         Learn from other entrepreneurs about diverse range of perspectives" />
        <meta name="twitter:image" content="https://businessbosses.com.ng/appfiles/1699609610_43_1000103762.png" />

      </Helmet>

      <div className="mobile-only bg-[#F4F4F4] px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          {learningIndustries.map((industry) => {
            return <IndustryCard industry={industry} key={industry.industryId} />;
          })}
        </div>
      </div>

      <div className="computer-only rounded-2xl" style={{ backgroundColor: "#F4F4F4", paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }}>
        <div className="grid grid-cols-2 gap-3">
          {learningIndustries.map((industry) => {
            return <IndustryCard industry={industry} key={industry.industryId} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Learning;
