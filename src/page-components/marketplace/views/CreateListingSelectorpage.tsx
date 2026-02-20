import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useLocation, useRouter } from "next/navigation";
import FilledInput from "../../../common/components/inputs/FilledInput";
import FilledTextarea from "../../../common/components/inputs/FilledTextarea";
import { CountryDropdown } from "react-country-region-selector";
import Assets from "../../../assets";
import FilledButton from "../../../common/components/buttons/FilledButton";
import FilledSelect from "../../../common/components/inputs/FilledSelect";
import { MdCancel } from "react-icons/md";
import { Market } from "../../../common/interfaces/Market";
import MarketController from "../controller/MarketController";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import {
  addNewListing,
  updateListing,
} from "../../../redux/slices/MarketSlice";
import RoutesPath from "../../../constants/Routes";
import SellTabs from "../../profile/views/components/Selltabs";
import CreateListing from "./CreateListing";
import CreateServiceListing from "./CreateServiceListing";

const CreateListingSelectorpage = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);


  return (
    <div className="">
      <div style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff', borderBottom: '1.2px solid rgba(0, 0, 0, 0.1)' }}>
       

        <SellTabs currentIndex={currentIndex} onChangeRoute={(index: number) => setCurrentIndex(index)} />
        <div className="">
          {currentIndex === 0 ? (<CreateListing />) : null}
          {currentIndex === 1 ? (<CreateServiceListing />) : null}
        </div>


      </div>
    </div>
  );
};

export default CreateListingSelectorpage;
