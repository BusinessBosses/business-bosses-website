import UserAvatar from "../avatars/UserAvatar";
import FilledButton from "../buttons/FilledButton";
import { User } from "../../interfaces/user";
import OutlinedButton from "../buttons/OutlinedButton";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import FilledButtonsmall from "../buttons/FilledButtonsmall";
import OutlinedButtonsmall from "../buttons/OutlinedButtonsmall";
interface Props {
  profile: User;
  connected: boolean;
  onConnect: Function;
}
const ConnectTile = ({ profile, connected, onConnect }: Props) => {
  const navigate = useNavigate();
  const truncatedName = profile.name && profile.name.length > 20 ? `${profile.name.slice(0, 20)}...` : profile.name;
  return (
    <div>
      <div className="flex items-center justify-between my-3 " onClick={() =>
              navigate(RoutesPath.PublicUserProfile, { state: profile })
            }>
        <div className="flex items-start gap-3">
          <div className="flex-grow">
            <UserAvatar imageSize="w-12 h-12" imageURL={profile.photoUrl} />
          </div>
          <div className=" max-w-[75%]">
            <p className="text-[#333333] font-medium">{truncatedName}</p>
            <p className="text-[#777777] text-sm line-clamp-1">
              {profile.category}
            </p>
          </div>
        </div>
        {connected ? (
          <OutlinedButtonsmall
            onClick={() => {
              onConnect(profile.uid);
            }}
            text="Connected"
          />
        ) : (
          <FilledButtonsmall
            onClick={() => {
              onConnect(profile.uid);
            }}
            text="Connect"
          />
        )}
      </div>
      <div style={{ borderTop: "0.5px solid rgba(0, 0, 0, 0.1)" }}></div>
    </div>
  );
};

export default ConnectTile;
