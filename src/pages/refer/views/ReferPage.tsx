import { useEffect, useState } from "react";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import trimText from "../../../common/functions/trimText";
import { useLocation, useNavigate } from "react-router-dom";
import ReferController from "../controller/ReferController";
import { User } from "../../../common/interfaces/user";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import { useAppSelector } from "../../../redux/store/store";
import { toast } from "react-toastify";

const ReferPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const myId = useAppSelector((state) => state.user.profile!.uid);
  const [refers, setRefers] = useState<User[]>([]);
  const [err, setErr] = useState<boolean>(false);
  const [referredUserId, setReferredUserId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const onRefer = async () => {
    if (!!!selectedUsers.length) return;
    if (processing) return;
    setProcessing(true);
    const response = await ReferController.referConnections({
      referBy: myId,
      referredUserUid: referredUserId!,
      referTo: selectedUsers,
    });
    if (response.success) {
      navigate(-1);
      toast.success("Success!!!");
    }
    setProcessing(false);
  };

  const onSelect = (userId: string) => {
    const check = selectedUsers.includes(userId);
    if (check) {
      const newSelecteds = selectedUsers.filter((ft) => ft !== userId);
      setSelectedUsers(newSelecteds);
    } else {
      setSelectedUsers((prev) => [...prev, userId]);
    }
  };
  const getReferables = async (userId: string) => {
    setLoading(true);
    const response = await ReferController.getReferableUsers(userId!);
    if (response.success) {
      setRefers(response.data);
    } else {
      setErr(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    const state = location.state;
    if (!!!state) {
      navigate(-1);
    } else {
      setReferredUserId(state);
      getReferables(state);
    }
  }, []);
  return (
    <div className="">
      <div
        className="bg-white top-0 w-full z-50"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1.2px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.02)",
        }}
      >
        <CommonPageHeader title="Refer" />
      </div>
      <div className="p-5">
        {loading ? (
          <FetchStatus
            error={false}
            errorMessage="Something went wrong!!"
            loading={true}
            onReload={() => {}}
          />
        ) : err ? (
          <FetchStatus
            error={true}
            errorMessage="Something went wrong!!"
            loading={false}
            onReload={() => {
              getReferables(referredUserId!);
            }}
          />
        ) : (
          <div className="">
            {refers.map((connection, index) => {
              return (
                <div
                  key={index}
                  className="flex my-5 items-center justify-between"
                >
                  <label htmlFor={`check_${index}`}>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        imageSize="w-10 h-10"
                        imageURL={
                          connection?.photoUrl ??
                          "https://cdn-icons-png.flaticon.com/128/149/149071.png"
                        }
                      />
                      <div className="">
                        <p className="text-[#333333] text-sm capitalize">
                          {connection.username}
                        </p>
                        <p className="text-xs text-[#777777]">
                          {trimText(connection.bio ?? "", 20)}
                        </p>
                      </div>
                    </div>
                  </label>
                  <input
                    id={`check_${index}`}
                    checked={selectedUsers.includes(connection.uid)}
                    type="checkbox"
                    onChange={() => {
                      onSelect(connection.uid);
                    }}
                    className=" accent-primary"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <button
        onClick={onRefer}
        disabled={processing || !!!selectedUsers.length}
        className="fixed py-2 px-5 bottom-5 right-10 rounded-full bg-primary text-white"
      >
        {processing ? "Processing" : ` Refer (${selectedUsers.length})`}
      </button>
    </div>
  );
};

export default ReferPage;
