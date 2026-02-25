import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useRouter } from "next/navigation";
import RoutesPath from "../../../../constants/Routes";
import { User } from "../../../../common/interfaces/user";
import { useAppSelector } from "../../../../redux/store/store";
import SubscribeButton from "../../../settings/components/Subscribebutton";
import ConnectRelevant from "../../../settings/views/ConnectRelevant";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";
import { ReactNode, useEffect, useRef, useState } from "react";
import FilledButton from "../../../../common/components/buttons/FilledButton";
import Carousel from "react-simply-carousel";
import Assets from "../../../../assets";

interface Props {
  data: User;
}

const Computerlefttabsignedoutuser = ({ data }: Props) => {
  const router = useRouter();
  const profile = useAppSelector((state) => state.user);
  const [activeSlide, setActiveSlide] = useState(0);
  const adImages = [
    Assets.ad1,
    Assets.ad2,
    Assets.ad3,
    Assets.ad4,
    Assets.ad5,
    Assets.ad6,
  ];

  return (
    <div className=" " style={{ cursor: "pointer", height: "100vh", width: "100vh" }}>
      <div className="mt-5 ">
        <div className="flex items-top jusity-between gap-3">
          <div className="relative">
            <img className="rounded-3xl" style={{ borderWidth: '1px' }} src={Assets.Lefttab} />
            <div className="absolute top-0 left-0 right-0 bg-white rounded-2xl p-5 m-5">
              <div className="font-black text-lg text-center pt-5"> View Complete Features</div>
              <div className="flex justify-center items-center pt-5">
                <FilledButton onClick={() => router.push(RoutesPath.register)} text={"Create an Account"} />
              </div>
              <div className="flex gap-2 justify-center pt-5 pb-20">
                <div>Already have an Account?</div>
                <div className="font-bold text-primary" onClick={() => router.push(RoutesPath.login)}>Login</div>
              </div>
            </div>
            <div className="bg-white absolute top-60 left-0.5 right-0.5">
              <Carousel
                containerProps={{
                  style: {
                    width: "100%",
                    justifyContent: "space-between",
                    userSelect: "none",
                  }
                }}
                autoplay
                autoplayDelay={1000}
                preventScrollOnSwipe
                swipeTreshold={60}
                activeSlideIndex={activeSlide}
                onRequestChange={setActiveSlide}
                itemsToShow={2}
                speed={400}
                centerMode
              >
                {adImages.map((imageUrl, index) => (
                  <div
                    className="rounded-3xl"
                    style={{
                      background: "grey",
                      width: 250,
                      height:300,
                      borderRight: "5px solid white",
                      borderLeft: "5px solid white",
                      textAlign: "center",
                      lineHeight: "240px",
                      boxSizing: "border-box",
                    }}
                    key={index}
                  >
                    <img src={imageUrl} />
                  </div>
                ))}

              </Carousel>
              <div
                className="px-5 pt-8"
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  borderRadius: "20px",
                  border: "1px solid white",
                  backdropFilter: "blur(1px)",
                  WebkitBackdropFilter: "blur(10px)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="text-[#333333]" style={{ textAlign: "center" }}>
                  No.1 App to Start, Grow And Promote Your Business.
                </div>
                <div className="text-[#333333]" style={{ textAlign: "center" }}>
                  Join Now for free & Unlock Your Potential
                </div>
                <div
                  className="mt-3"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div className="pr-2">
                    <Assets.Appstorelogo onClick={() => (window.location.href = "https://apps.apple.com/gh/app/business-bosses-networking/id1569332982")} />
                  </div>
                  <div>
                    <Assets.Playstorelogo onClick={() => (window.location.href = "https://play.google.com/store/search?q=Business%20bosses&c=apps")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Computerlefttabsignedoutuser;