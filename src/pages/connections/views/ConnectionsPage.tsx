import { useEffect, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Tabs from "./components/Tabs";
import ConnectTile from "../../../common/components/connects/ConnectTile";
import { User } from "../../../common/interfaces/user";
import ConnectionsController from "../controller/ConnectionsController";
import { useLocation, useNavigate } from "react-router-dom";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { saveUserData } from "../../../redux/slices/UserSlice";

const ConnectionsPage = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [data, setData] = useState<{
    connections: User[];
    connecteds: User[];
    suggestedUsers: User[];
  }>({ connecteds: [], connections: [], suggestedUsers: [] });
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const fetchConnects = async (userId: string) => {
    setLoading(true);
    setErr(false);
    const response = await ConnectionsController.fetchConnectionsData(userId);
    if (response.success) {
      setData({
        connecteds: response.data.connecteds.data,
        connections: response.data.connections.data,
        suggestedUsers: response.data.suggestedUsers.data.rows,
      });
    } else {
      setErr(true);
    }

    setLoading(false);
  };
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
  useEffect(() => {
    const state = location.state;
    if (!!!state) {
      navigate(-1);
    } else {
      fetchConnects(state.userId);
      setCurrentIndex(state.pageIndex ?? 0);
    }
  }, []);
  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <CommonPageHeader title="Connections" />
      </div>
      <div className="my-16" />
      <Tabs
        currentIndex={currentIndex}
        onChangeRoute={(index: number) => setCurrentIndex(index)}
      />
      {loading ? (
        <FetchStatus
          error={false}
          errorMessage="Something went wrong!!"
          loading={true}
          onReload={() => {}}
        />
      ) : null}
      {err ? (
        <FetchStatus
          error={true}
          errorMessage="Something went wrong!!"
          loading={false}
          onReload={() => {
            fetchConnects(location.state.userId);
          }}
        />
      ) : null}
      <div className="px-5 -mt-5">
        {currentIndex === 0
          ? data.connections.map((connect: User, index: number) => {
              return (
                <ConnectTile
                  connected={!!profile?.connecteds?.includes(connect.uid!)}
                  onConnect={connection}
                  profile={connect}
                  key={index}
                />
              );
            })
          : null}
        {currentIndex === 1
          ? data.connecteds.map((connect: User, index: number) => {
              return (
                <ConnectTile
                  connected={!!profile?.connecteds?.includes(connect.uid!)}
                  onConnect={connection}
                  profile={connect}
                  key={index}
                />
              );
            })
          : null}
        {currentIndex === 2
          ? data.suggestedUsers.map((connect: User, index: number) => {
              return (
                <ConnectTile
                  connected={!!profile?.connecteds?.includes(connect.uid!)}
                  onConnect={connection}
                  profile={connect}
                  key={index}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};

export default ConnectionsPage;
