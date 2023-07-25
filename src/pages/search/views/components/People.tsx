import React from "react";
import ConnectTile from "../../../../common/components/connects/ConnectTile";
import { User } from "../../../../common/interfaces/user";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import { saveUserData } from "../../../../redux/slices/UserSlice";
import ConnectionsController from "../../../connections/controller/ConnectionsController";
import FetchStatus from "../../../../common/components/fetch_status/FetchStatus";
interface Props {
  recommendedConnections: User[];
  loading: boolean;
  isSearching: boolean;
}
const People = ({ recommendedConnections, loading, isSearching }: Props) => {
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
    <div className="">
      <h3 className="text-[#333333] text-xl font-semibold">
        {isSearching ? "Searched Result" : "Recommended"}
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
          <ConnectTile
            connected={!!profile?.connecteds?.includes(connect.uid!)}
            onConnect={connection}
            profile={connect}
            key={index}
          />
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
