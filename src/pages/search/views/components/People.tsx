import React from "react";
import ConnectTile from "../../../../common/components/connects/ConnectTile";
import { User } from "../../../../common/interfaces/user";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import { saveUserData } from "../../../../redux/slices/UserSlice";
import ConnectionsController from "../../../connections/controller/ConnectionsController";
import FetchStatus from "../../../../common/components/fetch_status/FetchStatus";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../../constants/Routes";
interface Props {
  recommendedConnections: User[];
  loading: boolean;
  isSearching: boolean;
}
const People = ({ recommendedConnections, loading, isSearching }: Props) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const connection = async (userId: string) => {
    if (profile?.connecteds?.includes(userId)) {
      const newUserData: User = {
        ...profile,
        connecteds: profile.connecteds?.filter((ft) => ft !== userId),
      };
      dispatch(saveUserData(newUserData));
      await ConnectionsController.disConnect(userId);
    } else {
      const newUserData: User = {
        ...profile,
        connecteds: [...profile?.connecteds!, userId],
      } as User;
      dispatch(saveUserData(newUserData));
      await ConnectionsController.connect(userId);
    }
  };
  return (
    <div className="bg-white">
      <h3 className="text-[#333333] bg-[#f1f1f1] text-sm pt-3 pb-3 pl-4">
        {isSearching ? "Searched Result" : "Recommended Connections"}
      </h3>
      {loading ? (
        <FetchStatus
          loading
          error={false}
          errorMessage=""
          onReload={() => {}}
        />
      ) : null}
      {recommendedConnections.map((connect: User, index: number) => {
        return (
          
          <div key={index} className="px-4" >
            <ConnectTile
              connected={!!profile?.connecteds?.includes(connect.uid!)}
              onConnect={connection}
              profile={connect}
            />
          </div>
        );
      })}
      {/* <ConnectTile />
      <ConnectTile />
      <ConnectTile />
      <ConnectTile />
      <ConnectTile />
      <ConnectTile />
   
      <ConnectTile />
      <ConnectTile />
      <ConnectTile /> */}
    </div>
  );
};

export default People;
