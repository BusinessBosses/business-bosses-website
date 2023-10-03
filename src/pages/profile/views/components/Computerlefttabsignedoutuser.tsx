import Assets from "../../../../assets";
import UserAvatar from "../../../../common/components/avatars/UserAvatar";
import { useNavigate } from "react-router-dom";
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


interface Props {
  data: User;
}

const Computerlefttabsignedoutuser = ({ data }: Props) => {
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.user);
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className=" " style={{ cursor: "pointer", height: "100vh", width: "100vh" }}>

      <div className="mt-5 ">
        <div className="flex items-top jusity-between gap-3">
          <div className="relative">
            <img className="rounded-xl" style={{ borderWidth: '1px' }} src={Assets.Lefttab} />
            <div className="absolute top-0 left-0 bg-white rounded-lg p-5 m-5">
              
              <div className="font-black text-lg pt-5"> View Complete Features</div>
              <div className="pb-80 pt-2">Please Sign Up for an account or Log in
                to your already created account</div>

            </div>

            <div className="bg-white absolute top-60 left-0.5 right-0.5">
              <Carousel 
                containerProps={{
                  style: {
                    width: "100%",
                    justifyContent: "space-between",
                    userSelect: "none"
                  }
                }}
                preventScrollOnSwipe
                swipeTreshold={60}
                activeSlideIndex={activeSlide}
                activeSlideProps={{
                  style: {
                    background: "#000000",
                    margin:'5px'
                  }
                }}
                onRequestChange={setActiveSlide}
                itemsToShow={2}
                speed={400}
                centerMode
              >
                {Array.from({ length: 10 }).map((item, index) => (
                  <div className="rounded-2xl"
                    style={{
                      background: "grey",
                      width: 300,
                      height: 300,
                      border: "0px solid white",
                      textAlign: "center",
                      lineHeight: "240px",
                      boxSizing: "border-box"
                    }}
                    key={index}
                  >
                    {index}
                  </div>
                ))}
              </Carousel>
              <div className="flex justify-center items-center pt-10">
                <FilledButton onClick={() => navigate(RoutesPath.register)} text={"Create an Account"} />
              </div>
              <div className="flex gap-2 justify-center pt-5">
                <div>Already have an Account?</div>
                <div className="font-bold text-primary" onClick={()=>navigate(RoutesPath.login)}>Login</div>
              </div>


            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Computerlefttabsignedoutuser;
