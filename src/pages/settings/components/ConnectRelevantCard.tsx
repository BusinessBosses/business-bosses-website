import FilledButton from "../../../common/components/buttons/FilledButton";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { User } from "../../../common/interfaces/user";
import { saveUserData } from "../../../redux/slices/UserSlice";
import ConnectionsController from "../../connections/controller/ConnectionsController";
import OutlinedButton from "../../../common/components/buttons/OutlinedButton";
import Assets from "../../../assets";
interface Props {
  connect: User;
}
const ConnectRelevantCard = ({ connect }: Props) => {
  const profile = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
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
  return (
    <div className="bg-white shadow pt-4 rounded-xl">
      <div className="flex flex-col items-center">
        <img
          src={connect.photoUrl ?? Assets.NoProfile}
          alt="Profile"
          className="w-12 h-12 rounded-full mb-3"
        />
        <div className="text-center">
          <p className="text-lg font-semibold line-clamp-1 capitalize">
            {connect.username}
          </p>
          {!!!connect.category ? (
            <p className="text-gray-500 line-clamp-1 invisible">Category</p>
          ) : null}
          {connect.category ? (
            <p className="text-gray-500 line-clamp-1">{connect.category}</p>
          ) : null}
        </div>
        <div className="pt-2 pb-4">
          {!profile?.connecteds?.includes(connect.uid!) ? (
            <FilledButton
              onClick={() => {
                connection(connect.uid);
              }}
              text="Connect"
              className="px-2 py-1.5"
            />
          ) : (
            <OutlinedButton
              onClick={() => {
                connection(connect.uid);
              }}
              text="Connected"
              className="px-2 py-1.5"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectRelevantCard;
