
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

        <div className="bg-white px-4 py-3 mobile-only">

            <div className="bg-[#ffffff] p-3 mt-2 ">
                <div className=" gap-3 items-center">
                    <img src={partnerlogo} alt="" className="w-32 h-32 " />
                    <p className="text-[#383838] text-sm font-bold mr-10">{adtitle}</p>
                    <p className="text-[#383838] text-sm font-bold mr-10">{addescription}</p>
                    <p className="text-[#383838] text-sm font-bold mr-10">{partnerurl}</p>
                </div>

            </div>










        </div>
    );
};

export default PartnerCard;
