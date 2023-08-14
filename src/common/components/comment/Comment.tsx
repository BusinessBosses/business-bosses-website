import UserAvatar from "../avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
import RoutesPath from "../../../constants/Routes";
import { Comment as CommentStruct } from "../../interfaces/comment";
import trimText from "../../functions/trimText";
interface Props {
  comment: CommentStruct;
}
const Comment = ({ comment }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="my-5">
      <div
        onClick={() =>
          navigate(RoutesPath.PublicUserProfile, { state: comment.user })
        }
        className="flex items-center gap-3"
      >
        <UserAvatar
          imageURL={
            comment.user?.photoUrl ??
            "https://cdn-icons-png.flaticon.com/128/149/149071.png"
          }
        />
        <div className="">
          <p className="text-[#333333] font-bold text-xs capitalize">
            {comment.user?.username}
          </p>
          <p className="text-xs text-[#777777]">
            {trimText(comment.user?.bio ?? "", 20)}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <p className=" font-[500] text-black break-words text-sm">{comment.comment}</p>
      </div>
    </div>
  );
};

export default Comment;
