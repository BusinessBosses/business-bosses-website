import Assets from "../../../../assets";
import { NotificationProp } from "../../../../common/interfaces/notification";
interface Props {
  data: NotificationProp;
}
const Notification = ({ data }: Props) => {
  return (
    <div className="my-5">
      <div className="flex items-center gap-3 mt-2">
        <div className="">
          <img src={Assets.ActiveNotification} alt="" />
        </div>
        <div className="">
          <h4>{data.title}</h4>
          <small className="line-clamp-1">{data.message}</small>
        </div>
      </div>
    </div>
  );
};

export default Notification;
