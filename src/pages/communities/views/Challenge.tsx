import { useEffect, useState } from "react";
import ForumCard from "../../../common/components/forum/ForumCard";
import ForumItem from "../../../common/components/forum/ForumItem";
import { Forum } from "../../../common/interfaces/forum";
import { Industry } from "../../../common/interfaces/industry";
import { useAppSelector } from "../../../redux/store/store";
import CommunitiesController from "../controller/CommunitiesController";
import AppConstants from "../../../constants/consts";
interface Props {
  forums: Forum[];
}
const Challenge = ({ forums }: Props) => {
  const [industry, setIndustry] = useState<Industry | null>(null);
  const industries = useAppSelector((state) => state.industry.industries);
  useEffect(() => {
    const filteredIndustries = CommunitiesController.getIndustriesByCategory(
      industries,
      AppConstants.BOSS_UP_CHALLENGE_CATEGORY_ID
    );
    if (!!filteredIndustries.length) {
      setIndustry(filteredIndustries[0]);
    }
  }, [industries]);
  return (
    <div>
      <ForumCard
        banner={industry?.photo!}
        didJoin={false}
        label={industry?.description ?? "Industry Description"}
        members={industry?.joinedUsers?.length ?? 0}
        onJoin={() => {}}
        topics={20}
      />
      <div className="p-5">
        {forums.map((forum) => (
          <ForumItem key={forum.forumId} data={forum} />
        ))}
      </div>
    </div>
  );
};

export default Challenge;
