import React from "react";
import Post from "./Post";

const Posts = () => {
  return (
    <div className="grid grid-cols-2 gap-3 px-5 pt-5">
      {[1, 2, 3, 4, 5, 6].map((item) => {
        return (
          <Post
            key={item}
            imgUrl={
              item % 2 === 0
                ? "https://cdn.pixabay.com/photo/2023/06/12/11/34/mushrooms-8058299_640.jpg"
                : undefined
            }
          />
        );
      })}
    </div>
  );
};

export default Posts;
