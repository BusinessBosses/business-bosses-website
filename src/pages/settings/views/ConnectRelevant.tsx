import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/store/store";
import ConnectRelevantCard from "../components/ConnectRelevantCard";
import { User } from "../../../common/interfaces/user";
import serviceApi from "../../../services/serviceApi";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import { useDispatch } from "react-redux";
import { storeRelevantUsers } from "../../../redux/slices/UserSlice";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetails";

const ConnectRelevant = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const relevantUsers = useAppSelector((state) => state.user.relevantUsers);
  const dispatch = useDispatch();
  const [err, setErr] = useState<boolean>(false);
  const profile = useAppSelector((state) => state.user);

  const fetchRecommendedConnections = async () => {
    setLoading(true);
    setErr(false);
    const response = await serviceApi.fetch(
      "/connection/getRecommendedConnections?page=0&size=6"
    );
    if (response.success) {
      dispatch(storeRelevantUsers(response.data.rows));
      // setRecommendedConnections(response.data.rows);
    } else {
      setErr(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!!!relevantUsers.length) {
      fetchRecommendedConnections();
    }
  }, []);

  return (
    <div>
      <div
        className="computer-only"
        style={{
          backgroundColor: "#F4F4F4",
        }}
      >
        <CommonPageHeader title={"Connect"}/>
     
        
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
            onReload={fetchRecommendedConnections}
          />
        ) : null}
        <div className="grid grid-cols-2 gap-3 p-3">
          {relevantUsers.map((connect: User, index: number) => {
            return <ConnectRelevantCard connect={connect} key={index} />;
          })}
        </div>
      </div>
      <div
        className="computer-only rounded-2xl"
        style={{
          backgroundColor: "#F4F4F4",
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10,
        }}
      >
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
            onReload={fetchRecommendedConnections}
          />
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          {relevantUsers.map((connect: User, index: number) => {
            return <ConnectRelevantCard connect={connect} key={index} />;
          })}
        </div>
      </div>


      <div className="computer-only bg-[#fff]">
        <ComputerHeader />

        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profile.profile!} />
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "40%", flexGrow: 0 }}
          >
            <div
        className="mobile-only"
        style={{
          backgroundColor: "#F4F4F4",
        }}
      >
        <CommonPageHeader title={"Connect"}/>
     
        
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
            onReload={fetchRecommendedConnections}
          />
        ) : null}
        <div className="grid grid-cols-2 gap-3 p-3">
          {relevantUsers.map((connect: User, index: number) => {
            return <ConnectRelevantCard connect={connect} key={index} />;
          })}
        </div>
      </div>
      <div
        className="computer-only rounded-2xl"
        style={{
          backgroundColor: "#F4F4F4",
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10,
        }}
      >
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
            onReload={fetchRecommendedConnections}
          />
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          {relevantUsers.map((connect: User, index: number) => {
            return <ConnectRelevantCard connect={connect} key={index} />;
          })}
        </div>
      </div>
            
          </div>
          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="rounded-xl overflow-hidden" style={{}}>
              {profile.bossup ? (
                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      


    </div>
  );
};

export default ConnectRelevant;
