import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/store/store";
import { Industry } from "../../../common/interfaces/industry";
import CommunitiesController from "../controller/CommunitiesController";
import AppConstants from "../../../constants/consts";
import IndustryCard from "./components/IndustryCard";

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
    <div className="mobile-only bg-[#F4F4F4] p-5">
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
