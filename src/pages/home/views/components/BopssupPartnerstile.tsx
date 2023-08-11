import { useNavigate } from "react-router-dom";
import Assets from "../../../../assets";
import RoutesPath from "../../../../constants/Routes";

interface Props {
    bossupby: string;
    bossupad: string;
}

const BossupPartnerstile = ({  }: Props) => {
    const navigate = useNavigate();

    return (
        <div onClick={()=>navigate(RoutesPath.bossuppartners)} className="bg-[#ffffff] flex items-center justify-between p-2 rounded-lg mt-2">
            <div className="flex items-center">
                <small
                    className="text-xs text-[#545151] pr-2"
                    style={{
                        paddingRight: 10,
                        borderRight: "1.2px solid rgba(0, 0, 0, 0.5)",
                    }}
                >
                    {"bossupby"}
                </small>
                <p className="text-[#545151] font-semibold text-sm pl-2 py-1">
                    {"bossupad"}
                </p>
            </div>
            <Assets.Nexticon className="text-[#232324]" width={20} />
        </div>

    );
}

export default BossupPartnerstile;

