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
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import { PartnerData } from "../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../common/interfaces/partnerdatatile";
import { Helmet } from "react-helmet";

interface Props {
  partnerData: PartnerData | null;
partnerDatatile: PartnerDatatile | null;
}

const ConnectionsPage: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [data, setData] = useState<{
    connections: User[];
    connecteds: User[];
    suggestedUsers: User[];
  }>({ connecteds: [], connections: [], suggestedUsers: [] });


  const navigate = useNavigate();
  const location = useLocation();
  const profile = useAppSelector((state) => state.user.profile);
  const profilee = useAppSelector((state) => state.user);
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
        connectedCount: (profile?.connectedCount ?? 0) - 1,
      };
      dispatch(saveUserData(newUserData));
      await ConnectionsController.disConnect(userId);
    } else {
      const newUserData: User = {
        ...profile,
        connecteds: [...profile?.connecteds!, userId],
        connectedCount: (profile?.connectedCount ?? 0) + 1,
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
        <Helmet>
                <title>Connections - Business Bosses</title>
            </Helmet>
      {loading ? (
        <FetchStatus
          error={false}
          errorMessage="Something went wrong!!"
          loading={true}
          onReload={() => { }}
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
      <div className="mobile-only">
        <div className=""
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#fff",
          }}
        >
          <CommonPageHeader title="Connections" />
          <Tabs
            currentIndex={currentIndex}
            onChangeRoute={(index: number) => setCurrentIndex(index)}
          />
        </div>


        <div className="px-4 -mt-5">
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


      {loading ? null : <div className="computer-only bg-[#fff]">
        <ComputerHeader partnerData={partnerData}   partnerDatatile={partnerDatatile}  />

        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5"
            style={{
              width: "25%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profile!} />
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "50%", flexGrow: 0 }}
          >
            <div className="computer-only">
        <div className=""
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#fff",
          }}
        >
          <CommonPageHeader title="Connections" />
          <Tabs
            currentIndex={currentIndex}
            onChangeRoute={(index: number) => setCurrentIndex(index)}
          />
        </div>


        <div className="px-4 mt-4">
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

          </div>
          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "25%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="rounded-xl overflow-hidden" style={{}}>
              {profilee.bossup ? (
                <MobileBossOfTheWeek bossOfTheWeek={profilee.bossup!} partnerData={partnerData}   partnerDatatile={partnerDatatile} />
              ) : null}
            </div>
          </div>
        </div>
      </div>}


    </div>
  );
};

export default ConnectionsPage;
