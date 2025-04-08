import React from "react";
import { useNavigate } from "react-router-dom";
import Assets from "../../../../assets";

interface NotificationButtonProps {
  padding?: number;
  topPadding?: number;
  hasUnreadNotification?: boolean;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  padding = 0,
  topPadding = 0,
  hasUnreadNotification = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/notifications"); // Adjust route as needed
  };

  return (
    <div
      className="relative cursor-pointer"
      onClick={handleClick}
      style={{
        marginRight: "10px",
        paddingBottom: `${padding}px`,
        paddingTop: `${topPadding}px`,
      }}
    >
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        <img
          src={Assets.NotificationIcon}
          alt="Notifications"
          className="w-5 h-5"
        />
      </div>

      {hasUnreadNotification && (
        <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
      )}
    </div>
  );
};

export default NotificationButton;
