import React from "react";
import UserAvatar from "../avatars/UserAvatar";
import FilledButton from "../buttons/FilledButton";

const ConnectTile = () => {
  return (
    <div className="flex items-center justify-between my-10">
      <div className="flex items-start gap-3">
        <div className="flex-grow">
          <UserAvatar
            imageSize="w-12 h-12"
            imageURL="https://cdn.pixabay.com/photo/2023/06/12/19/32/metro-8059215_640.jpg"
          />
        </div>
        <div className="w-3/4">
          <p className="text-[#333333] font-medium">Isaac Akin</p>
          <p className="text-[#777777] text-sm line-clamp-1">
            Supplier of surveysdf asdf sdfasd fasdf
          </p>
        </div>
      </div>
      <FilledButton onClick={() => {}} text="Connect" />
    </div>
  );
};

export default ConnectTile;
