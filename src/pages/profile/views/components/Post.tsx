import { AiOutlineMore } from "react-icons/ai";

interface Props {
  imgUrl?: string;
  title?: string;
}
const Post = ({ imgUrl, title }: Props) => {
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
      <button className="absolute top-2 right-2 bg-white rounded-full p-1">
       { <AiOutlineMore size={20} />}
      </button>
    </div>
  );
};

export default Post;
