import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/store/store";
import ConnectRelevantCard from "../components/ConnectRelevantCard";
import { User } from "../../../common/interfaces/user";
import serviceApi from "../../../services/serviceApi";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import { useDispatch } from "react-redux";
import { storeRelevantUsers } from "../../../redux/slices/UserSlice";

const ConnectRelevant = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const relevantUsers = useAppSelector((state) => state.user.relevantUsers);
  const dispatch = useDispatch();
  const [err, setErr] = useState<boolean>(false);

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
        className="mobile-only"
        style={{
          backgroundColor: "#F4F4F4",
          paddingTop: 140,
          paddingLeft: 20,
          paddingRight: 20,
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
  );
};

export default ConnectRelevant;
