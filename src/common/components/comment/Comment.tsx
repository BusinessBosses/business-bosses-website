import UserAvatar from "../avatars/UserAvatar";
import { useRouter } from "next/navigation";
import RoutesPath from "../../../constants/Routes";
import { Comment as CommentStruct } from "../../interfaces/comment";
import trimText from "../../functions/trimText";
interface Props {
  comment: CommentStruct;
}
const Comment = ({ comment }: Props) => {
  const router = useRouter();
  return (
    <div className="my-5">
      <div
        onClick={() =>
          router.push(RoutesPath.PublicUserProfile, { state: comment.user })
        }
        className="flex items-center"
      >
        <UserAvatar
          imageURL={
            comment.user?.photoUrl 
          }
        />
         <div className="w-3"></div>
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
