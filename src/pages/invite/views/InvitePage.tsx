import React from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { MdContentCopy } from "react-icons/md";
import { useAppSelector } from "../../../redux/store/store";
import { toast } from "react-toastify";

const InvitePage = () => {
  const profile = useAppSelector((state) => state.user.profile);
  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        <CommonPageHeader title="Invite" />
      </div>
      <div className="my-16"></div>
      <div className="bg-[#f4f4f4] w-full h-5" />

      <div className="flex flex-col items-center p-5">
        <img src={Assets.Invite} className="w-32 h-32 object-contain" alt="" />
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
            <p className="text-[#333333]">{profile?.inviteId}</p>
          </div>
          <FilledButton
            onClick={async () => {
              await navigator.clipboard.writeText(profile?.inviteId ?? "");
              toast.success("Copied");
            }}
            text="Copy InviteID"
            icon={<MdContentCopy />}
          />
        </div>

        <div className="border-t-2 border-[#F6F6F6]" />
        <div className="flex items-center justify-between p-5">
          <small className="text-[#777777]">Accepted Invitation</small>
          <small className="text-[#333333]">{profile?.invitations}</small>
        </div>
        <div className="border-t-2 border-[#F6F6F6]" />

        <p className="font-semibold text-center underline text-primary text-sm mt-10">
          Terms and Conditions
        </p>
      </div>
      <div className="my-10"></div>
    </div>
  );
};

export default InvitePage;
