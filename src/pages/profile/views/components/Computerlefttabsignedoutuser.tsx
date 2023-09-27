import Assets from "../../../../assets";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
import { User } from "../../../../common/interfaces/user";
import { useAppSelector } from "../../../../redux/store/store";
import SubscribeButton from "../../../settings/components/Subscribebutton";
import ConnectRelevant from "../../../settings/views/ConnectRelevant";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";
import { ReactNode } from "react";

interface Props {
  data: User;
}

const Computerlefttabsignedoutuser = ({ data }: Props) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user);

  // Function to handle the click event
  const handleProfileClick = () => {
    // Example: Navigate to a specific route when the profile is clicked
    navigate(RoutesPath.myProfile, { state: { userId: data.uid } });
  };

  return (
    <div className=" " style={{ cursor: "pointer", height: "100vh", width: "100vh" }}>

      <div className="mt-5 ">
        <div className="flex items-top jusity-between gap-3">
          <div className="relative">
            <img className="rounded-xl border-2" src={Assets.Lefttab} />
            <div className="absolute top-0 left-0 bg-white rounded-lg p-5 m-5">
              <div className="font-black text-lg pt-5"> View Complete Features</div>
              <div className="pb-80 pt-2">Please Sign Up for an account or Log in
                to your already created account</div>
               
            </div>

            <div className="bg-black absolute top-0 left-0 right0">
             
           </div>
          </div>







        </div>
      </div>
    </div>
  );
};

export default Computerlefttabsignedoutuser;
