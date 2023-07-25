import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { useEffect, useState } from "react";
import NotificationController from "../controller/NotificationController";
import {
  addNotificationsToState,
  incrementPage,
  saveCount,
  saveQuote,
} from "../../../redux/slices/NotificationSlice";
import FetchStatus from "../../../common/components/fetch_status/FetchStatus";
import { saveUserData } from "../../../redux/slices/UserSlice";
import moment from "moment";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import DailyQuotes from "./components/DailyQuotes";
import Notification from "./components/Notification";

const NotificationPage = () => {
  const notification = useAppSelector((state) => state.notification);
  const profile = useAppSelector((state) => state.user.profile);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const fetchCall = async () => {
    setLoading(true);
    setErr(false);
    const response = await NotificationController.fetchNotifications(
      notification.page
    );
    if (response.success) {
      dispatch(saveUserData({ ...profile!, unReadCount: 0 }));
      dispatch(incrementPage());
      if (response.data.quote) {
        dispatch(saveQuote(response.data.quote));
      }
      dispatch(addNotificationsToState(response.data.notifications.rows));
      dispatch(saveCount(response.data.notifications.count));
    } else {
      setErr(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!!!notification.notifications.length) {
      fetchCall();
    }
  }, []);
  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <CommonPageHeader title="Notifications" />
      </div>
      <div className="my-16"></div>

      {loading ? (
        <FetchStatus
          error={false}
          errorMessage="Something went wrong!!"
          loading={true}
          onReload={() => {}}
        />
      ) : err ? (
        <FetchStatus
          error={true}
          errorMessage="Something went wrong!!"
          loading={false}
          onReload={fetchCall}
        />
      ) : (
        <div>
          <DailyQuotes quote={notification.quote} />

          <div className="p-5">
            <h3 className="text-xl font-medium">Activity</h3>
            {notification.notifications.map((data, index, notifications) => {
              const currentdate = moment(data.timestamp).format("DD MMM YY");
              const recentdate =
                index === 0
                  ? null
                  : moment(notifications[index - 1].timestamp).format(
                      "DD MMM YY"
                    );
              return (
                <div key={data.notificationId} className="">
                  {index === 0 || currentdate !== recentdate ? (
                    <h4 className="my-5">{currentdate}</h4>
                  ) : null}
                  <Notification data={data} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
