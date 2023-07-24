import UserAvatar from "../avatars/UserAvatar";
import FilledButton from "../buttons/FilledButton";
import { User } from "../../interfaces/user";
import OutlinedButton from "../buttons/OutlinedButton";
interface Props {
  profile: User;
  connected: boolean;
  onConnect: Function;
}
const ConnectTile = ({ profile, connected, onConnect }: Props) => {
  return (
    <div className="flex items-center justify-between my-10">
      <div className="flex items-start gap-3">
        <div className="flex-grow">
          <UserAvatar
            imageSize="w-12 h-12"
            imageURL={
              profile.photoUrl ??
              "https://cdn-icons-png.flaticon.com/128/149/149071.png"
            }
          />
        </div>
        <div className=" max-w-[75%]">
          <p className="text-[#333333] font-medium">{profile.username}</p>
          <p className="text-[#777777] text-sm line-clamp-1">
            {profile.category}
          </p>
        </div>
      </div>
      {connected ? (
        <OutlinedButton
          onClick={() => {
            onConnect(profile.uid);
          }}
          text="Connected"
        />
      ) : (
        <FilledButton
          onClick={() => {
            onConnect(profile.uid);
          }}
          text="Connect"
        />
      )}
    </div>
  );
};

export default ConnectTile;
