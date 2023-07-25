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
    <div className="">
      <div className="grid grid-cols-2 gap-3">
        {opportunitiesIndustries.map((industry) => {
          return <IndustryCard industry={industry} key={industry.industryId} />;
        })}
      </div>
    </div>
  );
};

export default Opportunities;
