import Assets from "../../../../assets";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useRouter } from "next/navigation";
import RoutesPath from "../../../../constants/Routes";
import { User } from "../../../../common/interfaces/user";
import { useAppSelector } from "../../../../redux/store/store";
import SubscribeButton from "../../../settings/components/Subscribebutton";
import ConnectRelevant from "../../../settings/views/ConnectRelevant";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";

interface Props {
  data: User;
}

const ComputerProfileDetailsonly = ({ data }: Props) => {
  const router = useRouter();
  const profile = useAppSelector((state) => state.user);

  // Function to handle the click event
  const handleProfileClick = () => {
    // Example: Navigate to a specific route when the profile is clicked
    router.push(RoutesPath.myProfile, { state: { userId: data.uid } });
  };

  return (
    <div className=" " style={{ cursor: "pointer", height: "100vh", width: "100vh" }}>
     
      <div className="mt-5 ">
        <div className="flex items-top jusity-between gap-3">
          <div className="flex flex-grow" onClick={handleProfileClick}>
            <UserAvatar imageSize="h-24 w-24" imageURL={data.photoUrl} />
            <div className="ml-5">
              <p className="text-xl font-semibold">{data.name}</p>
              <p className="text-lg font-medium">{data.category}</p>
              <p className="font-medium">{data.companyName}</p>
              <p className="text-sm font-light text-[#A9A9A9]">
                {data.location}
              </p>
              <div className="flex items-center mt-1">
                <div className="bg-[#F4F4F4] rounded-full mr-3 flex items-center py-1 px-2">
                  <img src={Assets.Coin} alt="" className="w-4 h-4" />
                  <small className="ml-2">{data.coinscount}</small>
                </div>
              </div>
            </div>
          </div>

          <Popup
              trigger={
                <div>
                  <IoIosMore size={25} />
                </div>
              }
              position="left top"
              on="click"
              closeOnDocumentClick
              contentStyle={{ padding: "0px", border: "none" }}
              modal 
              overlayStyle={{
                background: 'rgba(0, 0, 0, 0.8)', 
                zIndex: 1000, 
              }}
            >
             
            </Popup>
            
        </div>
        <div className="mt-2">
          <SubscribeButton />
        </div>

        
      </div>
    </div>
  );
};

export default ComputerProfileDetailsonly;
