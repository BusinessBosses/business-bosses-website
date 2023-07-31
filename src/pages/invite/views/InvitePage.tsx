import React, { ReactNode } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { MdContentCopy, MdOutlineKeyboardArrowRight } from "react-icons/md";
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

const InvitePage = () => {
  const profile = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="mobile-only">
        <div style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#fff', borderBottom: '1.2px solid rgba(0, 0, 0, 0.1)' }}>
          <CommonPageHeader title="Invite" />
        </div>

        <div className="flex flex-col items-center p-5">
          <img
            src={Assets.Invite}
            className="w-32 h-32 object-contain"
            alt=""
          />
          <p className="text-xl text-primary font-semibold mt-2">
            Invite 3 Friends
          </p>
          <small className="text-[#333333]">
            to join Business Bosses and get a Free Promotion
          </small>
          <small className="text-[#707070]">
            Copy link to share your InviteID with them
          </small>
        </div>

        <div className="">
          <div className="flex justify-between p-5">
            <div className="">
              <small className="text-[#707070]">Invite ID:</small>
              <p className="text-[#333333]">{profile.profile!.inviteId}</p>
            </div>
            <FilledButton
              onClick={async () => {
                await navigator.clipboard.writeText(profile.profile!.inviteId ?? "");
                toast.success("Copied");
              }}
              text="Copy InviteID"
              icon={<MdContentCopy />}
            />
          </div>

          <div className="border-t-2 border-[#F6F6F6]" />
          <div className="flex items-center justify-between p-5">
            <small className="text-[#777777]">Accepted Invitation</small>
            <small className="text-[#333333]">{profile.profile!.invitations}</small>
          </div>
          <div className="border-t-2 border-[#F6F6F6]" />

          <p className="font-semibold text-center underline text-primary text-sm mt-10">
            Terms and Conditions
          </p>
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

          </div>
          <div style={{ borderLeft: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="computer-main-content"
            style={{ width: "40%", flexGrow: 0 }}
          >
            <CommonPageHeader title="Invite" />
            <div className="flex flex-col items-center p-5">
              <img
                src={Assets.Invite}
                className="w-32 h-32 object-contain"
                alt=""
              />
              <p className="text-xl text-primary font-semibold mt-2">
                Invite 3 Friends
              </p>
              <small className="text-[#333333]">
                to join Business Bosses and get a Free Promotion
              </small>
              <small className="text-[#707070]">
                Copy link to share your InviteID with them
              </small>
            </div>

            <div className="">
              <div className="flex justify-between p-5">
                <div className="">
                  <small className="text-[#707070]">Invite ID:</small>
                  <p className="text-[#333333]">{profile.profile!.inviteId}</p>
                </div>
                <FilledButton
                  onClick={async () => {
                    await navigator.clipboard.writeText(profile.profile!.inviteId ?? "");
                    toast.success("Copied");
                  }}
                  text="Copy InviteID"
                  icon={<MdContentCopy />}
                />
              </div>

              <div className="border-t-2 border-[#F6F6F6]" />
              <div className="flex items-center justify-between p-5">
                <small className="text-[#777777]">Accepted Invitation</small>
                <small className="text-[#333333]">{profile.profile!.invitations}</small>
              </div>
              <div className="border-t-2 border-[#F6F6F6]" />

              <p className="font-semibold text-center underline text-primary text-sm mt-10">
                Terms and Conditions
              </p>
            </div>
            <div className="my-10"></div>

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
