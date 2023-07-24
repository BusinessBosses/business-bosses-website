import React, { ReactNode } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import Assets from "../../../assets";
import FilledButton from "../../../common/components/buttons/FilledButton";
import { MdContentCopy, MdOutlineKeyboardArrowRight } from "react-icons/md";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import RoutesPath from "../../../constants/Routes";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Popup from "reactjs-popup";
import { IoIosMore } from "react-icons/io";

const InvitePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mobile-only">
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
              <p className="text-[#333333]">zSSFrdggfyhjgjggig</p>
            </div>
            <FilledButton
              onClick={() => { }}
              text="Copy InviteID"
              icon={<MdContentCopy />}
            />
          </div>

          <div className="border-t-2 border-[#F6F6F6]" />
          <div className="flex items-center justify-between p-5">
            <small className="text-[#777777]">Accepted Invitation</small>
            <small className="text-[#333333]">1</small>
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
        <div className="firstsection ml-5 mr-5 lg:ml-20" style={{
            width: '30%',

            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            height: '100%'
          }}>
            <div className="" >


              <div className="flex items-center " onClick={() => navigate(RoutesPath.myProfile)}>

                <UserAvatar
                  imageSize="h-24 w-24"
                  imageURL="https://cdn.pixabay.com/photo/2023/06/12/07/15/spider-8057853__340.jpg"
                />
                <div className="ml-4">
                  <p className="text-xl font-semibold">Isaac Akin</p>
                  <p className="text-lg font-medium">Consultant</p>
                  <p className="font-medium">Digital Blogger</p>
                  <p className="text-sm font-light text-[#A9A9A9]">United Kingdom</p>
                </div>

                <div className="flex-grow" />
                <Popup
                  trigger={
                    <div>
                      <IoIosMore size={20} />
                    </div>
                  }
                  position="left top"
                  on="click"
                  closeOnDocumentClick
                  contentStyle={{ padding: "0px", border: "none" }}
                // arrow={false}
                >
                  {
                    (((close: any) => (
                      <div className=" bg-white shadow rounded-lg p-5 space-y-3 items-start justify-start flex flex-col">
                        <button
                          onClick={() => {
                            close();
                          }}
                          className="menu-item"
                        >
                          Hide
                        </button>
                        <button
                          onClick={() => {
                            close();
                          }}
                          className="menu-item"
                        >
                          Report
                        </button>
                      </div>
                    )) as unknown) as ReactNode
                  }
                </Popup>


              </div>
            </div>



          </div>
          <div style={{ borderLeft: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="computer-main-content" style={{ paddingTop: 80, width: '40%', flexGrow: 0 }} >
            <div className="bg-white p-5 flex items-center justify-between">
              <button onClick={() => navigate(-1)}>
                <BiArrowBack size={20} />
              </button>
              <p className="text-xl font-medium">{"Invite"}</p>
              <div />
            </div>
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
                  <p className="text-[#333333]">zSSFrdggfyhjgjggig</p>
                </div>
                <FilledButton
                  onClick={() => { }}
                  text="Copy InviteID"
                  icon={<MdContentCopy />}
                />
              </div>

              <div className="border-t-2 border-[#F6F6F6]" />
              <div className="flex items-center justify-between p-5">
                <small className="text-[#777777]">Accepted Invitation</small>
                <small className="text-[#333333]">1</small>
              </div>
              <div className="border-t-2 border-[#F6F6F6]" />

              <p className="font-semibold text-center underline text-primary text-sm mt-10">
                Terms and Conditions
              </p>
            </div>
          </div>
          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection ml-5 mr-5 mb-0 lg:mr-20" style={{width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            }}>
            <div className="" >
              <ComputerBossOfTheWeek />
              <div className="bg-[#F4F4F4] flex items-center justify-between p-2 rounded-lg mt-2">
                <small className="text-xs text-[#545151]">Boss Up by</small>
                <p className="text-[#545151] text-sm">
                  Business Bosses Company Limited
                </p>
                <MdOutlineKeyboardArrowRight className="text-[#726F6F]" />

              </div>

            </div>


          </div>

        </div>
      </div>

    </div>
  );
};

export default InvitePage;
