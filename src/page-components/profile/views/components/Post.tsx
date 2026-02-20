import { AiOutlineMore } from "react-icons/ai";
import Popup from "reactjs-popup";
import GeneralPostsController from "../../../../common/controllers/GeneralPostsController";
import { useRouter } from "next/navigation";
import RoutesPath from "../../../../constants/Routes";
import { Post } from "../../../../common/interfaces/post";
import { useAppSelector } from "../../../../redux/store/store";
import { toast } from "react-toastify";
import { ReactNode } from "react";

interface Props {
  imgUrl?: string;
  title?: string;
  data: Post;
}
const ProfilePosts = ({ data, imgUrl, title }: Props) => {
  const router = useRouter();
  const profile = useAppSelector((state) => state.user.profile);
  return (
    <div className="relative ">
      {imgUrl ? (
        <img
          src={imgUrl}
          className="w-full h-36 object-cover rounded-lg"
          alt=""
        />
      ) : (
        <div className="bg-white h-36 p-3 rounded-lg text-sm ">
          <p className="line-clamp-6">{title}</p>
        </div>
      )}
      {data.user.uid === profile?.uid ? <button className="absolute top-2 right-2 bg-white rounded-full p-1">
        {
          <Popup
            trigger={
              <div>
                <AiOutlineMore size={20} />
              </div>
            }
            position="left top"
            on="click"
            closeOnDocumentClick
            contentStyle={{ padding: "0px", border: "none" }}

          >
            {
              (((close: any) =>
              (
                <div className=" bg-white shadow-xl rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                  <button
                    onClick={() => {
                      close();
                      router.push(RoutesPath.createPost, { state: data });
                    }}
                    className="menu-item border-none outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      GeneralPostsController.deletepost(data!.postId)
                      toast.success("Post Deleted Successfully")
                      close();
                    }}
                    className="menu-item border-none outline-none"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      close();
                      router.push(RoutesPath.promotePost, {
                        state: data!.postId,
                      });
                    }}
                    className="menu-item border-none outline-none"
                  >
                    Boost
                  </button>
                </div>
              )) as unknown) as ReactNode
            }
          </Popup>
        }

      </button> : null}
    </div>
  );
};

export default ProfilePosts;
