import Assets from "../../../../assets";
import { NotificationProp } from "../../../../common/interfaces/notification";
interface Props {
  data: NotificationProp;
}
const Notification = ({ data }: Props) => {
  return (
    <div className="my-5">
      <div className="flex items-center gap-3 mt-2">
        <div className="circle-container" style={{
          width: '55px',
          height: '45px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: "#FFE8E9"
        }}>
          <Assets.ActiveNotification width={23} />
        </div>

        <div className="">
          <h4 className="font-bold">{data.title}</h4>
          <small className="line-clamp-1">{data.message && data.message !== ""
            ? data.message.length > 50
              ? data.message.slice(0, 50) + "..."
              : data.message
            : ""}</small>
        </div>
      </div>
      <div className="mt-3" style={{ borderBottom: "0.5px solid rgba(0, 0, 0, 0.1)" }}></div>
    </div>
  );
};

export default Notification;
