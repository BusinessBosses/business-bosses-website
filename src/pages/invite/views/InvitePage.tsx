import React, { ReactNode, useState } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import FilledButton from "../../../common/components/buttons/FilledButton";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { useAppSelector } from "../../../redux/store/store";
import { toast } from "react-toastify";
import RoutesPath from "../../../constants/Routes";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";
import { useNavigate } from "react-router-dom";
import MobileBossOfTheWeek from "../../home/views/components/BossOfTheWeek";
import { MdContentCopy, MdShare } from "react-icons/md";
import SubscribeButton from "../../settings/components/Subscribebutton";
import ComputerProfileDetails from "../../profile/views/components/ComputerProfiledetails";
import SharePopUp from "../../../common/components/share/SharePopUp";
import FilledButtonsmall from "../../../common/components/buttons/FilledButtonsmall";

interface Props {
  coins?: number;
}

const InvitePage = ({ coins }: Props) => {
  const profile = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const [showInviteDialog, setShowInviteDialog] = useState<boolean>(false);

  return (
    <div>
      <SharePopUp
        url={`Check out Business Bosses.\n
        An app to meet entrepreneurs and grow your business. Join now for FREE promotion\n
        https://businessbosses.onelink.me/xLWk/36a2ff16\n
        Invite id: ${profile.profile?.inviteId}`}
        onClose={() => setShowInviteDialog(false)}
        open={showInviteDialog}
      />
      <div className="mobile-only bg-white h-full ">
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#fff",
          }}
        >
          <div className="bg-white px-4 py-3 flex items-center justify-between">
            <button onClick={() => navigate(-1)}>
              <Assets.Backbutton />
            </button>
            <div className=" items-center">
              <div className="flex items-center ml-auto px-2 py-2 bg-[#F4F4F4] rounded-full">
                <div className="mr-1 text-xs font-bold">My Coin Balance </div>
                <div className="mr-1">
                  <img src={Assets.Coin} alt="" />
                </div>
                <p className="font-medium">
                  <span
                    className="font-bold text-xs"
                    style={{ color: "#333333" }}
                  >
                    {profile.profile?.coinscount}
                  </span>
                </p>
              </div>
            </div>
            <div></div> {/* This empty div helps in spacing */}
          </div>
          <div className="bg-white px-4 py-3 flex items-center justify-between">
            <div className="flex-grow text-center">
              <p className="text-xl font-bold">{ }</p>
            </div>
            <div></div> {/* This empty div helps in spacing */}
          </div>
        </div>

        <div className="flex flex-col items-center px-10">
          <div className="text-center text-xs font-bold mb-5 text-[#333333]">
            {" "}
            Give Coins to your favorite Bosses and receive them from other
            Bosses who love your work!
          </div>
          <img
            src={Assets.Invite}
            className="w-40 h-40 object-contain"
            alt=""
          />
          <div className="font-bold">Earn Coins!</div>
          <p className="text-xl text-primary font-semibold">Invite Friends</p>
          <div className="flex items-center">
            <small className="text-[#333333] text-xs font-bold">
              to join Business Bosses and get 20
            </small>
            <img src={Assets.Coin}></img>
          </div>
          <small className="text-[#333333] text-xs font-bold">
            for each friend.
          </small>

          <div className="mb-10 mt-5">
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f4f4f4', 
                    color: '#333333', 
                    borderRadius: '50px',
                    padding: '7px 15px',
                    fontSize: '13px', 
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }} onClick={() => navigate(RoutesPath.boostpost)}>
                    <span className='mr-2' style={{ color: '#333333' }} >Subscribe to Premium</span>
                    <Assets.Nexticon stroke="#F21C29" />
                  </div>
                
                </div>
        </div>

        <div style={{ borderTop: "0.5px solid rgba(0, 0, 0, 0.1)" }}></div>

        <div className="">
          <div className="flex justify-between px-5 py-2 items-center">
            <div className="">
              <small className="text-[#707070] text-xs">Invite ID:</small>
              <p className="text-[#333333] text-sm">
                {profile.profile!.inviteId}
              </p>
            </div>
            <div
              className=""
              onClick={async () => {
                await navigator.clipboard.writeText(
                  profile.profile!.inviteId ?? ""
                );
                toast.success("Copied");
              }}
            >
              <MdContentCopy size={23} />
            </div>

            <FilledButtonsmall
            className="py-3 px-5"
              onClick={async () => {
                // await navigator.clipboard.writeText(
                //   profile.profile!.inviteId ?? ""
                // );
                // toast.success("Copied");
                setShowInviteDialog(true);
              }}
              text="Invite"
              icon={<Assets.Inviteicon />}
            />
          </div>

          <div style={{ borderTop: "0.5px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div className="flex items-center justify-between px-5 py-4">
            <small className="text-[#777777]">Accepted Invitation</small>
            <small className="text-[#333333]">
              {profile.profile!.invitations}
            </small>
          </div>
          <div style={{ borderTop: "0.5px solid rgba(0, 0, 0, 0.1)" }}></div>
        </div>
        <div className="my-10"></div>
      </div>

      <div className="computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div
            className="firstsection ml-5 mr-5 lg:ml-20"
            style={{
              width: "30%",

              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
              height: "100%",
            }}
          >
            <div className="">
              <div className=" flex items-center gap-3">
                <ComputerProfileDetails data={profile.profile!} />
              </div>
            </div>
          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "40%", flexGrow: 0 }}
          >
            <div className=" bg-white h-full ">
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#fff",
                }}
              >
                <div className="bg-white px-4 py-3 flex items-center justify-between">
                  <button onClick={() => navigate(-1)}>
                    <Assets.Backbutton />
                  </button>
                  <div className=" items-center">
                    <div className="flex items-center ml-auto px-2 py-2 bg-[#F4F4F4] rounded-full">
                      <div className="mr-1 text-base font-bold">
                        My Coin Balance{" "}
                      </div>
                      <div className="mr-1">
                        <img src={Assets.Coin} alt="" />
                      </div>
                      <p className="font-medium">
                        <span
                          className="font-bold text-base"
                          style={{ color: "#333333" }}
                        >
                          {profile.profile?.coinscount}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div></div> {/* This empty div helps in spacing */}
                </div>
                <div className="bg-white px-4 py-3 flex items-center justify-between">
                  <div className="flex-grow text-center">
                    <p className="text-xl font-bold">{ }</p>
                  </div>
                  <div></div> {/* This empty div helps in spacing */}
                </div>
              </div>

              <div className="flex flex-col items-center px-10">
                <div className="text-center text-base font-bold mb-5">
                  {" "}
                  Give Coins to your favorite Bosses and receive them from other
                  Bosses who love your work!
                </div>
                <img
                  src={Assets.Invite}
                  className="w-40 h-40 object-contain"
                  alt=""
                />
                <div className="font-bold">Earn Coins!</div>
                <p className="text-xl text-primary font-semibold">
                  Invite Friends
                </p>
                <div className="flex items-center">
                  <small className="text-[#333333] text-base font-bold">
                    to join Business Bosses and get 20
                  </small>
                  <img src={Assets.Coin}></img>
                </div>
                <small className="text-[#333333] text-base font-bold">
                  for each friend.
                </small>

                <div className="mb-10 mt-5">
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f4f4f4', // Customize the background color as needed
                    color: '#333333', // Change the text color to #333333
                    borderRadius: '50px', // Adjust the radius to make the rectangle more or less round
                    padding: '7px 15px',
                    fontSize: '13px', // Change the font size to 14px
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }} onClick={() => navigate(RoutesPath.subscriptionpage)}>
                    <span className='mr-2' style={{ color: '#333333' }} >Subscribe to Premium</span>
                    <Assets.Nexticon stroke="#F21C29" />
                  </div>
                
                </div>
              </div>

              <div
                style={{ borderTop: "0.5px solid rgba(0, 0, 0, 0.1)" }}
              ></div>

              <div className="">
                <div className="flex justify-between px-5 py-2 items-center">
                  <div className="">
                    <small className="text-[#707070] text-xs">Invite ID:</small>
                    <p className="text-[#333333] text-base">
                      {profile.profile!.inviteId}
                    </p>
                  </div>
                  <div
                    className=""
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        profile.profile!.inviteId ?? ""
                      );
                      toast.success("Copied");
                    }}
                  >
                    <MdContentCopy size={23} />
                  </div>

                  <FilledButton
                    onClick={async () => {
                      setShowInviteDialog(true);
                    }}
                    text="Invite"
                    icon={<Assets.Inviteicon />}
                  />
                </div>

                <div
                  style={{ borderTop: "0.5px solid rgba(0, 0, 0, 0.1)" }}
                ></div>
                <div className="flex items-center justify-between px-5 py-4">
                  <small className="text-[#777777]">Accepted Invitation</small>
                  <small className="text-[#333333] text-base">
                    {profile.profile!.invitations}
                  </small>
                </div>
                <div
                  style={{ borderTop: "0.5px solid rgba(0, 0, 0, 0.1)" }}
                ></div>
              </div>
              <div className="my-10"></div>
            </div>
          </div>
          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection ml-5 mr-5 mt-5 mb-0 lg:mr-20"
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
              {profile.bossup ? (
                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
