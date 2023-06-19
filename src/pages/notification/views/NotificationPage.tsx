import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Notification from "./components/Notification";
import DailyQuotes from "./components/DailyQuotes";

const NotificationPage = () => {
  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <CommonPageHeader title="Notifications" />
      </div>
      <div className="my-16"></div>
      <DailyQuotes />

      <div className="p-5">
        <h3 className="text-xl font-medium">Activity</h3>
        <Notification />
        <Notification />
        <Notification />
      </div>
    </div>
  );
};

export default NotificationPage;
