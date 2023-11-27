import Post from "./Post";
import { Post as PostProp } from "../../../../common/interfaces/post";
interface Props {
  posts: PostProp[];
}
const Posts = ({ posts }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 pt-4 bg-[#f4f4f4]" style={{}}>
      {posts.map((post) => {
        return (
          <Post
            key={post.postId}
            title={post.title}
            imgUrl={post.images ? post.images[0] : undefined}
          />
        );
      })}
    </div>
  );
};

export default Posts;
