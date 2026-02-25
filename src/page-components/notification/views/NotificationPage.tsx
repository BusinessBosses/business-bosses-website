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
import ComputerHeader from "../../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetailswcr";
import { PartnerData } from "../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../common/interfaces/partnerdatatile";
import { Helmet } from "react-helmet";

interface Props {
  partnerData: PartnerData | null;
partnerDatatile: PartnerDatatile | null;
}

const NotificationPage: React.FC<Props> = ({ partnerData, partnerDatatile }) => {
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
       <Helmet>
        <title>Notifications - Business Bosses</title>
      </Helmet>
      <div className="mobile-only bg-white" style={{height:"100vh"}}>
        <div
          className="bg-white top-0 w-full z-50"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
          
          }}
        >
          <CommonPageHeader title="Notifications" />
        </div>

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
            <DailyQuotes quote={notification.quote} partnerData={partnerData}   partnerDatatile={partnerDatatile} />

            <div className="px-5 pt-5" >
              <h4 className="text-xl font-bold">Activity</h4>
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
                      <h4 className="my-5 text-sm font-[600]">{currentdate}</h4>
                    ) : null}
                    <Notification data={data} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="computer-only">
        <ComputerHeader partnerData={partnerData}   partnerDatatile={partnerDatatile}  />
        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5 "
            style={{
              width: "25%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profile!} />
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "50%", flexGrow: 0 }}
          >
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
                <div className="p-5">
                  <p className="text-xl font-black">Activity</p>
                  {notification.notifications.map(
                    (data, index, notifications) => {
                      const currentdate = moment(data.timestamp).format(
                        "DD MMM YY"
                      );
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
                    }
                  )}
                </div>
              </div>
            )}
          </div>
          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <div className="rounded-xl overflow-hidden" style={{}}>
              <DailyQuotes quote={notification.quote} partnerData={partnerData}   partnerDatatile={partnerDatatile} />
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default NotificationPage;
