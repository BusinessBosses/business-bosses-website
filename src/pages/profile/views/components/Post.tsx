import { AiOutlineMore } from "react-icons/ai";

interface Props {
  imgUrl?: string;
  title?: string;
}
const Post = ({ imgUrl, title }: Props) => {
  return (
    <div className="relative">
      {imgUrl ? (
        <img
          src={imgUrl}
          className="w-full h-36 object-cover rounded-lg"
          alt=""
        />
      ) : (
        <div className="bg-[rgba(0,0,0,0.1)] h-36 p-3 rounded-lg text-sm ">
          <p className="line-clamp-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            vero ab aperiam dolorum quaerat perferendis ex atque nostrum vitae
            magni voluptatibus, veritatis magnam, minima molestiae, illum
            accusamus error corrupti ut.
          </p>
        </div>
      )}
      <button className="absolute top-2 right-2 bg-white rounded-full p-1">
        <AiOutlineMore size={20} />
      </button>
    </div>
  );
};

export default Post;
