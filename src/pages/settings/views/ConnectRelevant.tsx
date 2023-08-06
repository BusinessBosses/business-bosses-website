import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/store/store";
import { Industry } from "../../../common/interfaces/industry";
import CommunitiesController from "../../communities/controller/CommunitiesController";
import AppConstants from "../../../constants/consts";
import IndustryCard from "../../communities/views/components/IndustryCard";
import ConnectRelevantCard from "../components/ConnectRelevantCard";

const ConnectRelevant = () => {
  
  return (
    <div>
    <div className="mobile-only" style={{backgroundColor:"#F4F4F4", paddingTop:140, paddingLeft:20, paddingRight:20}}>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map((item) => {
          return <ConnectRelevantCard key={item} />;
        })}
      </div>
    </div>
    <div className="computer-only rounded-2xl" style={{backgroundColor:"#F4F4F4", paddingTop:10, paddingLeft:10, paddingRight:10, paddingBottom:10}}>
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4, 5, 6].map((item) => {
        return <ConnectRelevantCard key={item} />;
      })}
    </div>
  </div>
  </div>
  );
};

export default ConnectRelevant;
