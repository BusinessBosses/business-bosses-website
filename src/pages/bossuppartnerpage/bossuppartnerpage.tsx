import { useState } from "react";
import CommonPageHeader from "../../common/components/headers/CommonPageHeader";
import PartnerCard from "./components/partnercard";
import OutlinedButton from "../../common/components/buttons/OutlinedButton";

const Bossuppartnerpage = () => {
    return (
        <div className="bg-white" >
            <div className=" top-0 w-full z-50 mobile-only " style={{ position: 'sticky', top: 0, zIndex: 100, }}>

                <CommonPageHeader title="Our Partners" />
            </div>

            <div style={{ borderTop: "15px solid #f4f4f4" }}></div>


            <PartnerCard partnerlogo={undefined} adtitle={"Partner ad title"} addescription={"description"} partnerurl={"http:sjkdjdkmdddd"} />
            <PartnerCard partnerlogo={undefined} adtitle={"Partner ad title"} addescription={"description"} partnerurl={"http:sjkdjdkmdddd"} />

            <div className="flex items-center px-5 py-3" style={{ borderTop: "0.5px solid rgba(0, 0, 0, 0.1)", borderBottom: "0.5px solid rgba(0, 0, 0, 0.1)" }}>
                <div className="font-bold flex-grow">Want to be a Partner?</div>
                <div>
                    <OutlinedButton onClick={() => { }} text={"Message Us"} />
                </div>
            </div>





        </div>
    );
};

export default Bossuppartnerpage;
