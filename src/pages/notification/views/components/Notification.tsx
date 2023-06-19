import React from "react";
import Assets from "../../../../assets";

const Notification = () => {
  return (
    <div className="">
      <h4 className="my-5">16 Jun 23</h4>
      <div className="flex items-center gap-3 mt-2">
        <div className="">
          <img src={Assets.ActiveNotification} alt="" />
        </div>
        <div className="">
          <h4>Post Comment</h4>
          <small className="line-clamp-1">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          </small>
        </div>
      </div>
    </div>
  );
};

export default Notification;
