import { useState } from "react";
import CommonPageHeader from "../../common/components/headers/CommonPageHeader";
import PartnerCard from "./components/partnercard";
import OutlinedButton from "../../common/components/buttons/OutlinedButton";
import MobileBossOfTheWeek from "../home/views/components/BossOfTheWeek";
import { useAppSelector } from "../../redux/store/store";
import ComputerHeader from "../home/views/components/ComputerHeader";
import ComputerProfileDetails from "../profile/views/components/ComputerProfiledetailswcr";

const Bossuppartnerpage = () => {
  const profile = useAppSelector((state) => state.user);
  return (
    <div>
      <div className="bg-white mobile-only">
        <div
          className=" top-0 w-full z-50 mobile-only "
          style={{ position: "sticky", top: 0, zIndex: 100 }}
        >
          <CommonPageHeader title="Our Partners" />
        </div>

        <div style={{ borderTop: "15px solid #f4f4f4" }}></div>

        <PartnerCard
          partnerlogo={undefined}
          adtitle={"Partner ad title"}
          addescription={"description"}
          partnerurl={"http:sjkdjdkmdddd"}
        />
        <PartnerCard
          partnerlogo={undefined}
          adtitle={"Partner ad title"}
          addescription={"description"}
          partnerurl={"http:sjkdjdkmdddd"}
        />

        <div
          className="flex items-center px-5 py-3"
          style={{
            borderTop: "0.5px solid rgba(0, 0, 0, 0.1)",
            borderBottom: "0.5px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="font-bold flex-grow">Want to be a Partner?</div>
          <div>
            <OutlinedButton onClick={() => {}} text={"Message Us"} />
          </div>
        </div>
      </div>

      <div className="computer-only bg-[#fff]">
        <ComputerHeader />

        <div className="computer-content">
          <div
            className="firstsection ml-5 lg:ml-20 pr-5"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
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
          ></div>
          <div style={{ borderRight: "1.2px solid rgba(0, 0, 0, 0.1)" }}></div>
          <div
            className="lastsection pl-5 mr-5 mt-5 lg:mr-20 pr-0 mb-0"
            style={{
              width: "30%",
              flexGrow: 0,
              overflow: "none",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            {/* <div className="rounded-xl overflow-hidden" style={{}}>
              {profile.bossup ? (
                <MobileBossOfTheWeek bossOfTheWeek={profile.bossup!} />
              ) : null}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bossuppartnerpage;
