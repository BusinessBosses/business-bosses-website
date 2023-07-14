import Assets from "../../../assets";
interface Props {
  imageURL: string;
  isRanked?: boolean;
  imageSize?: string;
  badgeSize?: string;
}
const UserAvatar = ({ imageURL, isRanked, imageSize, badgeSize }: Props) => {
  return (
    <div className="flex">
      <div className="relative">
        <img
          src={imageURL}
          loading="lazy"
          className={`${imageSize ?? "h-12 w-12"} rounded-full object-cover `}
          alt=""
        />
        {isRanked ? (
          <div className="absolute bottom-0 right-0">
            <div className="bg-white p-1 rounded-full">
              <img
                src={Assets.Badge}
                className={`h-4 w-4 ${badgeSize} `}
                alt="badge"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserAvatar;
