import Assets from "../../../assets";

interface Props {
    partnerlogo: any;
    adtitle: string;
    addescription: string;
    partnerurl: string;

}
const PartnerCard = ({
    partnerlogo,
    addescription,
    adtitle,
    partnerurl,
}: Props) => {
    return (
        <div>

            <div className="bg-white px-4 py-3 mobile-only flex justify-center items-center">

                <div className="bg-[#ffffff] p-3 mt-2 flex flex-col ">
                    <div className="pb-3 flex flex-col items-center"><img src={partnerlogo} alt="" className="w-40 h-40" /></div>
                    <p className="text-[#383838] text-md font-bold lg:text-base">{adtitle}</p>
                    <p className="text-[#383838] text-sm font-medium">{addescription}</p>
                    <div onClick={() => { }} className="flex items-center gap-2 bg-[#f4f4f4] py-3 px-5 mt-5 rounded-lg">
                        <Assets.Linkicon />
                        <p className="text-[#383838] text-xs lg:text-base font-light underline">{partnerurl}</p>
                    </div>
                </div>

            </div>

            <div className="mobile-only" style={{ borderTop: "15px solid #f4f4f4" }}></div>


            <div className="bg-[#f4f4f4] mx-1 rounded-lg computer-only flex justify-center items-center">

                <div className="bg-[#f4f4f4] py-1 mb-3 flex items-center ">
                    <div className="flex flex-col items-center rounded-xl mr-6"><img src={partnerlogo} alt="" className="w-20 h-20" /></div>
                    <div>
                        <p className="text-[#383838] text-md font-bold lg:text-base">{adtitle}</p>
                        <p className="text-[#383838] text-sm font-medium mb-2">{addescription}</p>
                        <div onClick={() => { }} className="flex items-center gap-2 bg-[#eaeaea] py-1 px-2 rounded-lg">
                            <Assets.Linkicon />
                            <p className="text-[#383838] text-xs lg:text-xs font-light underline">{partnerurl}</p>
                        </div>
                    </div>
                </div>

            </div>


        </div>

    );
};

export default PartnerCard;
