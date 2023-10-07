import { useNavigate } from "react-router-dom";
import Assets from "../../../../assets";
import RoutesPath from "../../../../constants/Routes";

interface Props {
    bossupby: string;
    bossupad: string;
}

const BossupPartnerstile = ({bossupad,bossupby  }: Props) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        const confirmMessage = 'Are you sure you want to leave this page?';
        if (window.confirm(confirmMessage)) {
          window.open('https://businessbosses.news/our-partners/', '_blank');
        } else {
         
        }
      };

    return (
        <div  className="bg-[#ffffff] flex items-center justify-between p-2 rounded-lg mt-2 lg:mt-0">
            <div className="flex items-center">
                <div
                    className="text-xs text-[#545151] pr-2"
                    onClick={()=>handleButtonClick()}
                    style={{
                        paddingRight: 10,
                        borderRight: "1.2px solid rgba(0, 0, 0, 0.5)",
                    }}
                >
                    {bossupby}
                </div>
                <p className="text-[#545151] font-semibold text-sm pl-2 py-1" onClick={()=>navigate(RoutesPath.bossuppartners)}>
                    {bossupad}
                </p>
            </div>
            <Assets.Nexticon className="text-[#232324]" width={20} />
        </div>

    );
}

export default BossupPartnerstile;

