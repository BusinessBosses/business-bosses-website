import React, { ReactNode } from "react";
import CommonPageHeader from "../../../common/components/headers/CommonPageHeader";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Assets from "../../../assets";
import ComputerHeader from "../../home/views/components/ComputerHeader";
import Popup from "reactjs-popup";
import UserAvatar from "../../../common/components/avatars/UserAvatar";
import { IoIosMore } from "react-icons/io";
import ComputerBossOfTheWeek from "../../home/views/components/ComputerBossOfTheWeek";

const SettingsPage = () => {
  return (
    <div>
      <div className="bg-[#f4f4f4] min-h-screen h-full mobile-only">
        <div className="fixed top-0 w-full z-50">
          <CommonPageHeader title="Settings" />
        </div>
        <div className="my-16"></div>
        <div className="p-5">
          <Tab onClick={() => { }} text="Community Rules" />
          <Tab onClick={() => { }} text="Invite a friends terms & conditions" />
          <Tab onClick={() => { }} text="Contact Us" />
          <Tab onClick={() => { }} text="Change Password" />
          <Tab onClick={() => { }} text="Delete Account" />
          <div className="my-10"></div>
          <Tab onClick={() => { }} text="Sign Out" />
          <div className="my-20 flex items-center justify-center">
            <img src={Assets.Logo} className="h-20 w-20" alt="" />
          </div>
        </div>
      </div>

      <div className="bg-[#ffffff] min-h-screen h-full computer-only">
        <ComputerHeader />
        <div className="computer-content">
          <div className="firstsection ml-5 lg:ml-40 mr-5 pl-0" style={{
            width: '30%',
            flexGrow: 0,
            overflow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 1,

          }}>
            <div className="" >


              <div className="flex items-center " >

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
          <div className="computer-main-content" style={{ width: '40%', flexGrow: 0 }} >
            <div className="mt-3">
              <CommonPageHeader title="Settings" />
            </div>
            <div className="my-3"></div>
            <div className="p-5">
              <Tab onClick={() => { }} text="Community Rules" />
              <Tab onClick={() => { }} text="Invite a friends terms & conditions" />
              <Tab onClick={() => { }} text="Contact Us" />
              <Tab onClick={() => { }} text="Change Password" />
              <Tab onClick={() => { }} text="Delete Account" />
              <div className="my-10"></div>
              <Tab onClick={() => { }} text="Sign Out" />
              <div className="my-20 flex items-center justify-center">
                <img src={Assets.Logo} className="h-20 w-20" alt="" />
              </div>
            </div>
          </div>

          <div style={{ borderRight: '1.2px solid rgba(0, 0, 0, 0.1)' }}></div>
          <div className="lastsection ml-5 mr-5 lg:mr-40 pr-0 mb-0" style={{
            width: '30%',
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

export default SettingsPage;

interface Props {
  onClick: VoidFunction;
  text: string;
}
const Tab = ({ onClick, text }: Props) => {
  return (

    <div>
      <div className="mobile-only">
        <button
          onClick={onClick}
          className="bg-white flex p-3 rounded-lg my-3 items-center justify-between w-full "
        >
          <p className="text-sm">{text}</p>
          <MdOutlineKeyboardArrowRight className="text-[#726F6F]" />
        </button>
      </div>

      <div className="computer-only">
        <button
          onClick={onClick}
          className="bg-[#f4f4f4] flex p-4 rounded-lg my-3 items-center justify-between w-full "
        >
          <p className="text-sm">{text}</p>
          <MdOutlineKeyboardArrowRight className="text-[#726F6F]" />
        </button>
      </div>
    </div>
  );
};
