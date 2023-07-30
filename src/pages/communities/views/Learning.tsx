import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/store/store";
import { Industry } from "../../../common/interfaces/industry";
import CommunitiesController from "../controller/CommunitiesController";
import AppConstants from "../../../constants/consts";
import IndustryCard from "./components/IndustryCard";

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
      <div className="mobile-only bg-[#F4F4F4] px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          {learningIndustries.map((industry) => {
            return <IndustryCard industry={industry} key={industry.industryId} />;
          })}
        </div>
      </div>

      <div className="computer-only rounded-2xl" style={{backgroundColor:"#F4F4F4",paddingLeft:10,paddingRight:10, paddingTop:10, paddingBottom:10}}>
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
